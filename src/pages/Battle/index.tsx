import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect, useRef } from 'react';
import { BattleInProgress } from './InProgress';
import { BattlePrep } from './Prep';
import { BattleOutcome } from './BattleOutcome';
import { useBattlePageHitFeedback } from './useBattlePageHitFeedback';
import { useSceneCanvas } from '../../rendering/3d/hooks/useSceneCanvas';
import { Arena } from './Arena';
import {
  getEnemiesDefeatedCount,
  computeBattleExpTotal,
  computeKranaRewardsForBattle,
  computeKraataRewardsForBattle,
} from '../../game/combat/BattleRewards';
import { KraataReward } from '../../types/Kraata';
import { BattleSpeedControl } from './BattleSpeedControl';
import { setBattleSpeedMultiplier } from '../../utils/battleSpeed';
import { getEncounterArenaId, getEncounterTribe } from '../../game/combat/arena';

export const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { applyBattleRewards, battle, collectedKrana, completedQuests } = useGame();
  const { currentEncounter, currentWave, enemies, outcomePresentationReady, phase, team } = battle;
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
    return () => setBattleSpeedMultiplier(1);
  }, []);

  useEffect(() => {
    // Defer heavy arena GLB/atmosphere until combat starts — prep is DOM-only and E2E
    // must stay responsive while selecting the team.
    if (currentEncounter && phase !== BattlePhase.Preparing) {
      setScene(
        <Arena
          team={battle.team}
          enemies={battle.enemies}
          currentWave={currentWave}
          arenaId={getEncounterArenaId(currentEncounter)}
          tribe={getEncounterTribe(currentEncounter)}
        />
      );
    } else {
      setScene(null);
    }
  }, [setScene, currentEncounter, battle.team, battle.enemies, currentWave, phase]);

  if (!currentEncounter) {
    return null;
  }

  if (phase === BattlePhase.Preparing) {
    return (
      <div className={`${battlePageRootClass} battle-page-with-speed`}>
        <BattleSpeedControl />
        <BattlePrep />
      </div>
    );
  }

  if (phase === BattlePhase.Inprogress) {
    return (
      <div className={`${battlePageRootClass} battle-page-with-speed`}>
        <BattleSpeedControl />
        <BattleInProgress />
      </div>
    );
  }

  if (
    phase === BattlePhase.Retreated ||
    phase === BattlePhase.Defeat ||
    phase === BattlePhase.Victory
  ) {
    const waitingOnOutcomePresentation =
      (phase === BattlePhase.Victory || phase === BattlePhase.Defeat) && !outcomePresentationReady;

    if (waitingOnOutcomePresentation) {
      return (
        <div className={`${battlePageRootClass} battle-page-with-speed`}>
          <BattleSpeedControl />
          <BattleInProgress exitPresentation />
        </div>
      );
    }

    const enemiesDefeated =
      currentEncounter && getEnemiesDefeatedCount(currentEncounter, phase, currentWave, enemies);
    const expTotal =
      currentEncounter && computeBattleExpTotal(currentEncounter, phase, currentWave, enemies);
    const handleCollectRewards = () => {
      if (currentEncounter) {
        applyBattleRewards({
          currentWave,
          encounter: currentEncounter,
          enemies,
          kraataToCollect: kraataRewards,
          kranaToApply: kranaRewards,
          phase,
          team,
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
          team={team}
          kranaRewards={kranaRewards}
          kraataRewards={kraataRewards}
          onCollect={handleCollectRewards}
        />
      </div>
    );
  }

  return <div className={`${battlePageRootClass} page-container`}>Battle status: {phase}</div>;
};
