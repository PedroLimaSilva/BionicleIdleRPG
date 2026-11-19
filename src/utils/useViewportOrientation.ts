import { useEffect, useState } from 'react';
import { isPortraitViewport } from './viewportOrientation';

/**
 * Portrait vs landscape for chrome that still needs a JS class (nav, currency).
 * Prefers `orientation` media queries and also listens for visualViewport /
 * pageshow so foldable unfold/fold updates apply even when `orientationchange`
 * does not fire.
 */
export function useViewportOrientation(): boolean {
  const [isPortrait, setIsPortrait] = useState(isPortraitViewport);

  useEffect(() => {
    const sync = () => {
      setIsPortrait(isPortraitViewport());
    };

    sync();

    const mql =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(orientation: landscape)')
        : null;

    if (mql) {
      if (typeof mql.addEventListener === 'function') {
        mql.addEventListener('change', sync);
      } else {
        // Safari < 14
        mql.addListener(sync);
      }
    }

    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    window.addEventListener('pageshow', sync);
    window.visualViewport?.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('scroll', sync);

    return () => {
      if (mql) {
        if (typeof mql.removeEventListener === 'function') {
          mql.removeEventListener('change', sync);
        } else {
          mql.removeListener(sync);
        }
      }
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      window.removeEventListener('pageshow', sync);
      window.visualViewport?.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('scroll', sync);
    };
  }, []);

  return isPortrait;
}
