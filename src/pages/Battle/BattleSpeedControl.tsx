import { FastForward, Play } from 'lucide-react';
import { useBattleSpeed } from '../../hooks/useBattleSpeed';

export function BattleSpeedControl() {
  const { cycleSpeed, speed } = useBattleSpeed();
  const isNormalSpeed = speed === 1;

  return (
    <button
      type="button"
      className="battle-speed-control"
      aria-label={`Battle animation speed: ${speed}x. Click to change.`}
      title={`Battle speed: ${speed}x`}
      onClick={() => cycleSpeed()}
    >
      {isNormalSpeed ? (
        <Play className="battle-speed-control__icon" aria-hidden size={20} strokeWidth={2} />
      ) : (
        <>
          <FastForward
            className="battle-speed-control__icon"
            aria-hidden
            size={20}
            strokeWidth={2}
          />
          <span className="battle-speed-control__label">{speed}x</span>
        </>
      )}
    </button>
  );
}
