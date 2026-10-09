import { copyText } from './clipboard';
import type { PersonalityType } from '../data/types';

export const resultUrl = (t: PersonalityType) =>
  `${window.location.origin}/result/${t.key.toLowerCase()}`;

/** 기기 공유 시트를 열고, 지원하지 않으면 링크를 복사한다. */
export async function shareResult(t: PersonalityType): Promise<'shared' | 'copied' | 'failed' | 'cancelled'> {
  const url = resultUrl(t);
  if (navigator.share) {
    try {
      await navigator.share({
        title: `나의 성격 팔레트: ${t.key} ${t.name}`,
        text: `나는 ${t.key} ${t.name}! 너의 색도 찾아봐`,
        url,
      });
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled';
    }
  }
  return (await copyText(url)) ? 'copied' : 'failed';
}
