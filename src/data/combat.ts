import { BattlePhase, BattleState } from '../hooks/useBattleState';
import { CombatantDexEntry, EnemyEncounter } from '../types/Combat';
import { ElementTribe, RecruitedCharacterData } from '../types/Matoran';

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
};

export const ENEMY_DEX: Record<string, CombatantDexEntry> = {
  tahnok: {
    id: 'tahnok',
    name: 'Tahnok',
    element: ElementTribe.Fire,
  },
  gahlok: {
    id: 'gahlok',
    name: 'Gahlok',
    element: ElementTribe.Water,
  },
  lehvak: {
    id: 'lehvak',
    name: 'Lehvak',
    element: ElementTribe.Air,
  },

};

export const ENCOUNTERS: EnemyEncounter[] = [
  {
    id: 'tahnok',
    name: 'Tahnok Swarm',
    headliner: 'tahnok',
    waves: [
      [
        {
          id: 'tahnok',
          lvl: 5,
        },
      ],
    ],
    description: 'An aggressive swarm of fire-spewing Bohrok.',
    difficulty: 1,
    loot: [
      { id: 'krana-ja-blue', chance: 0.15 },
      { id: 'krana-zu-blue', chance: 0.1 },
    ],
  },
  {
    id: 'gahlok',
    name: 'Gahlok Swarm',
    headliner: 'gahlok',
    waves: [],
    description: 'Swift and evasive attackers.',
    difficulty: 1,
    loot: [
      { id: 'krana-vu-orange', chance: 0.12 },
      { id: 'krana-ja-orange', chance: 0.1 },
    ],
  },
  {
    id: 'lehvak',
    name: 'Lehvak Swarm',
    waves: [],
    headliner: 'lehvak',
    description: 'Swift and evasive attackers.',
    difficulty: 1,
    loot: [
      { id: 'krana-vu-red', chance: 0.12 },
      { id: 'krana-ja-red', chance: 0.1 },
    ],
  },
];