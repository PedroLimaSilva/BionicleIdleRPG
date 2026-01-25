import { addToInventory, mergeInventory, Inventory } from './inventoryUtils';
import { GameItemId } from '../data/loot';

describe('inventoryUtils', () => {
  describe('addToInventory', () => {
    test('adds item to empty inventory', () => {
      const inventory: Inventory = {};
      const result = addToInventory(inventory, GameItemId.LightStone, 5);

      expect(result[GameItemId.LightStone]).toBe(5);
    });

    test('adds item to existing inventory with different items', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = addToInventory(inventory, GameItemId.Charcoal, 2);

      expect(result[GameItemId.LightStone]).toBe(3);
      expect(result[GameItemId.Charcoal]).toBe(2);
    });

    test('stacks item with existing quantity', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, 5);

      expect(result[GameItemId.LightStone]).toBe(8);
    });

    test('handles adding zero quantity', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, 0);

      expect(result[GameItemId.LightStone]).toBe(3);
    });

    test('handles negative quantity (removing items)', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 10,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, -3);

      expect(result[GameItemId.LightStone]).toBe(7);
    });

    test('can reduce quantity to zero', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 5,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, -5);

      expect(result[GameItemId.LightStone]).toBe(0);
    });

    test('can reduce quantity below zero (debt)', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, -5);

      expect(result[GameItemId.LightStone]).toBe(-2);
    });

    test('does not mutate original inventory', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = addToInventory(inventory, GameItemId.LightStone, 5);

      expect(inventory[GameItemId.LightStone]).toBe(3);
      expect(result[GameItemId.LightStone]).toBe(8);
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
      const loot: Inventory = {
        [GameItemId.LightStone]: 5,
        [GameItemId.Charcoal]: 3,
      };
      const result = mergeInventory(inventory, loot);

      expect(result[GameItemId.LightStone]).toBe(5);
      expect(result[GameItemId.Charcoal]).toBe(3);
    });

    test('merges empty loot into existing inventory', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 5,
      };
      const loot: Inventory = {};
      const result = mergeInventory(inventory, loot);

      expect(result[GameItemId.LightStone]).toBe(5);
    });

    test('stacks items when merging', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 5,
        [GameItemId.Charcoal]: 2,
      };
      const loot: Inventory = {
        [GameItemId.LightStone]: 3,
        [GameItemId.Charcoal]: 1,
      };
      const result = mergeInventory(inventory, loot);

      expect(result[GameItemId.LightStone]).toBe(8);
      expect(result[GameItemId.Charcoal]).toBe(3);
    });

    test('adds new items from loot', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 5,
      };
      const loot: Inventory = {
        [GameItemId.Charcoal]: 3,
        [GameItemId.AquaFilter]: 2,
      };
      const result = mergeInventory(inventory, loot);

      expect(result[GameItemId.LightStone]).toBe(5);
      expect(result[GameItemId.Charcoal]).toBe(3);
      expect(result[GameItemId.AquaFilter]).toBe(2);
    });

    test('handles mixed merge with new and existing items', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 10,
        [GameItemId.Charcoal]: 5,
      };
      const loot: Inventory = {
        [GameItemId.LightStone]: 2,
        [GameItemId.AquaFilter]: 7,
      };
      const result = mergeInventory(inventory, loot);

      expect(result[GameItemId.LightStone]).toBe(12);
      expect(result[GameItemId.Charcoal]).toBe(5);
      expect(result[GameItemId.AquaFilter]).toBe(7);
    });

    test('does not mutate original inventory', () => {
      const inventory: Inventory = {
        [GameItemId.LightStone]: 5,
      };
      const loot: Inventory = {
        [GameItemId.LightStone]: 3,
      };
      const result = mergeInventory(inventory, loot);

      expect(inventory[GameItemId.LightStone]).toBe(5);
      expect(result[GameItemId.LightStone]).toBe(8);
      expect(result).not.toBe(inventory);
    });
  });
});
