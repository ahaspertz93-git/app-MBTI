import { useEffect, useRef, useState } from 'react';
import { TYPES, type TypeKey } from '../data/types';
import ResultCard from '../components/ResultCard';
import { copyText } from '../lib/clipboard';
import { saveCardImage } from '../lib/saveImage';
import { shareResult } from '../lib/share';
import { kakaoEnabled, loadKakao, shareKakao } from '../lib/kakao';
import { readableOn } from '../lib/color';

interface Props {
  typeKey: TypeKey;
  fromQuiz: boolean;
  onStart: () => void;
  onGoStart: () => void;
}

export default function Result({ typeKey, fromQuiz, onStart, onGoStart }: Props) {
  const t = TYPES[typeKey];
  const [main, , , bg] = t.palette;
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number>(0);

  const say = (msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    document.title = `${t.key} ${t.name} · 성격 팔레트`;
    return () => {
      document.title = '성격 팔레트';
    };
  }, [t]);

  // 버튼을 누를 때 바로 공유 창이 뜨도록 SDK를 미리 불러 둔다.
  useEffect(() => {
    if (kakaoEnabled) loadKakao().catch(() => {});
  }, []);

  const copyOne = async (hex: string) =>
    say((await copyText(hex.toUpperCase())) ? `${hex.toUpperCase()} 복사됨` : '복사에 실패했어요. 코드를 길게 눌러 직접 복사해 주세요.');

  const copyAll = async () =>
    say((await copyText(t.palette.map((h) => h.toUpperCase()).join(', '))) ? '4색 코드를 모두 복사했어요' : '복사에 실패했어요.');

  const save = async () => {
    const r = await saveCardImage(t);
    if (r === 'saved') say('이미지를 저장했어요');
    else if (r === 'shared') say('이미지를 공유했어요');
    else if (r === 'failed') say('저장에 실패했어요. 화면을 캡처해 주세요.');
  };

  const share = async () => {
    const r = await shareResult(t);
    if (r === 'copied') say('링크를 복사했어요');
    else if (r === 'failed') say('공유에 실패했어요. 주소창의 링크를 복사해 주세요.');
  };

  const shareToKakao = async () => {
    if ((await shareKakao(t)) === 'failed') say('카카오톡 공유에 실패했어요. 링크 공유를 이용해 주세요.');
  };

  return (
    <main className="screen result" style={{ background: bg, color: readableOn(bg) }}>
      {!fromQuiz && (
        <div className="shared-banner" style={{ background: main, color: readableOn(main) }}>
          <span>친구가 공유한 결과예요</span>
          <button type="button" onClick={onStart}>
            나도 해보기
          </button>
        </div>
      )}

      <ResultCard type={t} onCopy={copyOne} />

      <div className="actions">
        <button type="button" className="primary" style={{ background: main, color: readableOn(main) }} onClick={copyAll}>
          4색 코드 복사
        </button>
        <button type="button" className="secondary" onClick={save}>
          이미지 저장
        </button>
        {kakaoEnabled && (
          <button type="button" className="kakao" onClick={shareToKakao}>
            카카오톡 공유
          </button>
        )}
        <button type="button" className="secondary" onClick={share}>
          링크 공유
        </button>
        <button type="button" className="ghost" onClick={fromQuiz ? onStart : onGoStart}>
          {fromQuiz ? '다시 하기' : '처음 화면으로'}
        </button>
      </div>
      <p className="fine">공식 성격 검사가 아닌 재미용 테스트예요.</p>

      <div className="toast" role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  );
}
