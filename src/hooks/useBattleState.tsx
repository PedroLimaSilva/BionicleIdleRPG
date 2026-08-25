import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { Combatant, EnemyEncounter } from '../types/Combat';
import { RecruitedCharacterData, isCustomCharacterId, MatoranStage } from '../types/Matoran';
import { getLevelFromExp } from '../game/Levelling';
import {
  generateCombatantStats,
  getScaledEnemyLevelForEncounter,
  queueCombatRound,
  decrementWaveCounters,
  hasReadyMaskPowers,
} from '../services/combatUtils';
import { getBattleOutcomePhaseDelayMs } from '../game/battleOutcomeVisualDelay';
import { scaleBattleDurationMs } from '../utils/battleSpeed';
import { getEffectiveMatoran } from '../services/matoranUtils';
import { resolveToaMataBuildId } from '../game/customMataBuild';

export const enum BattlePhase {
  Idle = 'idle',
  Preparing = 'preparing',
  Inprogress = 'in-progress',
  Victory = 'victory',
  Defeat = 'defeat',
  Retreated = 'retreated',
}

export interface BattleState {
  phase: BattlePhase;
  /**
   * After functional Victory/Defeat, stays false until defeat sink + camera framing
   * have had time to finish; then true so nav and outcome UI appear together.
   * Always true when not in Victory/Defeat.
   */
  outcomePresentationReady: boolean;
  currentEncounter: EnemyEncounter | undefined;
  currentWave: number;
  enemies: Combatant[];
  team: Combatant[];
  startBattle: (encounter: EnemyEncounter) => void;
  confirmTeam: (team: RecruitedCharacterData[]) => void;
  advanceWave: () => void;
  toggleAbility: (toa: Combatant) => void;
  retreat: () => void;
  runRound: () => void;
  playActionQueue: () => Promise<void>;
  actionQueue: (() => void)[];
  isRunningRound: boolean;
  endBattle: () => void;
}

export const INITIAL_BATTLE_STATE: BattleState = {
  actionQueue: [],
  advanceWave: function (): void {
    throw new Error('Function not implemented.');
  },
  confirmTeam: function (_team: RecruitedCharacterData[]): void {
    throw new Error('Function not implemented.');
  },
  currentEncounter: undefined,
  currentWave: 0,
  endBattle: function (): void {
    throw new Error('Function not implemented.');
  },
  enemies: [],
  isRunningRound: false,
  outcomePresentationReady: true,
  phase: BattlePhase.Idle,
  playActionQueue: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  retreat: function (): void {
    throw new Error('Function not implemented.');
  },
  runRound: function (): void {
    throw new Error('Function not implemented.');
  },
  startBattle: function (_encounter: EnemyEncounter): void {
    throw new Error('Function not implemented.');
  },
  team: [],
  toggleAbility: function (_toa: Combatant): boolean {
    throw new Error('Function not implemented.');
  },
};

const TOA_NUVA_IDS = [
  'Toa_Tahu_Nuva',
  'Toa_Gali_Nuva',
  'Toa_Pohatu_Nuva',
  'Toa_Onua_Nuva',
  'Toa_Kopaka_Nuva',
  'Toa_Lewa_Nuva',
] as const;

