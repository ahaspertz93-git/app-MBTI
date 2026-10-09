import { useEffect, useRef, useState } from 'react';
import type { PersonalityType } from '../data/types';
import PaletteSwatches from './PaletteSwatches';

// 피그마(Interactive Eye Following Card) 기준 치수. 눈 204px, 눈동자 76px.
const EYE = 204;
const PUPIL = 76;
// 디자인 원본의 기본 눈동자 위치 (눈 중심 기준 오프셋)
const DEFAULT_LEFT = { x: 74.8272 - EYE / 2, y: 78.3184 - EYE / 2 };
const DEFAULT_RIGHT = { x: 119.032 - EYE / 2, y: 117.787 - EYE / 2 };

function Eye({ isRightEye }: { isRightEye: boolean }) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const base = isRightEye ? DEFAULT_RIGHT : DEFAULT_LEFT;
  const [pos, setPos] = useState(base);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const eye = eyeRef.current;
      if (!eye) return;
      const rect = eye.getBoundingClientRect();
      // 화면 폭에 따라 눈이 줄어들 수 있으므로 디자인 좌표(204px 기준)로 환산해 계산한다.
      const scale = rect.width / EYE;
      const dx = (e.clientX - (rect.left + rect.width / 2)) / scale;
      const dy = (e.clientY - (rect.top + rect.height / 2)) / scale;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 1) {
        setPos(base);
        return;
      }
      const maxMovement = EYE / 2 - PUPIL / 2 - 5;
      const move = Math.min(distance, maxMovement);
      setPos({ x: base.x + (dx / distance) * move, y: base.y + (dy / distance) * move });
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [base]);

  // translate %는 눈동자 크기 기준이라 디자인 px을 눈동자 지름으로 나눠 비율로 옮긴다.
  const tx = (pos.x / PUPIL) * 100;
  const ty = (pos.y / PUPIL) * 100;

  return (
    <div ref={eyeRef} className="rc-eye">
      <div className="rc-pupil" style={{ transform: `translate(-50%, -50%) translate(${tx}%, ${ty}%)` }} />
    </div>
  );
}

interface Props {
  type: PersonalityType;
  onCopy: (hex: string) => void;
}

export default function ResultCard({ type: t, onCopy }: Props) {
  const [main] = t.palette;

  return (
    <section className="result-card">
      <div className="rc-monster" style={{ background: main }} aria-hidden="true">
        <div className="rc-eyes">
          <Eye isRightEye={false} />
          <Eye isRightEye={true} />
        </div>
      </div>
      <div className="rc-legend">
        <div className="rc-hero">
          <h1 className="type-key">{t.key}</h1>
          <p className="type-name">{t.name}</p>
        </div>
        <p className="type-desc">{t.desc}</p>
      </div>
      <PaletteSwatches palette={t.palette} onCopy={onCopy} />
      <p className="fine">색을 누르면 코드가 복사돼요.</p>
    </section>
  );
}
