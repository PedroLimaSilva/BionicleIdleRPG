import { motion, useReducedMotion } from 'motion/react';
import { MOTION_DURATION, MOTION_EASING, buildTransition } from '../../motion/transitions';
import './index.scss';

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  classNames: string;
};

export function Modal({ children, onClose, classNames }: ModalProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const backdropTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.standard,
    },
    shouldReduceMotion
  );
  const panelTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.emphasized,
    },
    shouldReduceMotion
  );

  return (
    <motion.div
      className={`modal-backdrop ${classNames}`}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={backdropTransition}
    >
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 4 }}
        transition={panelTransition}
      >
        <button type="button" className="modal-close-button" onClick={onClose}>
          ×
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
