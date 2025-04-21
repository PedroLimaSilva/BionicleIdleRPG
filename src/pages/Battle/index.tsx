import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { MATORAN_DEX } from '../../data/matoran';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect } from 'react';
import { ENEMY_DEX } from '../../data/combat';

export const BattlePage: React.FC = () => {
  const { battle, recruitedCharacters } = useGame();

  const { currentEncounter, phase, confirmTeam } = battle;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentEncounter) {
      navigate('/battle/selector');
    }
  }, [navigate, currentEncounter]);

  if (!currentEncounter) {
    return null;
  }

  if (phase === BattlePhase.Preparing) {
    const selectable = recruitedCharacters.filter((c) => c); // Add filters if needed
    const defaultTeam = selectable.slice(0, 3); // Future: custom selection UI

    return (
      <div className='page-container'>
        <h1 className='title'>Select Your Team</h1>
        <p>Preparing for: {currentEncounter.name}</p>
        <ul>
          {defaultTeam.map((combatant) => (
            <li key={combatant.id}>{MATORAN_DEX[combatant.id].name}</li>
          ))}
        </ul>
        <button
          className='confirm-button'
          onClick={() => confirmTeam(defaultTeam)}
        >
          Begin Battle
        </button>
      </div>
    );
  }

  if (phase === 'in-progress') {
    return (
      <div className='page-container'>
        <h1 className='title'>Wave {battle.currentWave}</h1>
        <p>Enemies:</p>
        <ul>
          {battle.enemies.map((enemy) => (
            <li key={enemy.id}>{ENEMY_DEX[enemy.id].name}</li>
          ))}
        </ul>
        {/* Add attack options, retreat button, etc. */}
      </div>
    );
  }

  return <div className='page-container'>Battle status: {phase}</div>;
};
