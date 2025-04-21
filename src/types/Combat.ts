import { GameState } from './GameState';
import { ElementTribe } from './Matoran';

export interface BattleDrop {
  id: string;
  chance: number;
}

export type CombatantDexEntry = {
  id: string;
  name: string;
  element: ElementTribe;
};

export interface Combatant {
  id: string;
  lvl: number;
}

export interface EnemyEncounter {
  id: string;
  name: string;
  description: string;
  unlockedAfter?: GameState['completedQuests'];
  difficulty: number;
  headliner: Combatant['id'];
  waves: Array<Combatant[]>;
  loot: BattleDrop[];
}
