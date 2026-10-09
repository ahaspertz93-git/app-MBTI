import { useEffect, useRef, useState } from 'react';
import type { Answer } from '../data/questions';
import type { TypeKey } from '../data/types';
import { computeType } from '../lib/scoring';
import { QUESTIONS } from '../data/questions';
import lottieUrl from '../asset/loading-lottie.json?url';

interface Props {
  answers: Answer[];
  onReady: (key: TypeKey) => void;
  onInvalid: () => void;
}

const DELAY_MS = 1500;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

export default function Loading({ answers, onReady, onInvalid }: Props) {
  const complete = answers.length === QUESTIONS.length;
  const [reduce] = useState(prefersReducedMotion);
  const [failed, setFailed] = useState(false);
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!complete) {
      onInvalid();
      return;
    }
    const timer = window.setTimeout(() => onReady(computeType(answers)), reduce ? 300 : DELAY_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 움직임 줄이기 사용자에겐 로티(1.8MB)를 아예 불러오지 않는다.
  useEffect(() => {
    if (reduce || !complete) return;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    import('lottie-web/build/player/lottie_svg')
      .then(({ default: lottie }) => {
        if (cancelled || !lottieRef.current) return;
        const anim = lottie.loadAnimation({
          container: lottieRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: lottieUrl,
        });
        anim.addEventListener('data_failed', () => setFailed(true));
        destroy = () => anim.destroy();
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [reduce, complete]);

  const showStatic = reduce || failed;

  return (
    <main className="screen loading" role="status" aria-live="polite">
      {showStatic ? (
        <div className="loading-blocks" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
      ) : (
        <div className="loading-lottie" ref={lottieRef} aria-hidden="true" />
      )}
      <p className="lead">당신의 색을 고르는 중…</p>
    </main>
  );
}
