import { useEffect, useRef } from 'react';

export const DamagePopup = ({
  damage,
  direction,
  isHealing = false,
}: {
  damage: number;
  direction: 'up' | 'down';
  isHealing?: boolean;
}) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = popupRef.current;
    if (!el) return;

    // Remove the animation class to restart it
    el.classList.remove(`float-${direction}`);
    // Trigger reflow
    void el.offsetWidth;
    // Re-add the animation class
    el.classList.add(`float-${direction}`);
  }, [damage, direction, isHealing]); // re-trigger on any damage/healing change

  return (
    <div ref={popupRef} className={`damage-popup float-${direction} ${isHealing ? 'healing' : ''}`}>
      {isHealing ? '+' : '-'}
      {damage}
    </div>
  );
};
