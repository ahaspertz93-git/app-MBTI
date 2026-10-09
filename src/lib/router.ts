import { useSyncExternalStore } from 'react';

// 화면이 4개뿐이라 라우터 라이브러리 없이 History API만 쓴다.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('popstate', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('popstate', cb);
  };
}

const getPath = () => window.location.pathname.replace(/\/+$/, '') || '/';

export function usePath(): string {
  return useSyncExternalStore(subscribe, getPath, () => '/');
}

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  if (opts.replace) window.history.replaceState(null, '', to);
  else window.history.pushState(null, '', to);
  listeners.forEach((l) => l());
  window.scrollTo(0, 0);
}