export const useBattleState = (nuvaSymbolsSequestered = false): BattleState => {
  const reduceMotion = useReducedMotion() ?? false;
  const [phase, setPhase] = useState<BattlePhase>(INITIAL_BATTLE_STATE.phase);
  const [currentEncounter, setCurrentEncounter] = useState<EnemyEncounter | undefined>(
    INITIAL_BATTLE_STATE.currentEncounter
  );
  const [currentWave, setCurrentWave] = useState(INITIAL_BATTLE_STATE.currentWave);
  const [enemies, setEnemies] = useState<Combatant[]>(INITIAL_BATTLE_STATE.enemies);
  const [team, setTeam] = useState<Combatant[]>(INITIAL_BATTLE_STATE.team);
  const [actionQueue, setActionQueue] = useState<(() => void)[]>([]);
  const [isRunningRound, setIsRunningRound] = useState(false);
  const [outcomePresentationReady, setOutcomePresentationReady] = useState(true);
  const teamRef = useRef(team);
  const enemiesRef = useRef(enemies);
  /** Average party level when the current encounter uses `scalesWithParty`. */
  const partyAvgLevelRef = useRef<number | null>(null);
  const pendingPresentationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /**
   * Incremented when combat playback must stop (Victory/Defeat, new round, battle reset).
   * `playActionQueue` bails if its captured token no longer matches, avoiding overlapping
   * rounds and duplicate `playActionQueue` calls when `isRunningRound` flips before the queue drains.
   */
  const combatPlaybackTokenRef = useRef(0);

  const bumpCombatPlaybackToken = () => {
    combatPlaybackTokenRef.current += 1;
  };

  const clearPendingPresentation = () => {
    if (pendingPresentationTimerRef.current !== null) {
      clearTimeout(pendingPresentationTimerRef.current);
      pendingPresentationTimerRef.current = null;
    }
  };

  teamRef.current = team;
  enemiesRef.current = enemies;

  useEffect(() => {
    if (phase !== BattlePhase.Inprogress) return;

    const allTeamDefeated = team.length > 0 && team.every((t) => t.hp <= 0);
    const allEnemiesDefeated =
      !!currentEncounter &&
      currentWave === currentEncounter.waves.length - 1 &&
      enemies.length > 0 &&
      enemies.every((e) => e.hp <= 0);

    // Team wipe takes precedence (same ordering as separate effects would race).
    if (allTeamDefeated) {
      console.log('Defeat!');
      bumpCombatPlaybackToken();
      setActionQueue([]);
      setIsRunningRound(false);
      setPhase(BattlePhase.Defeat);
      return;
    }

    if (allEnemiesDefeated) {
      console.log('Victory!');
      bumpCombatPlaybackToken();
      setActionQueue([]);
      setIsRunningRound(false);
      setPhase(BattlePhase.Victory);
    }
  }, [currentEncounter, currentWave, enemies, team, phase]);

  useEffect(() => {
    clearPendingPresentation();
    if (phase !== BattlePhase.Victory && phase !== BattlePhase.Defeat) {
      setOutcomePresentationReady(true);
      return;
    }
    const delayMs = scaleBattleDurationMs(getBattleOutcomePhaseDelayMs(reduceMotion));
    if (delayMs === 0) {
      setOutcomePresentationReady(true);
      return;
    }
    setOutcomePresentationReady(false);
    pendingPresentationTimerRef.current = setTimeout(() => {
      pendingPresentationTimerRef.current = null;
      setOutcomePresentationReady(true);
    }, delayMs);
    return clearPendingPresentation;
  }, [phase, reduceMotion]);

  const startBattle = (encounter: EnemyEncounter) => {
    clearPendingPresentation();
    bumpCombatPlaybackToken();
    setActionQueue([]);
    setCurrentEncounter(encounter);
    setTeam([]);
    setEnemies(
      encounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id}-${index}`, id, lvl)
      )
    );
    setPhase(BattlePhase.Preparing);
  };

  const toggleAbility = (toa: Combatant) => {
    if (toa.maskPower && toa.hp > 0 && toa.maskPower.cooldown.amount === 0) {
      toa.willUseAbility = !toa.willUseAbility;
      const updatedTeam = team.map((t) => (t.id === toa.id ? toa : t));
      setTeam(updatedTeam);
    }
  };

  const advanceWave = () => {
    if (!currentEncounter) return;
    bumpCombatPlaybackToken();
    setActionQueue([]);
    const nextWave = currentWave + 1;
    setCurrentWave(nextWave);

    // Decrement wave-based mask power counters for the team
    const updatedTeam = decrementWaveCounters(team);
    setTeam(updatedTeam);

    const avg = partyAvgLevelRef.current;
    const wave = currentEncounter.waves[nextWave];
    setEnemies(
      wave.map(({ id, lvl }, index) =>
        generateCombatantStats(
          `${id}-${index}`,
          id,
          avg !== null ? getScaledEnemyLevelForEncounter(currentEncounter, wave, lvl, avg) : lvl
        )
      )
    );
  };

  const retreat = () => {
    clearPendingPresentation();
    bumpCombatPlaybackToken();
    setActionQueue([]);
    if (phase === BattlePhase.Preparing) {
      setPhase(BattlePhase.Idle);
      setCurrentEncounter(undefined);
      partyAvgLevelRef.current = null;
    } else {
      setPhase(BattlePhase.Retreated);
    }
  };

  const endBattle = () => {
    clearPendingPresentation();
    bumpCombatPlaybackToken();
    setActionQueue([]);
    setPhase(BattlePhase.Idle);
    setCurrentEncounter(undefined);
    setCurrentWave(0);
    setTeam([]);
    setEnemies([]);
    partyAvgLevelRef.current = null;
  };

  const confirmTeam = (team: RecruitedCharacterData[]) => {
    const partyLevels = team.map(({ exp }) => getLevelFromExp(exp));
    const avgPartyLevel = Math.round(
      partyLevels.reduce((sum, l) => sum + l, 0) / partyLevels.length
    );

    setTeam(
      team.map((rec) => {
        const { exp, id, maskOverride } = rec;
        const effective = getEffectiveMatoran(rec);
        return generateCombatantStats(id, id, getLevelFromExp(exp), {
          maskOverride,
          nuvaSymbolsSequestered:
            nuvaSymbolsSequestered && TOA_NUVA_IDS.includes(id as (typeof TOA_NUVA_IDS)[number]),
          ...(isCustomCharacterId(id) && effective.stage === MatoranStage.ToaMata
            ? { mataRenderModelId: resolveToaMataBuildId(rec) }
            : {}),
        });
      })
    );
    setCurrentWave(0);

    partyAvgLevelRef.current = currentEncounter!.scalesWithParty ? avgPartyLevel : null;

    setEnemies(
      currentEncounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(
          `${id}-${index}`,
          id,
          getScaledEnemyLevelForEncounter(
            currentEncounter!,
            currentEncounter!.waves[0],
            lvl,
            avgPartyLevel
          )
        )
      )
    );
    bumpCombatPlaybackToken();
    setActionQueue([]);
    setPhase(BattlePhase.Inprogress);
  };

  const runRound = () => {
    bumpCombatPlaybackToken();
    const queue: (() => void)[] = [];
    const setTeamWithRef = (t: Combatant[]) => {
      teamRef.current = t;
      setTeam(t);
    };
    const setEnemiesWithRef = (e: Combatant[]) => {
      enemiesRef.current = e;
      setEnemies(e);
    };
    const getLatestState = () => ({
      enemies: enemiesRef.current,
      team: teamRef.current,
    });
    queueCombatRound(
      team,
      enemies,
      setTeamWithRef,
      setEnemiesWithRef,
      (fn) => queue.push(fn),
      getLatestState
    );
    setActionQueue(queue);
  };

  const playActionQueue = async () => {
    const playbackToken = combatPlaybackTokenRef.current;
    setIsRunningRound(true);

    let queue = [...actionQueue];

    const isAborted = () => combatPlaybackTokenRef.current !== playbackToken;

    while (queue.length > 0) {
      if (isAborted()) {
        // Do not clear actionQueue here — a newer runRound may have set it.
        setIsRunningRound(false);
        return;
      }

      for (const step of queue) {
        await step();
        if (isAborted()) {
          setIsRunningRound(false);
          return;
        }
      }

      const latestTeam = teamRef.current;
      const latestEnemies = enemiesRef.current;
      const enemiesAlive = latestEnemies.some((e) => e.hp > 0);
      const teamAlive = latestTeam.some((t) => t.hp > 0);

      if (!enemiesAlive || !teamAlive || hasReadyMaskPowers(latestTeam, latestEnemies)) {
        break;
      }

      queue = [];
      queueCombatRound(
        latestTeam,
        latestEnemies,
        (t: Combatant[]) => {
          teamRef.current = t;
          setTeam(t);
        },
        (e: Combatant[]) => {
          enemiesRef.current = e;
          setEnemies(e);
        },
        (fn) => queue.push(fn),
        () => ({ enemies: enemiesRef.current, team: teamRef.current })
      );
    }

    if (isAborted()) {
      setIsRunningRound(false);
      return;
    }

    setActionQueue([]);
    setIsRunningRound(false);
  };

  return {
    actionQueue,
    advanceWave,
    confirmTeam,
    currentEncounter,
    currentWave,
    endBattle,
    enemies,
    isRunningRound,
    outcomePresentationReady,
    phase,
    playActionQueue,
    retreat,
    runRound,
    startBattle,
    team,
    toggleAbility: toggleAbility,
  };
};
