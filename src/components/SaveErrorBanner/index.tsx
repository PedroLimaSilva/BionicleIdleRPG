import { AlertTriangle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';
import {
  SavePersistenceErrorReason,
  subscribeSavePersistenceError,
} from '../../services/gamePersistence';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import { isTestMode } from '../../utils/testMode';
import './SaveErrorBanner.scss';

const MESSAGES: Record<SavePersistenceErrorReason, { description: string; title: string }> = {
  quota: {
    description:
      'Your browser could not store the latest progress. Free space or export a backup from Settings before closing the tab.',
    title: 'Save failed — storage full',
  },
  unknown: {
    description:
      'Your progress could not be saved. Keep this tab open and try again from Settings if the problem continues.',
    title: 'Save failed',
  },
};

export function SaveErrorBanner() {
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();
  const [error, setError] = useState<SavePersistenceErrorReason | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => subscribeSavePersistenceError(setError), []);

  useEffect(() => {
    if (error) {
      setDismissed(false);
    }
  }, [error]);

  const visible = error !== null && !dismissed;
  const copy = error ? MESSAGES[error] : null;

  const panelTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.emphasized,
    },
    shouldReduceMotion
  );

  return (
    <AnimatePresence>
      {visible && copy && (
        <motion.div
          className="save-error-banner"
          role="alertdialog"
          aria-labelledby="save-error-title"
          aria-describedby="save-error-description"
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={panelTransition}
        >
          <div className="save-error-banner__content">
            <div className="save-error-banner__icon" aria-hidden="true">
              <AlertTriangle size={22} />
            </div>
            <div className="save-error-banner__text">
              <h2 id="save-error-title" className="save-error-banner__title">
                {copy.title}
              </h2>
              <p id="save-error-description" className="save-error-banner__description">
                {copy.description}
              </p>
            </div>
          </div>
          <div className="save-error-banner__actions">
            <button
              type="button"
              className="button confirm-button"
              onClick={() => setDismissed(true)}
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
