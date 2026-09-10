import { Expand, Download } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { BattlePhase } from '../../hooks/useBattleState';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import {
  canOfferPwaInstall,
  getPwaInstallPlatform,
  isPwaInstalled,
  type PwaInstallPlatform,
} from '../../utils/pwaInstall';
import { getE2ePwaInstallState, isTestMode } from '../../utils/testMode';
import './index.scss';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const INSTALL_INSTRUCTIONS: Record<
  PwaInstallPlatform,
  { title: string; description: string; steps: string[]; footer: string }
> = {
  android: {
    description: 'Add Bionicle to your home screen for a fullscreen app experience.',
    footer: 'Launch Bionicle from your home screen to play outside the browser.',
    steps: [
      'Tap the menu (⋮) in Chrome.',
      'Tap Install app or Add to Home screen.',
      'Confirm when prompted.',
    ],
    title: 'Install as App',
  },
  desktop: {
    description: 'Install the game for quick access and a dedicated app window.',
    footer: 'You can always uninstall from your browser or system settings.',
    steps: ['Use the Install button below, or look for the install icon in your address bar.'],
    title: 'Install Bionicle',
  },
  ios: {
    description: "Add Bionicle to your Home Screen to open it without Safari's bars.",
    footer: 'Open Bionicle from your Home Screen to begin.',
    steps: [
      'Tap Share in Safari.',
      'Choose Add to Home Screen.',
      'Keep Open as Web App on, then tap Add.',
    ],
    title: 'Install as App',
  },
};

function useNativeInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      return true;
    }
    return false;
  }, [deferredPrompt]);

  return { deferredPrompt, promptInstall };
}

export function PwaInstallPrompt() {
  const e2eState = getE2ePwaInstallState();
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode() || e2eState !== null;
  const [installed, setInstalled] = useState(() => isPwaInstalled());
  const [modalOpen, setModalOpen] = useState(false);
  const { deferredPrompt, promptInstall } = useNativeInstallPrompt();
  const platform = getPwaInstallPlatform();
  const { battle } = useGame();
  const { pathname } = useLocation();

  const battleActive =
    Boolean(battle.currentEncounter) &&
    !(
      battle.phase === BattlePhase.Retreated ||
      (battle.phase === BattlePhase.Defeat && battle.outcomePresentationReady) ||
      (battle.phase === BattlePhase.Victory && battle.outcomePresentationReady)
    );

  useEffect(() => {
    const mediaQueries = ['(display-mode: standalone)', '(display-mode: fullscreen)'].map((query) =>
      window.matchMedia(query)
    );

    const syncInstalled = () => setInstalled(isPwaInstalled());
    mediaQueries.forEach((mq) => mq.addEventListener('change', syncInstalled));
    return () => mediaQueries.forEach((mq) => mq.removeEventListener('change', syncInstalled));
  }, []);

  const forceVisible = e2eState === 'visible';
  const showInstallOffer =
    forceVisible ||
    (!isTestMode() &&
      e2eState === null &&
      canOfferPwaInstall({ hasNativeInstallPrompt: !!deferredPrompt }));

  const showTrigger =
    showInstallOffer && !installed && !battleActive && pathname !== '/privacy-policy';

  const copy = INSTALL_INSTRUCTIONS[platform];
  const showNativeInstall = Boolean(deferredPrompt) && platform !== 'ios';

  const panelTransition = buildTransition(
    { duration: MOTION_DURATION.base, ease: MOTION_EASING.emphasized },
    shouldReduceMotion
  );

  async function handleNativeInstall() {
    const accepted = await promptInstall();
    if (accepted) {
      setInstalled(true);
      setModalOpen(false);
    }
  }

  return (
    <>
      <AnimatePresence>
        {showTrigger && (
          <motion.button
            type="button"
            className="pwa-install-trigger"
            aria-label="Install app for fullscreen play"
            onClick={() => setModalOpen(true)}
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={panelTransition}
          >
            <Expand size={18} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && showInstallOffer && (
          <motion.div
            className="pwa-install-backdrop"
            role="presentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={panelTransition}
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              className="pwa-install-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="pwa-install-title"
              aria-describedby="pwa-install-description"
              initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 8 }}
              transition={panelTransition}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="pwa-install-panel__icon" aria-hidden="true">
                <Expand size={20} />
              </div>
              <h2 id="pwa-install-title" className="pwa-install-panel__title">
                {copy.title}
              </h2>
              <p id="pwa-install-description" className="pwa-install-panel__description">
                {copy.description}
              </p>
              <ol className="pwa-install-panel__steps">
                {copy.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="pwa-install-panel__footer">{copy.footer}</p>
              <div className="pwa-install-panel__actions">
                {showNativeInstall && (
                  <button
                    type="button"
                    className="button confirm-button pwa-install-panel__install"
                    onClick={handleNativeInstall}
                  >
                    <Download size={16} aria-hidden="true" />
                    Install
                  </button>
                )}
                <button
                  type="button"
                  className="button confirm-button pwa-install-panel__dismiss"
                  onClick={() => setModalOpen(false)}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
