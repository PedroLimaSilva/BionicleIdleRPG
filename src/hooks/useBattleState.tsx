import { useState } from 'react';
import { Combatant, EnemyEncounter } from '../types/Combat';
import { RecruitedCharacterData } from '../types/Matoran';
import { getLevelFromExp } from '../game/Levelling';
import { INITIAL_BATTLE_STATE } from '../data/combat';

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
}

export const useBattleState = (): BattleState => {
  const [phase, setPhase] = useState<BattlePhase>(INITIAL_BATTLE_STATE.phase);
  const [currentEncounter, setCurrentEncounter] =
    useState<EnemyEncounter | undefined>(INITIAL_BATTLE_STATE.currentEncounter);
  const [currentWave, setCurrentWave] = useState(INITIAL_BATTLE_STATE.currentWave);
  const [enemies, setEnemies] = useState<Combatant[]>(INITIAL_BATTLE_STATE.enemies);
  const [team, setTeam] = useState<Combatant[]>(INITIAL_BATTLE_STATE.team);

  const startBattle = (encounter: EnemyEncounter) => {
    setCurrentEncounter(encounter);
    setPhase(BattlePhase.Preparing);
  };

  const advanceWave = () => {
    if (!currentEncounter) return;
    const nextWave = currentWave + 1;
    setCurrentWave(nextWave);
    setEnemies(currentEncounter.waves[nextWave]);
  };

  const retreat = () => {
    setPhase(BattlePhase.Retreated);
    // optionally clear other state
  };

  const confirmTeam = (team: RecruitedCharacterData[]) => {
    setTeam(
      team.map((t) => ({ id: t.id, lvl: getLevelFromExp(t.exp) } as Combatant)) // add stats
    );
    setCurrentWave(0);
    setEnemies(currentEncounter!.waves[0]);
    setPhase(BattlePhase.Inprogress);
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
  };
};
