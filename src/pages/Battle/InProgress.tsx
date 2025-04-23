import { useEffect } from 'react';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { MATORAN_DEX } from '../../data/matoran';
import { useGame } from '../../context/Game';
import { COMBATANT_DEX } from '../../data/combat';

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
              .map((enemy) => (
                <div
                  id={`combatant-${enemy.id}`}
                  key={enemy.id}
                  className={`enemy-card element-${enemy.element}`}
                >
                  <div className='name'>
                    {COMBATANT_DEX[enemy.id]?.name || enemy.id}
                  </div>
                  <div className='hp-bar'>
                    HP: {enemy.hp}/{enemy.maxHp}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Ally Side */}
        <div className='ally-side'>
          <div className='toa-team'>
            {team.map((toa) => {
              const dex = MATORAN_DEX[toa.id];
              return (
                <div
                  id={`combatant-${toa.id}`}
                  key={toa.id}
                  className={`character-card element-${dex.element}`}
                >
                  <MatoranAvatar
                    matoran={{ ...dex, ...toa, exp: 0 }}
                    styles='matoran-avatar model-preview'
                  />
                  <div className='card-header'>
                    {dex.name}
                    <div className='level-label'>Level {toa.lvl}</div>
                  </div>
                  <div className='hp-bar'>
                    HP: {toa.hp}/{toa.maxHp}
                  </div>
                </div>
              );
            })}
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
