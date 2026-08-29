import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { isTestMode } from '../../utils/testMode';
import './index.scss';

/** Idle time before Run Round / Next Wave auto-fires when the player does not interact. */
export const BATTLE_AUTO_ACTIVATE_MS = 3000;

export interface AutoActivateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** When this value changes, the countdown restarts from full. */
  resetToken?: unknown;
  durationMs?: number;
  /** When false, the timer and fill overlay are hidden (e.g. reduced motion). */
  showTimer?: boolean;
}

export const AutoActivateButton = ({
  children,
  className = '',
  disabled = false,
  durationMs = BATTLE_AUTO_ACTIVATE_MS,
  onClick,
  resetToken,
  showTimer = true,
  ...rest
}: AutoActivateButtonProps) => {
  const [fillScale, setFillScale] = useState(1);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (disabled || !showTimer || isTestMode()) {
      setFillScale(1);
      return;
    }

    const startedAt = performance.now();
    setFillScale(1);
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const remaining = Math.max(0, 1 - elapsed / durationMs);
      setFillScale(remaining);

      if (remaining <= 0) {
        buttonRef.current?.click();
        return;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [disabled, durationMs, resetToken, showTimer]);

  const timerActive = !disabled && showTimer && !isTestMode();

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`auto-activate-button ${className}`.trim()}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      <span className="auto-activate-button__label">{children}</span>
      {timerActive && (
        <span
          className="auto-activate-button__fill"
          style={{ transform: `scaleX(${fillScale})` }}
          aria-hidden
        />
      )}
    </button>
  );
};
