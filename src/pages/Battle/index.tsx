import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect, useMemo } from 'react';
import { BattleInProgress } from './InProgress';
import { BattlePrep } from './Prep';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { Arena } from './Arena';
import {
  getEnemiesDefeatedCount,
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
} from '../../game/BattleRewards';

export const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { battle, applyBattleRewards, completedQuests, collectedKrana } = useGame();
  const { currentEncounter, phase, currentWave, enemies, team } = battle;
  const { setScene } = useSceneCanvas();

  const kranaRewards = useMemo(() => {
    if (
      !currentEncounter ||
      (phase !== BattlePhase.Victory &&
        phase !== BattlePhase.Defeat &&
        phase !== BattlePhase.Retreated)
    ) {
      return [];
    }
    return computeKranaRewardsForBattle(
      currentEncounter,
      phase,
      currentWave,
      enemies,
      completedQuests,
      collectedKrana
    );
  }, [currentEncounter, phase, currentWave, enemies, completedQuests, collectedKrana]);

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
    const enemiesDefeated =
      currentEncounter && getEnemiesDefeatedCount(currentEncounter, phase, currentWave, enemies);
    const expTotal =
      currentEncounter && computeBattleExpTotal(currentEncounter, phase, currentWave, enemies);
    const participantCount = team.length;

    const handleCollectRewards = () => {
      if (currentEncounter) {
        applyBattleRewards({
          encounter: currentEncounter,
          phase,
          currentWave,
          enemies,
          team,
          kranaToApply: kranaRewards,
        });
      }
      battle.endBattle();
      navigate('/battle/selector');
    };

    return (
      <div className="page-container battle battle--outcome">
        <h1 className="battle-outcome__title">{phase}</h1>
        <div className="battle-rewards-panel">
          <p className="battle-rewards-panel__row">Enemies defeated: {enemiesDefeated ?? 0}</p>
          <p className="battle-rewards-panel__row battle-rewards-panel__exp">
            {expTotal !== undefined && expTotal > 0 ? (
              <>
                EXP earned: {expTotal} total
                {participantCount > 0 && <> ({Math.floor(expTotal / participantCount)} per Toa)</>}
              </>
            ) : (
              <span className="battle-rewards-panel__empty">EXP earned: 0</span>
            )}
          </p>
          <p className="battle-rewards-panel__row battle-rewards-panel__krana">
            Krana recovered:{' '}
            {kranaRewards.length > 0 ? (
              kranaRewards.map((r) => `${r.kranaId} (${r.element})`).join(', ')
            ) : (
              <span className="battle-rewards-panel__empty">None</span>
            )}
          </p>
          <button className="confirm-button battle-rewards-panel__collect" onClick={handleCollectRewards}>
            Collect Rewards
          </button>
        </div>
      </div>
    );
  }

  return <div className="page-container">Battle status: {phase}</div>;
};
