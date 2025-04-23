import { BattlePhase, BattleState } from '../hooks/useBattleState';
import { CombatantTemplate, EnemyEncounter } from '../types/Combat';
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
  runRound: function (): void {
    throw new Error('Function not implemented.');
  },
  playActionQueue: function (): Promise<void> {
    throw new Error('Function not implemented.');
  },
  actionQueue: [],
  isRunningRound: false
};


export const COMBATANT_DEX: Record<string, CombatantTemplate> = {
  Toa_Kopaka: {
    id: 'Toa_Kopaka',
    name: 'Toa Kopaka',
    model: 'Toa_Kopaka',
    element: ElementTribe.Ice,
    baseHp: 90,
    baseAttack: 16,
    baseDefense: 14,
    baseSpeed: 8,
  },
  Toa_Pohatu: {
    id: 'Toa_Pohatu',
    name: 'Toa Pohatu',
    model: 'Toa_Pohatu',
    element: ElementTribe.Stone,
    baseHp: 100,
    baseAttack: 20,
    baseDefense: 12,
    baseSpeed: 6,
  },
  Toa_Tahu: {
    id: 'Toa_Tahu',
    name: 'Toa Tahu',
    model: 'Toa_Tahu',
    element: ElementTribe.Fire,
    baseHp: 90,
    baseAttack: 18,
    baseDefense: 10,
    baseSpeed: 9,
  },
  Toa_Onua: {
    id: 'Toa_Onua',
    name: 'Toa Onua',
    model: 'Toa_Onua',
    element: ElementTribe.Earth,
    baseHp: 110,
    baseAttack: 15,
    baseDefense: 16,
    baseSpeed: 5,
  },
  Toa_Gali: {
    id: 'Toa_Gali',
    name: 'Toa Gali',
    model: 'Toa_Gali',
    element: ElementTribe.Water,
    baseHp: 95,
    baseAttack: 14,
    baseDefense: 14,
    baseSpeed: 7,
  },
  Toa_Lewa: {
    id: 'Toa_Lewa',
    name: 'Toa Lewa',
    model: 'Toa_Lewa',
    element: ElementTribe.Air,
    baseHp: 85,
    baseAttack: 17,
    baseDefense: 10,
    baseSpeed: 11,
  },

  // Bohrok - Differentiated by swarm behavior
  tahnok: {
    id: 'tahnok',
    name: 'Tahnok',
    model: 'bohrok',
    element: ElementTribe.Fire,
    baseHp: 80,
    baseAttack: 22,
    baseDefense: 10,
    baseSpeed: 8,
  },
  gahlok: {
    id: 'gahlok',
    name: 'Gahlok',
    model: 'bohrok',
    element: ElementTribe.Water,
    baseHp: 75,
    baseAttack: 18,
    baseDefense: 12,
    baseSpeed: 10,
  },
  lehvak: {
    id: 'lehvak',
    name: 'Lehvak',
    model: 'bohrok',
    element: ElementTribe.Air,
    baseHp: 70,
    baseAttack: 16,
    baseDefense: 9,
    baseSpeed: 12,
  },
  pahrak: {
    id: 'pahrak',
    name: 'Pahrak',
    model: 'bohrok',
    element: ElementTribe.Stone,
    baseHp: 95,
    baseAttack: 20,
    baseDefense: 14,
    baseSpeed: 6,
  },
  nuhvok: {
    id: 'nuhvok',
    name: 'Nuhvok',
    model: 'bohrok',
    element: ElementTribe.Earth,
    baseHp: 90,
    baseAttack: 17,
    baseDefense: 15,
    baseSpeed: 5,
  },
  kohrak: {
    id: 'kohrak',
    name: 'Kohrak',
    model: 'bohrok',
    element: ElementTribe.Ice,
    baseHp: 85,
    baseAttack: 19,
    baseDefense: 11,
    baseSpeed: 9,
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
          lvl: 20,
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
    waves: [
      [
        {
          id: 'gahlok',
          lvl: 20,
        },
      ],
    ],
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
    waves: [
      [
        {
          id: 'lehvak',
          lvl: 20,
        },
      ],
    ],
    headliner: 'lehvak',
    description: 'Swift and evasive attackers.',
    difficulty: 1,
    loot: [
      { id: 'krana-vu-red', chance: 0.12 },
      { id: 'krana-ja-red', chance: 0.1 },
    ],
  },
];