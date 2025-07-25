import { useEffect, useState } from 'react';
import { Combatant, EnemyEncounter } from '../types/Combat';
import { RecruitedCharacterData } from '../types/Matoran';
import { getLevelFromExp } from '../game/Levelling';
import { TEAM_POSITION_LABELS } from '../data/combat';
import {
  generateCombatantStats,
  queueCombatRound,
} from '../services/combatUtils';

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
  currentEncounter: EnemyEncounter | undefined;
  currentWave: number;
  enemies: Combatant[];
  team: Combatant[];
  startBattle: (encounter: EnemyEncounter) => void;
  confirmTeam: (team: RecruitedCharacterData[]) => void;
  advanceWave: () => void;
  retreat: () => void;
  runRound: () => void;
  playActionQueue: () => Promise<void>;
  actionQueue: (() => void)[];
  isRunningRound: boolean;
}

export const INITIAL_BATTLE_STATE: BattleState = {
  phase: BattlePhase.Idle,
  currentWave: 0,
  currentEncounter: undefined,
  enemies: [],
  team: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startBattle: function (_encounter: EnemyEncounter): void {
    throw new Error('Function not implemented.');
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  confirmTeam: function (_team: RecruitedCharacterData[]): void {
    throw new Error('Function not implemented.');
  },
  advanceWave: function (): void {
    throw new Error('Function not implemented.');
  },
  retreat: function (): void {
    throw new Error('Function not implemented.');
  },
  runRound: function (): void {
    throw new Error('Function not implemented.');
  },
  playActionQueue: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  actionQueue: [],
  isRunningRound: false
};


export const useBattleState = (): BattleState => {
  const [phase, setPhase] = useState<BattlePhase>(INITIAL_BATTLE_STATE.phase);
  const [currentEncounter, setCurrentEncounter] = useState<
    EnemyEncounter | undefined
  >(INITIAL_BATTLE_STATE.currentEncounter);
  const [currentWave, setCurrentWave] = useState(
    INITIAL_BATTLE_STATE.currentWave
  );
  const [enemies, setEnemies] = useState<Combatant[]>(
    INITIAL_BATTLE_STATE.enemies
  );
  const [team, setTeam] = useState<Combatant[]>(INITIAL_BATTLE_STATE.team);
  const [actionQueue, setActionQueue] = useState<(() => void)[]>([]);
  const [isRunningRound, setIsRunningRound] = useState(false);

  useEffect(() => {
    const allTeamDefeated = team.length && team.every((t) => t.hp <= 0);
    if (allTeamDefeated) {
      console.log('Defeat!');
      setIsRunningRound(false);
      setPhase(BattlePhase.Defeat);
    }
  }, [team]);

  useEffect(() => {
    const allEnemiesDefeated =
      currentEncounter &&
      currentWave === currentEncounter.waves.length - 1 &&
      enemies.length &&
      enemies.every((e) => e.hp <= 0);
    if (allEnemiesDefeated) {
      console.log('Victory!');
      setIsRunningRound(false);
      setPhase(BattlePhase.Victory);
    }
  }, [currentEncounter, currentWave, enemies]);

  const startBattle = (encounter: EnemyEncounter) => {
    setCurrentEncounter(encounter);
    setTeam([]);
    setEnemies(
      encounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
      )
    );
    setPhase(BattlePhase.Preparing);
  };

  const advanceWave = () => {
    if (!currentEncounter) return;
    const nextWave = currentWave + 1;
    setCurrentWave(nextWave);
    setEnemies(
      currentEncounter.waves[nextWave].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
      )
    );
  };

  const retreat = () => {
    if (phase === BattlePhase.Preparing) {
      setPhase(BattlePhase.Idle);
      setCurrentEncounter(undefined);
    } else {
      setPhase(BattlePhase.Retreated);
    }
    // optionally clear other state
  };

  const confirmTeam = (team: RecruitedCharacterData[]) => {
    setTeam(
      team.map(({ id, exp, maskColorOverride, maskOverride }) =>
        generateCombatantStats(
          id,
          id,
          getLevelFromExp(exp),
          maskOverride,
          maskColorOverride
        )
      ) // add stats
    );
    setCurrentWave(0);
    setEnemies(
      currentEncounter!.waves[0].map(({ id, lvl }, index) =>
        generateCombatantStats(`${id} ${TEAM_POSITION_LABELS[index]}`, id, lvl)
      )
    );
    setPhase(BattlePhase.Inprogress);
  };

  const runRound = () => {
    const queue: (() => void)[] = [];
    queueCombatRound(team, enemies, setTeam, setEnemies, (fn) =>
      queue.push(fn)
    );
    setActionQueue(queue);
  };

  const playActionQueue = async () => {
    setIsRunningRound(true);
    for (const step of actionQueue) {
      await step();
    }
    setActionQueue([]);
    setIsRunningRound(false);
  };

  return {
    phase,
    currentEncounter,
    currentWave,
    enemies,
    team,
    confirmTeam,
    startBattle,
    advanceWave,
    retreat,
    runRound,
    playActionQueue,
    isRunningRound,
    actionQueue,
    // ADD COLLECT REWARDS
  };
};
