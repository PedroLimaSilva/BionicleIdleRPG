import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { isTestMode } from '../../../utils/testMode';

import './MaskActivationBurst.scss';

const PARTICLE_COUNT = 12;
const BURST_DURATION_MS = 700;

export function MaskActivationBurst({
  active,
  elementClass,
}: {
  active: boolean;
  elementClass: string;
}) {
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();
  const [bursting, setBursting] = useState(false);
  const prevActiveRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (active && !prevActiveRef.current && !shouldReduceMotion) {
      setBursting(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setBursting(false);
        timerRef.current = null;
      }, BURST_DURATION_MS);
    }
    prevActiveRef.current = active;
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [active, shouldReduceMotion]);

  if (!bursting) return null;

  return (
    <div className={`mask-burst ${elementClass}`} aria-hidden="true">
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <span
          key={i}
          className="mask-burst__particle"
          style={{ '--i': i } as React.CSSProperties}
        />
      ))}
      <span className="mask-burst__ring" />
    </div>
  );
}
