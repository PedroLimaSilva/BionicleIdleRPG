import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';
import { EnemyCard } from './Cards/Enemy';
import { AllyCard } from './Cards/Ally';

const WAVE_CLEAR_TRANSITION_MS = 400;

export const BattleInProgress = () => {
  const { battle } = useGame();
  const { currentWave, enemies, team, actionQueue, playActionQueue, isRunningRound, retreat } =
    battle;
  const [waveClearPlaying, setWaveClearPlaying] = useState(false);
  const waveClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  useEffect(() => {
    if (actionQueue && actionQueue.length > 0 && isRunningRound === false) {
      playActionQueue();
    }
  }, [playActionQueue, actionQueue, isRunningRound]);

  useEffect(() => {
    return () => {
      if (waveClearTimerRef.current) {
        clearTimeout(waveClearTimerRef.current);
        waveClearTimerRef.current = null;
      }
    };
  }, []);

  const runAfterWaveClear = () => {
    if (shouldReduceMotion) {
      battle.advanceWave();
      return;
    }
    if (waveClearTimerRef.current) clearTimeout(waveClearTimerRef.current);
    setWaveClearPlaying(true);
    waveClearTimerRef.current = setTimeout(() => {
      battle.advanceWave();
      setWaveClearPlaying(false);
      waveClearTimerRef.current = null;
    }, WAVE_CLEAR_TRANSITION_MS);
  };

  const buttonsLocked = isRunningRound || waveClearPlaying;

  return (
    <div className="page-container battle">
      <h1 className="title">Wave {currentWave + 1}</h1>

      <div
        className={`battle-arena${waveClearPlaying ? ' battle-arena--wave-clear' : ''}`}
      >
        {/* Enemy Side */}
        <div className="enemy-side">
          <div className="enemy-list">
            {enemies
              .toSorted((a, b) => {
                const iA = parseInt(a.id.split('-').pop() ?? '0', 10);
                const iB = parseInt(b.id.split('-').pop() ?? '0', 10);
                const order = [1, 0, 2]; // left, middle, right
                return order.indexOf(iA) - order.indexOf(iB);
              })
              .map((enemy, i) => (
                <EnemyCard key={i} enemy={enemy} />
              ))}
          </div>
        </div>

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
        <button
          className="cancel-button"
          disabled={buttonsLocked}
          onClick={() => retreat()}
        >
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
          <button
            className="confirm-button"
            disabled={buttonsLocked}
            onClick={runAfterWaveClear}
          >
            Next Wave
          </button>
        )}
      </div>
    </div>
  );
};
