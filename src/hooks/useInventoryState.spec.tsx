/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useInventoryState } from './useInventoryState';
import { GameItemId } from '../data/loot';
import { Inventory } from '../services/inventoryUtils';

describe('useInventoryState', () => {
  describe('initialization', () => {
    test('initializes with empty inventory', () => {
      const { result } = renderHook(() => useInventoryState({}));

      expect(result.current.inventory).toEqual({});
    });

    test('initializes with provided inventory', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
        [GameItemId.KraataAnger]: 5,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      expect(result.current.inventory).toEqual(initialInventory);
    });
  });

  describe('addItemToInventory', () => {
    test('adds new item to empty inventory', () => {
      const { result } = renderHook(() => useInventoryState({}));

      act(() => {
        result.current.addItemToInventory(GameItemId.KraataFear, 5);
      });

      expect(result.current.inventory[GameItemId.KraataFear]).toBe(5);
    });

    test('stacks items when adding to existing item', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(GameItemId.KraataFear, 5);
      });

      expect(result.current.inventory[GameItemId.KraataFear]).toBe(15);
    });

    test('removes items when adding negative amount', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(GameItemId.KraataFear, -3);
      });

      expect(result.current.inventory[GameItemId.KraataFear]).toBe(7);
    });

    test('adds multiple different items', () => {
      const { result } = renderHook(() => useInventoryState({}));

      act(() => {
        result.current.addItemToInventory(GameItemId.KraataFear, 5);
        result.current.addItemToInventory(GameItemId.KraataAnger, 3);
        result.current.addItemToInventory(GameItemId.KraataPoison, 10);
      });

      expect(result.current.inventory).toEqual({
        [GameItemId.KraataFear]: 5,
        [GameItemId.KraataAnger]: 3,
        [GameItemId.KraataPoison]: 10,
      });
    });

    test('does not mutate original inventory', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.addItemToInventory(GameItemId.KraataAnger, 5);
      });

      expect(initialInventory).toEqual({
        [GameItemId.KraataFear]: 10,
      });
    });
  });

  describe('setInventory', () => {
    test('replaces entire inventory', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      const newInventory: Inventory = {
        [GameItemId.KraataAnger]: 20,
        [GameItemId.KraataPoison]: 15,
      };

      act(() => {
        result.current.setInventory(newInventory);
      });

      expect(result.current.inventory).toEqual(newInventory);
    });

    test('can clear inventory by setting to empty object', () => {
      const initialInventory: Inventory = {
        [GameItemId.KraataFear]: 10,
        [GameItemId.KraataAnger]: 5,
      };

      const { result } = renderHook(() => useInventoryState(initialInventory));

      act(() => {
        result.current.setInventory({});
      });

      expect(result.current.inventory).toEqual({});
    });
  });
});
