import { GameItemId } from '../data/loot';

export type Inventory = Partial<Record<GameItemId, number>>;

export function addToInventory(
  inventory: Inventory,
  item: GameItemId,
  amount: number
): Inventory {
  return {
    ...inventory,
    [item]: (inventory[item] || 0) + amount,
  };
}
