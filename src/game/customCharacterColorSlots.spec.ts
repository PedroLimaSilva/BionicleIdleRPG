import { MatoranStage } from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import {
  getEditablePaletteKeysForStage,
  getOrderedEditableColorTabs,
  normalizeCustomCharacterColorsForStage,
  prefillColorsAfterEvolution,
} from './customCharacterColorSlots';

const sampleColors = {
  arms: LegoColor.Red,
  body: LegoColor.Blue,
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: LegoColor.Green,
  mask: LegoColor.Yellow,
};

describe('customCharacterColorSlots', () => {
  describe('getEditablePaletteKeysForStage', () => {
    test('diminished omits arms', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.Diminished);
      expect(s.has('arms')).toBe(false);
      expect(s.has('body')).toBe(true);
      expect(s.has('mask')).toBe(true);
    });

    test('rebuilt includes arms', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.Rebuilt);
      expect(s.has('arms')).toBe(true);
      expect(s.has('feet')).toBe(true);
    });

    test('toa mata only exposes mask and eyes', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata);
      expect([...s].sort()).toEqual(['eyes', 'mask']);
    });
  });

  describe('getOrderedEditableColorTabs', () => {
    test('returns tabs in canonical order', () => {
      expect(getOrderedEditableColorTabs(MatoranStage.Diminished)).toEqual([
        'mask',
        'body',
        'feet',
        'eyes',
        'face',
      ]);
    });
  });

  describe('normalizeCustomCharacterColorsForStage', () => {
    test('forces arms to body for diminished', () => {
      const c = normalizeCustomCharacterColorsForStage(MatoranStage.Diminished, sampleColors);
      expect(c.arms).toBe(sampleColors.body);
    });

    test('does not merge arms into body for rebuilt', () => {
      const c = normalizeCustomCharacterColorsForStage(MatoranStage.Rebuilt, sampleColors);
      expect(c.arms).toBe(sampleColors.arms);
    });
  });

  describe('prefillColorsAfterEvolution', () => {
    test('diminished to rebuilt seeds arms from body', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.Rebuilt,
        normalizeCustomCharacterColorsForStage(MatoranStage.Diminished, sampleColors)
      );
      expect(merged.arms).toBe(merged.body);
    });

    test('no-op when stages match', () => {
      const merged = prefillColorsAfterEvolution(MatoranStage.Rebuilt, MatoranStage.Rebuilt, sampleColors);
      expect(merged).toEqual(sampleColors);
    });
  });
});
