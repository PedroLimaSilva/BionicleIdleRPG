import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect } from 'react';
import { BattleInProgress } from './InProgress';
import { BattlePrep } from './Prep';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { Arena } from './Arena';

export const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { battle } = useGame();
  const { currentEncounter, phase } = battle;
  const { setScene } = useSceneCanvas();

  useEffect(() => {
    if (!currentEncounter) {
      navigate('/battle/selector');
    }
  }, [navigate, currentEncounter]);

  useEffect(() => {
    if (currentEncounter) {
      setScene(<Arena team={battle.team} enemies={battle.enemies} />);
    } else {
      setScene(null); // or show something else
    }
  }, [setScene, currentEncounter, battle.team, battle.enemies, phase]);

  if (!currentEncounter) {
    return null;
  }

  if (phase === BattlePhase.Preparing) {
    return <BattlePrep />;
  }

  if (phase === BattlePhase.Inprogress) {
    return <BattleInProgress />;
  }

  if (
    phase === BattlePhase.Retreated ||
    phase === BattlePhase.Defeat ||
    phase === BattlePhase.Victory
  ) {
    return (
      <div className='page-container'>
        <h1 style={{ fontSize: '8vw' }}>{phase}</h1>
        <p>Battle summary goes here</p>
        <div
          className='battle-buttons'
          style={{ justifyContent: 'center', paddingBottom: '132px' }}
        >
          <Link to='/battle/selector'>
            <button className='confirm-button' onClick={() => {}}>
              Collect Rewards
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <div className='page-container'>Battle status: {phase}</div>;
};
