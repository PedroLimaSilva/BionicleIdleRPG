import { motion, useReducedMotion } from 'framer-motion';
import { useGame } from '../../context/Game';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import { isTestMode } from '../../utils/testMode';

import './index.scss';
import { useMemo } from 'react';

export const CurrencyBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { protodermis, protodermisCap } = useGame();
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const transition = useMemo(
    () =>
      buildTransition(
        {
          duration: MOTION_DURATION.base,
          ease: MOTION_EASING.standard,
        },
        shouldReduceMotion
      ),
    [shouldReduceMotion]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
      className={`currency-bar currency-bar--protodermis ${isPortrait ? 'portrait' : 'landscape'}`}
    >
      <div className="currency-progress">
        <div
          className="currency-fill"
          style={
            isPortrait
              ? { width: `${(protodermis / protodermisCap) * 100}%` }
              : { height: `${(protodermis / protodermisCap) * 100}%` }
          }
        ></div>
        <div className="currency-label">
          {protodermis}/{protodermisCap}
        </div>
      </div>
    </motion.div>
  );
};
