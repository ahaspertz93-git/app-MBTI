import type { PersonalityType } from '../data/types';
import { readableOn } from './color';
import { resultUrl } from './share';

// https://developers.kakao.com/docs/ko/javascript/download
const SDK_SRC = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
const SDK_INTEGRITY = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';
const JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY;
const THUMB = 800;
const FONT = '"Apple SD Gothic Neo", "Pretendard", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif';

export const kakaoEnabled = Boolean(JS_KEY);

let sdk: Promise<KakaoSDK> | null = null;

/** SDK 스크립트를 한 번만 불러오고 초기화한다. */
export function loadKakao(): Promise<KakaoSDK> {
  if (!JS_KEY) return Promise.reject(new Error('VITE_KAKAO_JS_KEY가 없습니다'));
  sdk ??= new Promise<KakaoSDK>((resolve, reject) => {
    const init = () => {
      const k = window.Kakao;
      if (!k) return reject(new Error('Kakao SDK를 불러오지 못했습니다'));
      if (!k.isInitialized()) k.init(JS_KEY);
      resolve(k);
    };
    if (window.Kakao) return init();
    const s = document.createElement('script');
    s.src = SDK_SRC;
    s.integrity = SDK_INTEGRITY;
    s.crossOrigin = 'anonymous';
    s.async = true;
    s.onload = init;
    s.onerror = () => {
      sdk = null;
      s.remove();
      reject(new Error('Kakao SDK를 불러오지 못했습니다'));
    };
    document.head.appendChild(s);
  });
  return sdk;
}

/** 카카오톡 미리보기용 정사각 썸네일. 유형 글자와 4색 띠만 그린다. */
function renderThumb(t: PersonalityType): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = THUMB;
  canvas.height = THUMB;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas를 사용할 수 없습니다');

  const [main, , , bg] = t.palette;
  const ink = readableOn(bg);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, THUMB, THUMB);

  ctx.fillStyle = main === bg ? ink : main;
  ctx.font = `800 150px ${FONT}`;
  ctx.fillText(t.key, 70, 230);
  ctx.fillStyle = ink;
  ctx.font = `700 60px ${FONT}`;
  ctx.fillText(t.name, 74, 320);

  const w = (THUMB - 140) / 4;
  t.palette.forEach((hex, i) => {
    ctx.fillStyle = hex;
    ctx.fillRect(70 + i * w, 400, w, 330);
  });
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 2;
  ctx.strokeRect(71, 401, THUMB - 142, 328);
  return canvas;
}

// 같은 유형을 다시 공유할 때 재업로드하지 않도록 기억해 둔다.
const thumbUrls = new Map<string, string>();

async function uploadThumb(k: KakaoSDK, t: PersonalityType): Promise<string> {
  const cached = thumbUrls.get(t.key);
  if (cached) return cached;
  const blob = await new Promise<Blob | null>((res) => renderThumb(t).toBlob(res, 'image/png'));
  if (!blob) throw new Error('썸네일을 만들지 못했습니다');
  const file = new File([blob], `palette-${t.key.toLowerCase()}.png`, { type: 'image/png' });
  const r = await k.Share.uploadImage({ file: [file] });
  thumbUrls.set(t.key, r.infos.original.url);
  return r.infos.original.url;
}

/** 카카오톡 공유. 썸네일 업로드에 실패하면 텍스트 메시지로 보낸다. */
export async function shareKakao(t: PersonalityType): Promise<'shared' | 'failed'> {
  try {
    const k = await loadKakao();
    const url = resultUrl(t);
    const link = { mobileWebUrl: url, webUrl: url };
    const start = { mobileWebUrl: window.location.origin, webUrl: window.location.origin };
    const buttons = [
      { title: '결과 보기', link },
      { title: '나도 해보기', link: start },
    ];

    let imageUrl: string | null = null;
    try {
      imageUrl = await uploadThumb(k, t);
    } catch {
      imageUrl = null;
    }

    if (imageUrl) {
      k.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `나의 성격 팔레트: ${t.key} ${t.name}`,
          description: t.desc,
          imageUrl,
          imageWidth: THUMB,
          imageHeight: THUMB,
          link,
        },
        buttons,
      });
    } else {
      k.Share.sendDefault({
        objectType: 'text',
        text: `나는 ${t.key} ${t.name}! ${t.desc}\n너의 색도 찾아봐`,
        link,
        buttons,
      });
    }
    return 'shared';
  } catch {
    return 'failed';
  }
}
