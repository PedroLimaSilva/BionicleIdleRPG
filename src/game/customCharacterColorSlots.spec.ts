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

    test('toa mata with kit rig exposes full palette', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Tahu');
      expect(s.has('arms')).toBe(true);
      expect(s.has('body')).toBe(true);
      expect(s.has('metal')).toBe(true);
      expect(s.has('joints')).toBe(true);
      expect(s.has('weaponGlow')).toBe(true);
    });

    test('toa nuva and metru expose metal and joints', () => {
      expect(getEditablePaletteKeysForStage(MatoranStage.ToaNuva).has('metal')).toBe(true);
      expect(getEditablePaletteKeysForStage(MatoranStage.Metru).has('joints')).toBe(true);
      expect(getEditablePaletteKeysForStage(MatoranStage.ToaMetru).has('metal')).toBe(true);
    });

    test('toa mata kopaka kit exposes full palette', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Kopaka');
      expect(s.has('feet')).toBe(true);
      expect(s.has('mask')).toBe(true);
      expect(s.has('weaponGlow')).toBe(true);
    });

    test('toa mata onua kit exposes full palette', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Onua');
      expect(s.has('arms')).toBe(true);
      expect(s.has('weaponGlow')).toBe(true);
    });

    test('toa mata without build id defaults to mask and eyes', () => {
      expect([...getEditablePaletteKeysForStage(MatoranStage.ToaMata)].sort()).toEqual([
        'eyes',
        'mask',
      ]);
    });
  });

  describe('getOrderedEditableColorTabs', () => {
    test('returns tabs in canonical order for diminished', () => {
      expect(getOrderedEditableColorTabs(MatoranStage.Diminished)).toEqual([
        'mask',
        'body',
        'arms',
        'feet',
        'eyes',
        'face',
      ]);
    });

    test('toa mata kit build includes body and arms tabs in order', () => {
      expect(getOrderedEditableColorTabs(MatoranStage.ToaMata, 'Toa_Gali')).toEqual([
        'mask',
        'body',
        'arms',
        'feet',
        'eyes',
        'face',
        'metal',
        'joints',
        'weaponGlow',
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
    test('diminished to toa mata seeds metal and joints defaults', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.ToaMata,
        sampleColors
      );
      expect(merged.metal).toBe(LegoColor.LightGray);
      expect(merged.joints).toBe(LegoColor.LightGray);
    });

    test('diminished to rebuilt keeps arm color from custom palette', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.Rebuilt,
        sampleColors
      );
      expect(merged.arms).toBe(sampleColors.arms);
      expect(merged.body).toBe(sampleColors.body);
    });

    test('no-op when stages match', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Rebuilt,
        MatoranStage.Rebuilt,
        sampleColors
      );
      expect(merged).toEqual(sampleColors);
    });
  });
});
