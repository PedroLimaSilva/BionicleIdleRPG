import { CHARACTER_DEX } from '../../data/dex';
import { Mask, MatoranStage } from '../../types/Matoran';
import {
  getAdjacentDexIds,
  getCharacterDexEntries,
  matchesDexTab,
  toDexPreviewMatoran,
} from './dexEntries';

describe('character dex entries', () => {
  test('lists every dex character including un-recruited Toa', () => {
    const ids = getCharacterDexEntries().map((entry) => entry.id);
    expect(ids).toEqual(
      expect.arrayContaining(['Takua', 'Toa_Tahu', 'gahlok', 'bordakh', 'nui_rama'])
    );
    expect(ids).toHaveLength(Object.keys(CHARACTER_DEX).length);
  });

  test('sorts by name with static entries before custom ids', () => {
    const names = getCharacterDexEntries().map((entry) => entry.name);
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  test('tabs partition matoran, toa, and other', () => {
    const takua = CHARACTER_DEX.Takua;
    const tahu = CHARACTER_DEX.Toa_Tahu;
    const gahlok = CHARACTER_DEX.gahlok;
    expect(matchesDexTab(takua, 'matoran')).toBe(true);
    expect(matchesDexTab(takua, 'toa')).toBe(false);
    expect(matchesDexTab(tahu, 'toa')).toBe(true);
    expect(matchesDexTab(gahlok, 'other')).toBe(true);
    expect(matchesDexTab(gahlok, 'all')).toBe(true);
  });

  test('adjacent ids wrap around the sorted dex', () => {
    const entries = getCharacterDexEntries();
    const first = entries[0].id;
    const last = entries[entries.length - 1].id;
    expect(getAdjacentDexIds(first)).toEqual({
      nextId: entries[1].id,
      prevId: last,
    });
    expect(getAdjacentDexIds(last)).toEqual({
      nextId: first,
      prevId: entries[entries.length - 2].id,
    });
    expect(getAdjacentDexIds('missing')).toBeNull();
  });

  test('preview matoran unlocks every mask and does not require recruitment', () => {
    const preview = toDexPreviewMatoran(CHARACTER_DEX.Toa_Tahu, {
      maskOverride: Mask.Kakama,
      maskPowerActive: true,
    });
    expect(preview.exp).toBe(0);
    expect(preview.stage).toBe(MatoranStage.ToaMata);
    expect(preview.maskOverride).toBe(Mask.Kakama);
    expect(preview.maskPowerActive).toBe(true);
    expect(preview.unlockAllMasks).toBe(true);
  });
});
