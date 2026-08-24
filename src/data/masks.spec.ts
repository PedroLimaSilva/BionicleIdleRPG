import { readFileSync } from 'fs';
import { resolve } from 'path';

import { CHARACTER_DEX } from './dex';
import { ALL_MASKS, isTransparentMask } from './masks';
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
