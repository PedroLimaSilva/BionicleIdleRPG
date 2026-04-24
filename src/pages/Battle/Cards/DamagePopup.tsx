import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASING, buildTransition } from '../../../motion/transitions';
import { isTestMode } from '../../../utils/testMode';

export type DamagePopupEvent = {
  id: number;
  value: number;
  /** Used to scale number size: min(1 + value/maxHp, 2) for damage popups */
  maxHp: number;
};

export const DamagePopup = ({
  direction,
  isHealing = false,
  onComplete,
  popup,
}: {
  popup: DamagePopupEvent;
  direction: 'up' | 'down';
  isHealing?: boolean;
  onComplete: (id: number) => void;
}) => {
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();
  const maxHpSafe = Math.max(1, popup.maxHp);
  const fontScale = isHealing ? 1 : Math.min(1 + popup.value / maxHpSafe, 2);
  const travelDistance = direction === 'up' ? -40 : 40;
  const transition = buildTransition(
    {
      duration: MOTION_DURATION.verySlow,
      ease: MOTION_EASING.standard,
    },
    shouldReduceMotion
  );

  return (
    <motion.div
      key={popup.id}
      className={`damage-popup ${direction} ${isHealing ? 'healing' : ''}`}
      style={{ fontSize: `${fontScale}rem` }}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
      animate={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 2, y: travelDistance }}
      transition={transition}
      onAnimationComplete={() => onComplete(popup.id)}
    >
      {isHealing ? '+' : '-'}
      {popup.value}
    </motion.div>
  );
};
