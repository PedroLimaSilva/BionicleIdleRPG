import { Download, RefreshCw } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import { getE2ePwaBannerState, isTestMode } from '../../utils/testMode';
import './PWABadge.scss';

export function PWABadge() {
  const period = 60 * 60 * 1000;
  const e2eBannerState = getE2ePwaBannerState();
  const shouldReduceMotion =
    (useReducedMotion() ?? false) || isTestMode() || e2eBannerState !== null;
  const [dismissed, setDismissed] = useState(false);

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === 'activated') {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener('statechange', (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === 'activated') registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  const showNeedRefresh =
    e2eBannerState === 'needRefresh' || (!isTestMode() && e2eBannerState === null && needRefresh);
  const visible =
    !dismissed && (isTestMode() ? e2eBannerState !== null : offlineReady || needRefresh);

  function close() {
    setDismissed(true);
    setOfflineReady(false);
    setNeedRefresh(false);
  }

  const panelTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.emphasized,
    },
    shouldReduceMotion
  );
  const skipEnterAnimation = shouldReduceMotion || e2eBannerState !== null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pwa-update-banner"
          role="alertdialog"
          aria-labelledby="pwa-update-title"
          aria-describedby="pwa-update-description"
          initial={skipEnterAnimation ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={panelTransition}
        >
          <div className="pwa-update-banner__content">
            <div className="pwa-update-banner__icon" aria-hidden="true">
              {showNeedRefresh ? <RefreshCw size={22} /> : <Download size={22} />}
            </div>
            <div className="pwa-update-banner__text">
              <h2 id="pwa-update-title" className="pwa-update-banner__title">
                {showNeedRefresh ? 'Update available' : 'Ready for offline play'}
              </h2>
              <p id="pwa-update-description" className="pwa-update-banner__description">
                {showNeedRefresh
                  ? 'A new version of the game is ready. Reload to get the latest content.'
                  : 'Your progress is cached and the game can be played without a connection.'}
              </p>
            </div>
          </div>
          <div className="pwa-update-banner__actions">
            {showNeedRefresh ? (
              <>
                <button type="button" className="button cancel-button" onClick={close}>
                  Later
                </button>
                <button
                  type="button"
                  className="button confirm-button"
                  onClick={() => updateServiceWorker(true)}
                >
                  Reload
                </button>
              </>
            ) : (
              <button type="button" className="button confirm-button" onClick={close}>
                Got it
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return;

  setInterval(async () => {
    if ('onLine' in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
