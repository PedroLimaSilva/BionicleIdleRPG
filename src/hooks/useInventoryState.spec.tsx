/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useInventoryState } from './useInventoryState';
import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';

// Synthetic item IDs — GameItemId is empty (kraata use KraataCollection).
const ItemA = 'TestItemA' as unknown as GameItemId;
const ItemB = 'TestItemB' as unknown as GameItemId;
const ItemC = 'TestItemC' as unknown as GameItemId;

describe('useInventoryState', () => {
  describe('initialization', () => {
    test('initializes with empty inventory', () => {
      const { result } = renderHook(() => useInventoryState({}));

      expect(result.current.inventory).toEqual({});
    });

    test('initializes with provided inventory', () => {
      const initialInventory: Inventory = { [ItemA]: 10, [ItemB]: 5 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      expect(result.current.inventory).toEqual(initialInventory);
    });
  });

  describe('addItemToInventory', () => {
    test('adds new item to empty inventory', () => {
      const { result } = renderHook(() => useInventoryState({}));

      act(() => {
        result.current.addItemToInventory(ItemA, 5);
      });

      expect(result.current.inventory[ItemA]).toBe(5);
    });

    test('stacks items when adding to existing item', () => {
      const initialInventory: Inventory = { [ItemA]: 10 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(ItemA, 5);
      });

      expect(result.current.inventory[ItemA]).toBe(15);
    });

    test('removes items when adding negative amount', () => {
      const initialInventory: Inventory = { [ItemA]: 10 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(ItemA, -3);
      });

      expect(result.current.inventory[ItemA]).toBe(7);
    });

    test('adds multiple different items', () => {
      const { result } = renderHook(() => useInventoryState({}));

      act(() => {
        result.current.addItemToInventory(ItemA, 5);
        result.current.addItemToInventory(ItemB, 3);
        result.current.addItemToInventory(ItemC, 10);
      });

      expect(result.current.inventory).toEqual({
        [ItemA]: 5,
        [ItemB]: 3,
        [ItemC]: 10,
      });
    });

    test('does not mutate original inventory', () => {
      const initialInventory: Inventory = { [ItemA]: 10 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(ItemB, 5);
      });

      expect(initialInventory).toEqual({ [ItemA]: 10 });
    });
  });

  describe('setInventory', () => {
    test('replaces entire inventory', () => {
      const initialInventory: Inventory = { [ItemA]: 10 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      const newInventory: Inventory = { [ItemB]: 20, [ItemC]: 15 } as Inventory;

      act(() => {
        result.current.setInventory(newInventory);
      });

      expect(result.current.inventory).toEqual(newInventory);
    });

    test('can clear inventory by setting to empty object', () => {
      const initialInventory: Inventory = { [ItemA]: 10, [ItemB]: 5 } as Inventory;

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.setInventory({});
      });

      expect(result.current.inventory).toEqual({});
    });
  });
});
