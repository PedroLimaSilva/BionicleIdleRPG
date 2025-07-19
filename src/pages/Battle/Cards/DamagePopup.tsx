import { useEffect, useRef } from 'react';

export const DamagePopup = ({
  damage,
  direction,
}: {
  damage: number;
  direction: 'up' | 'down';
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
  }, [damage, direction]); // re-trigger on any damage change

  return (
    <div ref={popupRef} className={`damage-popup float-${direction}`}>
      -{damage}
    </div>
  );
};
