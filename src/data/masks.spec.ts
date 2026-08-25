import { readFileSync } from 'fs';
import { resolve } from 'path';

import { CHARACTER_DEX } from './dex';
import {
  ALL_MASKS,
  getSelectableMasksForStage,
  isMaskSelectableForStage,
  isTransparentMask,
  GREAT_MASKS,
  MATAN_MASKS,
  NUVA_MASKS,
} from './masks';
import { Mask, MatoranStage } from '../types/Matoran';

/**
 * `Mask` is a const enum, so it is erased at compile time and cannot be enumerated at runtime.
 * Read the declaration off disk instead so a mask added to the enum but forgotten in
 * `ALL_MASKS` fails here rather than silently disappearing from the creation picker.
 */
function readMaskEnumValues(): string[] {
  const source = readFileSync(resolve(__dirname, '../types/Matoran.ts'), 'utf8');
  const body = /export const enum Mask \{([\s\S]*?)\n\}/.exec(source);
  if (!body) throw new Error('Could not locate the Mask enum in src/types/Matoran.ts');
  return [...body[1].matchAll(/=\s*'([^']+)'/g)].map((match) => match[1]);
}

describe('ALL_MASKS', () => {
  test('covers every value of the Mask enum exactly once', () => {
    expect([...ALL_MASKS].sort()).toEqual(readMaskEnumValues().sort());
  });

  test('has no duplicates', () => {
    expect(new Set(ALL_MASKS).size).toBe(ALL_MASKS.length);
  });

  test('opens with the Matoran-tier sculpts', () => {
    expect(ALL_MASKS.slice(0, 6)).toEqual([
      Mask.Hau,
      Mask.Kaukau,
      Mask.Kakama,
      Mask.Akaku,
      Mask.Pakari,
      Mask.Miru,
    ]);
  });
});

describe('mask tiers', () => {
  test('partition ALL_MASKS into mata, great, and nuva tiers before story masks', () => {
    expect(MATAN_MASKS).toHaveLength(12);
    expect(GREAT_MASKS).toHaveLength(7);
    expect(NUVA_MASKS).toHaveLength(6);
    expect([...MATAN_MASKS, ...GREAT_MASKS, ...NUVA_MASKS]).toEqual(ALL_MASKS.slice(0, 25));
  });
});

describe('getSelectableMasksForStage', () => {
  test('mata-tier rigs offer the original 12 masks', () => {
    for (const stage of [
      MatoranStage.Diminished,
      MatoranStage.Rebuilt,
      MatoranStage.Metru,
      MatoranStage.ToaMata,
      MatoranStage.Turaga,
    ]) {
      expect(getSelectableMasksForStage(stage)).toEqual(MATAN_MASKS);
    }
  });

  test('Toa Metru offers Great masks only', () => {
    expect(getSelectableMasksForStage(MatoranStage.ToaMetru)).toEqual(GREAT_MASKS);
  });

  test('Toa Nuva offers Nuva masks only', () => {
    expect(getSelectableMasksForStage(MatoranStage.ToaNuva)).toEqual(NUVA_MASKS);
  });

  test('excludes story masks from every creation stage', () => {
    const storyMasks = [Mask.Avohkii, Mask.Vahi, Mask.Kraahkan, Mask.HauNuvaInfected, Mask.Krana];
    const stages = [
      MatoranStage.Diminished,
      MatoranStage.Rebuilt,
      MatoranStage.Metru,
      MatoranStage.ToaMata,
      MatoranStage.ToaMetru,
      MatoranStage.ToaNuva,
      MatoranStage.Turaga,
      MatoranStage.Bohrok,
      MatoranStage.BohrokKal,
      MatoranStage.Makuta,
    ];
    for (const stage of stages) {
      const selectable = getSelectableMasksForStage(stage);
      for (const storyMask of storyMasks) {
        expect(selectable).not.toContain(storyMask);
      }
    }
  });
});

describe('isMaskSelectableForStage', () => {
  test('rejects a Great mask on a diminished rig', () => {
    expect(isMaskSelectableForStage(Mask.HauGreat, MatoranStage.Diminished)).toBe(false);
  });

  test('accepts a Nuva mask on a Toa Nuva rig', () => {
    expect(isMaskSelectableForStage(Mask.HauNuva, MatoranStage.ToaNuva)).toBe(true);
  });
});

describe('CHARACTER_DEX Kanohi', () => {
  test('every entry wears a known mask', () => {
    for (const entry of Object.values(CHARACTER_DEX)) {
      expect(ALL_MASKS).toContain(entry.mask);
    }
  });

  // Avatars render the mask verbatim, so a Toa Metru has to name the Great sculpt itself.
  test('Toa Metru name their Great sculpt directly', () => {
    const toaMetru = Object.values(CHARACTER_DEX).filter(
      (entry) => entry.stage === MatoranStage.ToaMetru
    );
    expect(toaMetru.length).toBeGreaterThan(0);
    for (const entry of toaMetru) {
      expect(entry.mask).toMatch(/_Great$/);
    }
  });
});

describe('isTransparentMask', () => {
  test('matches the Kaukau sculpts flagged transparent in the dex', () => {
    expect(isTransparentMask(Mask.Kaukau)).toBe(true);
    expect(isTransparentMask(Mask.KaukauNuva)).toBe(true);
  });

  test('is false for opaque Kanohi', () => {
    expect(isTransparentMask(Mask.Hau)).toBe(false);
    expect(isTransparentMask(Mask.HauGreat)).toBe(false);
  });
});
