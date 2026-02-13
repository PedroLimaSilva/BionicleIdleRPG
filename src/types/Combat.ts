import { LegoColor } from './Colors';
import { GameState } from './GameState';
import { ElementTribe, Mask } from './Matoran';

export interface BattleDrop {
  id: string;
  chance: number;
}

export const enum BattleStrategy {
  Random = 'Random', // Will target a random enemy
  LowestHp = 'LowestHp', // Will target the enemy with lowest hp, even if not effective against it
  MostEffective = 'MostEffective', // Will target the enemy it estimates will take more damage from an attack
}

/** Debuff applied to a combatant. DEFENSE = increased damage taken; CONFUSION = attacks own team. */
export type TargetDebuff =
  | {
      type: 'DEFENSE';
      multiplier: number;
      durationRemaining: number;
      durationUnit: 'turn' | 'round';
      sourceSide: 'team' | 'enemy';
    }
  | {
      type: 'CONFUSION';
      durationRemaining: number;
      durationUnit: 'turn' | 'round';
      sourceSide: 'team' | 'enemy';
    };

export interface Combatant {
  id: string;
  name: string;
  model: string;
  lvl: number;
  maskPower?: MaskPower;
  maskColorOverride?: LegoColor;
  debuffs?: TargetDebuff[];
  element: ElementTribe;
  maxHp: number;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  willUseAbility: boolean;
  strategy: BattleStrategy;
}

export interface MaskPower {
  description: string;
  shortName: Mask;
  longName: string;
  effect: MaskEffect;
  active?: boolean;
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
    | 'DEBUFF';
  duration: CombatDuration;
  cooldown: CombatDuration;
  multiplier?: number;
  target: 'self' | 'enemy' | 'allEnemies';
  /** For DEBUFF: subtype (DEFENSE = increased damage taken, CONFUSION = attack own team) */
  debuffType?: 'DEFENSE' | 'CONFUSION';
  /** For DEBUFF: duration of the debuff on the target (e.g. 2 rounds) */
  debuffDuration?: CombatDuration;
};

export interface CombatantTemplate {
  id: string;
  name: string;
  model: string;
  mask?: Mask;
  element: ElementTribe;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  strategy?: BattleStrategy;
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
