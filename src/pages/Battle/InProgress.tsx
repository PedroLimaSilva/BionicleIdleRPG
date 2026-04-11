import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';
import { AllyCard } from './Cards/Ally';

/** Total fade in + fade out; keep in sync with `battle-arena-wave-clear` duration in `battle.scss`. */
const WAVE_CLEAR_TOTAL_MS = 1000;

export const BattleInProgress = () => {
  const { battle } = useGame();
  const { currentWave, enemies, team, actionQueue, playActionQueue, isRunningRound, retreat } =
    battle;
  const [waveClearPlaying, setWaveClearPlaying] = useState(false);
  const waveClearTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  useEffect(() => {
    if (actionQueue && actionQueue.length > 0 && isRunningRound === false) {
      playActionQueue();
    }
  }, [playActionQueue, actionQueue, isRunningRound]);

  useEffect(() => {
    return () => {
      waveClearTimersRef.current.forEach(clearTimeout);
      waveClearTimersRef.current = [];
    };
  }, []);

  const runAfterWaveClear = () => {
    if (shouldReduceMotion) {
      battle.advanceWave();
      return;
    }
    waveClearTimersRef.current.forEach(clearTimeout);
    waveClearTimersRef.current = [];
    setWaveClearPlaying(true);
    waveClearTimersRef.current.push(
      setTimeout(() => {
        battle.advanceWave();
      }, WAVE_CLEAR_TOTAL_MS / 2),
      setTimeout(() => {
        setWaveClearPlaying(false);
        waveClearTimersRef.current = [];
      }, WAVE_CLEAR_TOTAL_MS)
    );
  };

  const buttonsLocked = isRunningRound || waveClearPlaying;

  return (
    <div className="page-container battle">
      <h1 className="title">Wave {currentWave + 1}</h1>

      <div className={`battle-arena${waveClearPlaying ? ' battle-arena--wave-clear' : ''}`}>
        {/* Enemy Side */}
        <div className="enemy-side"></div>

        {/* Ally Side */}
        <div className="ally-side">
          <div className="toa-team">
            {team.map((toa, i) => (
              <AllyCard
                key={i}
                combatant={toa}
                onClick={() => battle.toggleAbility(toa)}
                team={team}
                enemies={enemies}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="battle-buttons">
        <button className="cancel-button" disabled={buttonsLocked} onClick={() => retreat()}>
          Retreat
        </button>

        {battle.enemies.length && battle.enemies.some((e) => e.hp > 0) ? (
          <button
            className="confirm-button"
            disabled={buttonsLocked}
            onClick={() => {
              battle.runRound();
            }}
          >
            Run Round
          </button>
        ) : (
          <button className="confirm-button" disabled={buttonsLocked} onClick={runAfterWaveClear}>
            Next Wave
          </button>
        )}
      </div>
    </div>
  );
};
