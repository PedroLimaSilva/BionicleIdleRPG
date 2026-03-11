import { addToInventory, mergeInventory, Inventory } from './inventoryUtils';
import { GameItemId } from '../data/loot';

// Synthetic item IDs for testing the inventory utility functions.
// GameItemId is intentionally empty (kraata moved to KraataCollection);
// these casts verify the utility logic still works for future items.
const ItemA = 'TestItemA' as unknown as GameItemId;
const ItemB = 'TestItemB' as unknown as GameItemId;
const ItemC = 'TestItemC' as unknown as GameItemId;

describe('inventoryUtils', () => {
  describe('addToInventory', () => {
    test('adds item to empty inventory', () => {
      const inventory: Inventory = {};
      const result = addToInventory(inventory, ItemA, 5);

      expect(result[ItemA]).toBe(5);
    });

    test('adds item to existing inventory with different items', () => {
      const inventory: Inventory = { [ItemA]: 3 } as Inventory;
      const result = addToInventory(inventory, ItemB, 2);

      expect(result[ItemA]).toBe(3);
      expect(result[ItemB]).toBe(2);
    });

    test('stacks item with existing quantity', () => {
      const inventory: Inventory = { [ItemA]: 3 } as Inventory;
      const result = addToInventory(inventory, ItemA, 5);

      expect(result[ItemA]).toBe(8);
    });

    test('handles adding zero quantity', () => {
      const inventory: Inventory = { [ItemA]: 3 } as Inventory;
      const result = addToInventory(inventory, ItemA, 0);

      expect(result[ItemA]).toBe(3);
    });

    test('handles negative quantity (removing items)', () => {
      const inventory: Inventory = { [ItemA]: 10 } as Inventory;
      const result = addToInventory(inventory, ItemA, -3);

      expect(result[ItemA]).toBe(7);
    });

    test('can reduce quantity to zero', () => {
      const inventory: Inventory = { [ItemA]: 5 } as Inventory;
      const result = addToInventory(inventory, ItemA, -5);

      expect(result[ItemA]).toBe(0);
    });

    test('can reduce quantity below zero (debt)', () => {
      const inventory: Inventory = { [ItemA]: 3 } as Inventory;
      const result = addToInventory(inventory, ItemA, -5);

      expect(result[ItemA]).toBe(-2);
    });

    test('does not mutate original inventory', () => {
      const inventory: Inventory = { [ItemA]: 3 } as Inventory;
      const result = addToInventory(inventory, ItemA, 5);

      expect(inventory[ItemA]).toBe(3);
      expect(result[ItemA]).toBe(8);
      expect(result).not.toBe(inventory);
    });
  });

  describe('mergeInventory', () => {
    test('merges empty loot into empty inventory', () => {
      const inventory: Inventory = {};
      const loot: Inventory = {};
      const result = mergeInventory(inventory, loot);

      expect(result).toEqual({});
    });

    test('merges loot into empty inventory', () => {
      const inventory: Inventory = {};
      const loot: Inventory = { [ItemA]: 5, [ItemB]: 3 } as Inventory;
      const result = mergeInventory(inventory, loot);

      expect(result[ItemA]).toBe(5);
      expect(result[ItemB]).toBe(3);
    });

    test('merges empty loot into existing inventory', () => {
      const inventory: Inventory = { [ItemA]: 5 } as Inventory;
      const loot: Inventory = {};
      const result = mergeInventory(inventory, loot);

      expect(result[ItemA]).toBe(5);
    });

    test('stacks items when merging', () => {
      const inventory: Inventory = { [ItemA]: 5, [ItemB]: 2 } as Inventory;
      const loot: Inventory = { [ItemA]: 3, [ItemB]: 1 } as Inventory;
      const result = mergeInventory(inventory, loot);

      expect(result[ItemA]).toBe(8);
      expect(result[ItemB]).toBe(3);
    });

    test('adds new items from loot', () => {
      const inventory: Inventory = { [ItemA]: 5 } as Inventory;
      const loot: Inventory = { [ItemB]: 3, [ItemC]: 2 } as Inventory;
      const result = mergeInventory(inventory, loot);

      expect(result[ItemA]).toBe(5);
      expect(result[ItemB]).toBe(3);
      expect(result[ItemC]).toBe(2);
    });

    test('handles mixed merge with new and existing items', () => {
      const inventory: Inventory = { [ItemA]: 10, [ItemB]: 5 } as Inventory;
      const loot: Inventory = { [ItemA]: 2, [ItemC]: 7 } as Inventory;
      const result = mergeInventory(inventory, loot);

      expect(result[ItemA]).toBe(12);
      expect(result[ItemB]).toBe(5);
      expect(result[ItemC]).toBe(7);
    });

    test('does not mutate original inventory', () => {
      const inventory: Inventory = { [ItemA]: 5 } as Inventory;
      const loot: Inventory = { [ItemA]: 3 } as Inventory;
      const result = mergeInventory(inventory, loot);

      expect(inventory[ItemA]).toBe(5);
      expect(result[ItemA]).toBe(8);
      expect(result).not.toBe(inventory);
    });
  });
});
