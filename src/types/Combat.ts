import { LegoColor } from './Colors';
import { GameState } from './GameState';
import { ElementTribe, Mask } from './Matoran';

export interface BattleDrop {
  id: string;
  chance: number;
}

export interface Combatant {
  id: string;
  name: string;
  model: string;
  lvl: number;
  maskOverride?: Mask;
  maskColorOverride?: LegoColor;
  element: ElementTribe;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
}

export interface MaskPower {
  description: string;
  shortName: Mask;
  longName: string;
  effect: MaskEffect;
}

interface CombatDuration {
  unit: 'attack' | 'hit' | 'turn' | 'round' | 'wave';
  amount: number;
}

type MaskEffect = {
  type:
    | 'ATK_MULT'
    | 'DMG_MITIGATOR'
    | 'HEAL'
    | 'AGGRO'
    | 'SPEED'
    | 'ACCURACY_MULT'
    | 'CONFUSION';
  duration: CombatDuration;
  cooldown: CombatDuration;
  multiplier?: number;
  target: 'self' | 'enemy' | 'allEnemies';
};

export interface CombatantTemplate {
  id: string;
  name: string;
  model: string;
  element: ElementTribe;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
}

export interface CombatRoundResult {
  updatedTeam: Combatant[];
  updatedEnemies: Combatant[];
  log: string[];
}

export interface EnemyEncounter {
  id: string;
  name: string;
  description: string;
  unlockedAfter?: GameState['completedQuests'];
  difficulty: number;
  headliner: Combatant['id'];
  waves: Array<{ id: string; lvl: number }[]>;
  loot: BattleDrop[];
}
