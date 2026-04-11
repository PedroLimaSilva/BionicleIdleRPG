import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect, useRef } from 'react';
import { BattleInProgress } from './InProgress';
import { BattlePrep } from './Prep';
import { BattleOutcome } from './BattleOutcome';
import { useBattlePageHitFeedback } from './useBattlePageHitFeedback';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { Arena } from './Arena';
import {
  getEnemiesDefeatedCount,
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
  computeKraataRewardsForBattle,
} from '../../game/BattleRewards';
import { KraataReward } from '../../types/Kraata';

export const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { battle, applyBattleRewards, completedQuests, collectedKrana } = useGame();
  const { currentEncounter, phase, currentWave, enemies, team } = battle;
  const { setScene } = useSceneCanvas();
  const battlePageRootClass = useBattlePageHitFeedback();

  const kranaRewardsRef = useRef<ReturnType<typeof computeKranaRewardsForBattle> | null>(null);
  const kraataRewardsRef = useRef<KraataReward[] | null>(null);

  const isOutcome =
    currentEncounter &&
    (phase === BattlePhase.Victory ||
      phase === BattlePhase.Defeat ||
      phase === BattlePhase.Retreated);

  if (isOutcome && kranaRewardsRef.current === null) {
    kranaRewardsRef.current = computeKranaRewardsForBattle(
      currentEncounter,
      phase,
      currentWave,
      enemies,
      completedQuests,
      collectedKrana
    );
  }

  if (isOutcome && kraataRewardsRef.current === null) {
    kraataRewardsRef.current = computeKraataRewardsForBattle(
      currentEncounter!,
      phase,
      currentWave,
      enemies
    );
  }

  if (!isOutcome) {
    kranaRewardsRef.current = null;
    kraataRewardsRef.current = null;
  }

  const kranaRewards = kranaRewardsRef.current ?? [];
  const kraataRewards = kraataRewardsRef.current ?? [];

  useEffect(() => {
    if (!currentEncounter) {
      navigate('/battle/selector');
    }
  }, [navigate, currentEncounter]);

  useEffect(() => {
    if (currentEncounter) {
      setScene(<Arena team={battle.team} enemies={battle.enemies} currentWave={currentWave} />);
    } else {
      setScene(null); // or show something else
    }
  }, [setScene, currentEncounter, battle.team, battle.enemies, currentWave, phase]);

  if (!currentEncounter) {
    return null;
  }

  if (phase === BattlePhase.Preparing) {
    return (
      <div className={battlePageRootClass}>
        <BattlePrep />
      </div>
    );
  }

  if (phase === BattlePhase.Inprogress) {
    return (
      <div className={battlePageRootClass}>
        <BattleInProgress />
      </div>
    );
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
          kraataToCollect: kraataRewards,
        });
      }
      battle.endBattle();
      navigate('/battle/selector');
    };

    return (
      <div className={`${battlePageRootClass} page-container battle battle--outcome`}>
        <BattleOutcome
          phase={phase}
          enemiesDefeated={enemiesDefeated ?? 0}
          expTotal={expTotal ?? 0}
          participantCount={participantCount}
          kranaRewards={kranaRewards}
          kraataRewards={kraataRewards}
          onCollect={handleCollectRewards}
        />
      </div>
    );
  }

  return <div className={`${battlePageRootClass} page-container`}>Battle status: {phase}</div>;
};
