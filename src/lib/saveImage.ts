import { COLOR_ROLES, type PersonalityType } from '../data/types';
import { readableOn } from './color';

const W = 1080;
const H = 1920;
const FONT = '"Apple SD Gothic Neo", "Pretendard", "Malgun Gothic", "Noto Sans KR", system-ui, sans-serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth && line) {
      lines.push(line);
      line = ch.trim() === '' ? '' : ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** 결과 카드를 세로 비율(1080x1920) PNG로 그린다. */
export function renderCard(t: PersonalityType): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas를 사용할 수 없습니다');

  const [main, , , bg] = t.palette;
  const ink = readableOn(bg);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = ink;
  ctx.textBaseline = 'alphabetic';
  ctx.font = `600 40px ${FONT}`;
  ctx.fillText('나의 성격 팔레트', 90, 190);
  ctx.fillStyle = main === bg ? ink : main;
  ctx.font = `800 150px ${FONT}`;
  ctx.fillText(t.key, 90, 350);
  ctx.fillStyle = ink;
  ctx.font = `700 64px ${FONT}`;
  ctx.fillText(t.name, 90, 440);

  const top = 520;
  const bandH = 290;
  t.palette.forEach((hex, i) => {
    const y = top + i * bandH;
    ctx.fillStyle = hex;
    ctx.fillRect(90, y, W - 180, bandH - 12);
    ctx.strokeStyle = 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 2;
    ctx.strokeRect(91, y + 1, W - 182, bandH - 14);
    ctx.fillStyle = readableOn(hex);
    ctx.font = `600 38px ${FONT}`;
    ctx.fillText(COLOR_ROLES[i], 130, y + 84);
    ctx.font = `800 64px ${FONT}`;
    ctx.fillText(hex.toUpperCase(), 130, y + 186);
  });

  ctx.fillStyle = ink;
  ctx.font = `500 42px ${FONT}`;
  wrap(ctx, t.desc, W - 180).forEach((line, i) => ctx.fillText(line, 90, 1745 + i * 60));
  ctx.globalAlpha = 0.6;
  ctx.font = `500 30px ${FONT}`;
  ctx.fillText('공식 검사가 아닌 재미용 테스트', 90, 1860);
  ctx.globalAlpha = 1;
  return canvas;
}

/** PNG로 저장한다. 파일 공유를 지원하는 기기는 공유 시트, 아니면 다운로드. */
export async function saveCardImage(t: PersonalityType): Promise<'saved' | 'shared' | 'cancelled' | 'failed'> {
  try {
    const canvas = renderCard(t);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return 'failed';
    const file = new File([blob], `palette-${t.key.toLowerCase()}.png`, { type: 'image/png' });

    const isTouch = /iPhone|iPad|Android/i.test(navigator.userAgent);
    if (isTouch && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: `${t.key} 팔레트` });
        return 'shared';
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return 'saved';
  } catch {
    return 'failed';
  }
}
