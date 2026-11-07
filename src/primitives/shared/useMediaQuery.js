import { useEffect, useState } from 'react';

/** SSR- and prerender-safe matchMedia hook: false on the server and the first client render, then the real value.
 *  No window access at import time (the site's Puppeteer prerender and React 19 hydration both require that). */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [query]);
  return matches;
}
