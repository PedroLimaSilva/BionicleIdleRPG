import { GameItemId } from '../data/loot';

export type Inventory = Partial<Record<GameItemId, number>>;

export function addToInventory(inventory: Inventory, item: GameItemId, amount: number): Inventory {
  return {
    ...inventory,
    [item]: (inventory[item] || 0) + amount,
  };
}

export function mergeInventory(inventory: Inventory, loot: Inventory): Inventory {
  const changedItems: Inventory = {};
  Object.entries(loot).forEach(([item, amount]) => {
    const itemId = item as unknown as GameItemId;
    changedItems[itemId] = (inventory[itemId] ?? 0) + (amount ?? 0);
  });
  return { ...inventory, ...changedItems };
}
