import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASING, buildTransition } from '../../../motion/transitions';

export type DamagePopupEvent = {
  id: number;
  value: number;
};

export const DamagePopup = ({
  popup,
  direction,
  isHealing = false,
  onComplete,
}: {
  popup: DamagePopupEvent;
  direction: 'up' | 'down';
  isHealing?: boolean;
  onComplete: (id: number) => void;
}) => {
  const shouldReduceMotion = useReducedMotion() ?? false;
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
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      animate={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: travelDistance, scale: 2 }}
      transition={transition}
      onAnimationComplete={() => onComplete(popup.id)}
    >
      {isHealing ? '+' : '-'}
      {popup.value}
    </motion.div>
  );
};
