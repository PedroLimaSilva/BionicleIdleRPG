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
    test('diminished includes arms like rebuilt', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.Diminished);
      expect(s.has('arms')).toBe(true);
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
        'arms',
        'feet',
        'eyes',
        'face',
      ]);
    });
  });

  describe('normalizeCustomCharacterColorsForStage', () => {
    test('preserves palette for diminished (arms may differ from body)', () => {
      const c = normalizeCustomCharacterColorsForStage(MatoranStage.Diminished, sampleColors);
      expect(c).toEqual(sampleColors);
    });

    test('preserves palette for rebuilt', () => {
      const c = normalizeCustomCharacterColorsForStage(MatoranStage.Rebuilt, sampleColors);
      expect(c).toEqual(sampleColors);
    });
  });

  describe('prefillColorsAfterEvolution', () => {
    test('diminished to rebuilt keeps arm color from custom palette', () => {
      const merged = prefillColorsAfterEvolution(MatoranStage.Diminished, MatoranStage.Rebuilt, sampleColors);
      expect(merged.arms).toBe(sampleColors.arms);
      expect(merged.body).toBe(sampleColors.body);
    });

    test('no-op when stages match', () => {
      const merged = prefillColorsAfterEvolution(MatoranStage.Rebuilt, MatoranStage.Rebuilt, sampleColors);
      expect(merged).toEqual(sampleColors);
    });
  });
});
