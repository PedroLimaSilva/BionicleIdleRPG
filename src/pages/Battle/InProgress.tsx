import { useEffect } from 'react';
import { useGame } from '../../context/Game';
import { EnemyCard } from './Cards/Enemy';
import { AllyCard } from './Cards/Ally';

export const BattleInProgress = () => {
  const { battle } = useGame();
  const {
    currentWave,
    enemies,
    team,
    actionQueue,
    playActionQueue,
    isRunningRound,
    retreat,
  } = battle;

  useEffect(() => {
    if (actionQueue && actionQueue.length > 0 && isRunningRound === false) {
      playActionQueue();
    }
  }, [playActionQueue, actionQueue, isRunningRound]);

  return (
    <div className='page-container'>
      <h1 className='title'>Wave {currentWave + 1}</h1>

      <div className='battle-arena'>
        {/* Enemy Side */}
        <div className='enemy-side'>
          <div className='enemy-list'>
            {enemies
              .toSorted((a, b) => {
                const positionA = a.id.split(' ')[1];
                const positionB = b.id.split(' ')[1];
                return positionA.localeCompare(positionB);
              })
              .map((enemy, i) => (
                <EnemyCard key={i} enemy={enemy} />
              ))}
          </div>
        </div>

        {/* Ally Side */}
        <div className='ally-side'>
          <div className='toa-team'>
            {team.map((toa, i) => (
              <AllyCard key={i} combatant={toa} />
            ))}
          </div>
        </div>
      </div>

      <div className='battle-buttons'>
        <button
          className='cancel-button'
          disabled={battle.isRunningRound}
          onClick={() => retreat()}
        >
          Retreat
        </button>

        {battle.enemies.length && battle.enemies.some((e) => e.hp > 0) ? (
          <button
            className='confirm-button'
            disabled={battle.isRunningRound}
            onClick={() => {
              battle.runRound();
            }}
          >
            Run Round
          </button>
        ) : (
          <button
            className='confirm-button'
            disabled={battle.isRunningRound}
            onClick={() => {
              battle.advanceWave();
            }}
          >
            Next Wave
          </button>
        )}
      </div>
    </div>
  );
};
