import { ElementTribe } from '../types/Matoran';
import type { KranaCollection } from '../types/Krana';
import {
  BOHROK_EVOLVE_TOA_NUVA_QUEST_ID,
  BOHROK_KRANA_LEGEND_QUEST_ID,
} from '../data/quests/bohrok_swarm';
import {
  ALL_KRANA_IDS,
  ELEMENT_TO_KRANA_COLOR,
  getElementKranaProgress,
  isKranaArcCompleted,
  isKranaCollectionActive,
  isKranaCollectionUnlocked,
  isKranaCollected,
  isKranaElement,
  isKranaLootId,
  parseKranaDropId,
} from './Krana';

describe('Krana', () => {
  describe('ALL_KRANA_IDS', () => {
    test('contains exactly 8 krana types', () => {
      expect(ALL_KRANA_IDS).toHaveLength(8);
      expect(ALL_KRANA_IDS).toEqual(['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca']);
    });
  });

  describe('isKranaElement', () => {
    test('returns true for Fire, Water, Ice, Earth, Stone, Air', () => {
      expect(isKranaElement(ElementTribe.Fire)).toBe(true);
      expect(isKranaElement(ElementTribe.Water)).toBe(true);
      expect(isKranaElement(ElementTribe.Air)).toBe(true);
      expect(isKranaElement(ElementTribe.Earth)).toBe(true);
      expect(isKranaElement(ElementTribe.Ice)).toBe(true);
      expect(isKranaElement(ElementTribe.Stone)).toBe(true);
    });

    test('returns false for Light and Shadow', () => {
      expect(isKranaElement(ElementTribe.Light)).toBe(false);
      expect(isKranaElement(ElementTribe.Shadow)).toBe(false);
    });
  });

  describe('isKranaCollected', () => {
    test('returns true when krana is in collection', () => {
      const collected: KranaCollection = { [ElementTribe.Fire]: ['Xa', 'Bo'] };
      expect(isKranaCollected(collected, ElementTribe.Fire, 'Xa')).toBe(true);
      expect(isKranaCollected(collected, ElementTribe.Fire, 'Bo')).toBe(true);
    });

    test('returns false when krana is not in collection', () => {
      const collected: KranaCollection = { [ElementTribe.Fire]: ['Xa'] };
      expect(isKranaCollected(collected, ElementTribe.Fire, 'Bo')).toBe(false);
    });

    test('returns false when element has no collection', () => {
      const collected: Record<string, string[]> = {};
      expect(isKranaCollected(collected, ElementTribe.Fire, 'Xa')).toBe(false);
    });
  });

  describe('getElementKranaProgress', () => {
    test('returns collected krana and total 8', () => {
      const collected: KranaCollection = { [ElementTribe.Water]: ['Ja', 'Vu'] };
      const result = getElementKranaProgress(collected, ElementTribe.Water);
      expect(result.collected).toEqual(['Ja', 'Vu']);
      expect(result.total).toBe(8);
    });

    test('returns empty array when element has no collection', () => {
      const result = getElementKranaProgress({}, ElementTribe.Ice);
      expect(result.collected).toEqual([]);
      expect(result.total).toBe(8);
    });
  });

  describe('isKranaCollectionUnlocked', () => {
    test('returns true when bohrok_legend_of_krana is completed', () => {
      expect(isKranaCollectionUnlocked([BOHROK_KRANA_LEGEND_QUEST_ID])).toBe(true);
      expect(isKranaCollectionUnlocked(['other', BOHROK_KRANA_LEGEND_QUEST_ID])).toBe(true);
    });

    test('returns false when quest not completed', () => {
      expect(isKranaCollectionUnlocked([])).toBe(false);
      expect(isKranaCollectionUnlocked(['other_quest'])).toBe(false);
    });
  });

  describe('isKranaArcCompleted', () => {
    test('returns true when bohrok_evolve_toa_nuva is completed', () => {
      expect(isKranaArcCompleted([BOHROK_EVOLVE_TOA_NUVA_QUEST_ID])).toBe(true);
    });

    test('returns false when quest not completed', () => {
      expect(isKranaArcCompleted([])).toBe(false);
    });
  });

  describe('isKranaCollectionActive', () => {
    test('returns true when unlocked but arc not completed', () => {
      expect(
        isKranaCollectionActive([BOHROK_KRANA_LEGEND_QUEST_ID])
      ).toBe(true);
    });

    test('returns false when not unlocked', () => {
      expect(isKranaCollectionActive([])).toBe(false);
    });

    test('returns false when arc completed', () => {
      expect(
        isKranaCollectionActive([BOHROK_KRANA_LEGEND_QUEST_ID, BOHROK_EVOLVE_TOA_NUVA_QUEST_ID])
      ).toBe(false);
    });
  });

  describe('parseKranaDropId', () => {
    test('parses valid krana ids', () => {
      expect(parseKranaDropId('krana-ja-blue')).toEqual({
        element: ElementTribe.Fire,
        kranaId: 'Ja',
      });
      expect(parseKranaDropId('krana-vu-orange')).toEqual({
        element: ElementTribe.Water,
        kranaId: 'Vu',
      });
      expect(parseKranaDropId('krana-xa-lime')).toEqual({
        element: ElementTribe.Earth,
        kranaId: 'Xa',
      });
      expect(parseKranaDropId('krana-ca-white')).toEqual({
        element: ElementTribe.Ice,
        kranaId: 'Ca',
      });
      expect(parseKranaDropId('krana-za-green')).toEqual({
        element: ElementTribe.Stone,
        kranaId: 'Za',
      });
      expect(parseKranaDropId('krana-bo-red')).toEqual({
        element: ElementTribe.Air,
        kranaId: 'Bo',
      });
    });

    test('normalizes krana id case', () => {
      expect(parseKranaDropId('krana-JA-blue')).toEqual({
        element: ElementTribe.Fire,
        kranaId: 'Ja',
      });
    });

    test('returns null for invalid format', () => {
      expect(parseKranaDropId('not-krana')).toBeNull();
      expect(parseKranaDropId('krana-ja')).toBeNull();
      expect(parseKranaDropId('krana-ja-blue-extra')).toBeNull();
      expect(parseKranaDropId('')).toBeNull();
    });

    test('returns null for unknown color', () => {
      expect(parseKranaDropId('krana-ja-purple')).toBeNull();
    });

    test('returns null for unknown krana id', () => {
      expect(parseKranaDropId('krana-xx-blue')).toBeNull();
    });
  });

  describe('isKranaLootId', () => {
    test('returns true for valid krana loot ids', () => {
      expect(isKranaLootId('krana-ja-blue')).toBe(true);
      expect(isKranaLootId('krana-vu-orange')).toBe(true);
    });

    test('returns false for invalid ids', () => {
      expect(isKranaLootId('krana-xx-blue')).toBe(false);
      expect(isKranaLootId('charcoal')).toBe(false);
    });
  });

  describe('ELEMENT_TO_KRANA_COLOR', () => {
    test('maps each Toa element to a color', () => {
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Fire]).toBe('blue');
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Water]).toBe('orange');
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Air]).toBe('red');
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Earth]).toBe('lime');
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Ice]).toBe('white');
      expect(ELEMENT_TO_KRANA_COLOR[ElementTribe.Stone]).toBe('green');
    });
  });
});
