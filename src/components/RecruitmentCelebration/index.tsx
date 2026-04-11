import { motion, useReducedMotion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { MOTION_DURATION, MOTION_EASING, buildTransition } from '../../motion/transitions';
import { isTestMode } from '../../utils/testMode';
import { BaseMatoran, ElementTribe } from '../../types/Matoran';
import './index.scss';

const PARTICLE_COUNT = 24;

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  distance: number;
  delay: number;
  duration: number;
};

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: 50 + (Math.random() - 0.5) * 20,
    y: 50 + (Math.random() - 0.5) * 20,
    size: 3 + Math.random() * 5,
    angle: (i / PARTICLE_COUNT) * 360 + Math.random() * 30,
    distance: 80 + Math.random() * 120,
    delay: Math.random() * 0.3,
    duration: 0.6 + Math.random() * 0.4,
  }));
}

type RecruitmentCelebrationProps = {
  matoran: BaseMatoran | null;
  onDismiss: () => void;
};

export function RecruitmentCelebration({ matoran, onDismiss }: RecruitmentCelebrationProps) {
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();
  const particles = useMemo(() => generateParticles(), []);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (matoran) {
      const t = setTimeout(() => setShowContent(true), shouldReduceMotion ? 0 : 100);
      return () => clearTimeout(t);
    }
    setShowContent(false);
  }, [matoran, shouldReduceMotion]);

  const backdropTransition = buildTransition(
    { duration: MOTION_DURATION.slow, ease: MOTION_EASING.standard },
    shouldReduceMotion
  );
  const panelTransition = buildTransition(
    { duration: MOTION_DURATION.slow, ease: MOTION_EASING.emphasized },
    shouldReduceMotion
  );

  return (
    <AnimatePresence>
      {matoran && (
        <motion.div
          className={`recruitment-celebration-backdrop element-${matoran.element}`}
          onClick={onDismiss}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={backdropTransition}
          data-testid="recruitment-celebration"
        >
          {!shouldReduceMotion && (
            <div className="celebration-particles" aria-hidden="true">
              {particles.map((p) => (
                <motion.span
                  key={p.id}
                  className="celebration-particle"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    width: p.size,
                    height: p.size,
                  }}
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1.2, 0.6],
                    x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                    y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="celebration-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${matoran.name} has been recruited`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
            transition={panelTransition}
          >
            {showContent && (
              <>
                <div className="celebration-flare" aria-hidden="true" />

                <motion.div
                  className="celebration-header"
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={buildTransition(
                    { duration: MOTION_DURATION.base, delay: 0.15 },
                    shouldReduceMotion
                  )}
                >
                  <span className="celebration-subtitle">New Recruit</span>
                  <h2 className="celebration-name">{matoran.name}</h2>
                  <ElementBadge element={matoran.element} />
                </motion.div>

                <motion.button
                  type="button"
                  className={`elemental-btn celebration-dismiss element-${matoran.element}`}
                  onClick={onDismiss}
                  initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={buildTransition(
                    { duration: MOTION_DURATION.base, delay: 0.3 },
                    shouldReduceMotion
                  )}
                >
                  Continue
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ElementBadge({ element }: { element: ElementTribe }) {
  return <span className="celebration-element-badge">{element}</span>;
}
