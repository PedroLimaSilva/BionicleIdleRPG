import { useState } from 'react';
import { GameItemId } from '../data/loot';
import { addToInventory, Inventory } from '../services/inventoryUtils';

export function useInventoryState(initialInventory: Inventory) {
  const [inventory, setInventory] = useState<Inventory>(initialInventory);

  const addItemToInventory = (item: GameItemId, amount: number) => {
    setInventory((prev) => addToInventory(prev, item, amount));
  };

  return {
    inventory,
    setInventory,
    addItemToInventory,
  };
}
