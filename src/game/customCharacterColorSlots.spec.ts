import { LegoColor } from '../types/Colors';
import { MatoranStage } from '../types/Matoran';
import { simpleLimbColors } from '../data/dex/partPalettes';
import {
  getEditablePaletteKeysForStage,
  getEditableSlotsForTab,
  getOrderedEditableColorTabs,
  normalizeCustomCharacterColorsForStage,
  prefillColorsAfterEvolution,
} from './customCharacterColorSlots';

const sampleColors = simpleLimbColors({
  arms: LegoColor.Red,
  body: LegoColor.Blue,
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: LegoColor.Green,
  mask: LegoColor.Yellow,
});

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

    test('toa mata with kit rig exposes limb and weapon palettes', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Tahu');
      expect(s.has('arms')).toBe(true);
      expect(s.has('body')).toBe(true);
      expect(s.has('legs')).toBe(true);
      expect(s.has('weapon')).toBe(true);
      expect([...s]).not.toContain('metal');
    });

    test('toa nuva and metru expose legs and weapon, not flat metal/joints', () => {
      expect(getEditablePaletteKeysForStage(MatoranStage.ToaNuva).has('legs')).toBe(true);
      expect(getEditablePaletteKeysForStage(MatoranStage.Metru).has('weapon')).toBe(true);
      expect(getEditablePaletteKeysForStage(MatoranStage.ToaMetru).has('legs')).toBe(true);
      expect([...getEditablePaletteKeysForStage(MatoranStage.Metru)]).not.toContain('joints');
    });

    test('toa mata kopaka kit exposes full palette', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Kopaka');
      expect(s.has('feet')).toBe(true);
      expect(s.has('mask')).toBe(true);
      expect(s.has('weapon')).toBe(true);
    });

    test('toa mata onua kit exposes full palette', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMata, 'Toa_Onua');
      expect(s.has('arms')).toBe(true);
      expect(s.has('weapon')).toBe(true);
    });

    test('toa mata without build id defaults to mask and eyes', () => {
      expect([...getEditablePaletteKeysForStage(MatoranStage.ToaMata)].sort()).toEqual([
        'eyes',
        'mask',
      ]);
    });

    test('toa metru exposes full kit palette including weapon', () => {
      const s = getEditablePaletteKeysForStage(MatoranStage.ToaMetru);
      expect(s.has('arms')).toBe(true);
      expect(s.has('weapon')).toBe(true);
      expect(s.has('legs')).toBe(true);
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

    test('toa mata kit build includes legs and weapon tabs', () => {
      expect(getOrderedEditableColorTabs(MatoranStage.ToaMata, 'Toa_Gali')).toEqual([
        'mask',
        'body',
        'arms',
        'legs',
        'feet',
        'weapon',
        'eyes',
        'face',
      ]);
    });
  });

  describe('getEditableSlotsForTab', () => {
    test('diminished body parts only expose Main', () => {
      expect(getEditableSlotsForTab(MatoranStage.Diminished, 'body')).toEqual(['main']);
      expect(getEditableSlotsForTab(MatoranStage.Diminished, 'mask')).toEqual([]);
    });

    test('toa body parts expose the four kit slots', () => {
      expect(getEditableSlotsForTab(MatoranStage.ToaNuva, 'arms')).toEqual([
        'main',
        'secondary',
        'metal',
        'glow',
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

    test('expands a legacy flat custom', () => {
      const c = normalizeCustomCharacterColorsForStage(MatoranStage.Diminished, {
        arms: LegoColor.Red,
        body: LegoColor.Blue,
        eyes: LegoColor.TransNeonOrange,
        face: LegoColor.DarkGray,
        feet: LegoColor.Green,
        mask: LegoColor.Yellow,
      });
      expect(c.body).toEqual({ main: LegoColor.Blue });
      expect(c.arms).toEqual({ main: LegoColor.Red });
    });
  });

  describe('prefillColorsAfterEvolution', () => {
    test('diminished to toa mata seeds per-part kit slots', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.ToaMata,
        sampleColors
      );
      expect(merged.body.main).toBe(LegoColor.Blue);
      expect(merged.body.secondary).toBe(LegoColor.Red);
      expect(merged.body.metal).toBe(LegoColor.LightGray);
      expect(merged.body.glow).toBe(LegoColor.TransNeonOrange);
      expect(merged.arms).toEqual(merged.body);
      expect(merged.weapon?.glow).toBe(LegoColor.TransNeonOrange);
    });

    test('diminished to metru puts joints on limb Main', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.Metru,
        sampleColors
      );
      expect(merged.arms.main).toBe(LegoColor.DarkGray);
      expect(merged.arms.secondary).toBe(LegoColor.Red);
      expect(merged.body.main).toBe(LegoColor.Blue);
    });

    test('diminished to rebuilt keeps arm color from custom palette', () => {
      const merged = prefillColorsAfterEvolution(
        MatoranStage.Diminished,
        MatoranStage.Rebuilt,
        sampleColors
      );
      expect(merged.arms.main).toBe(sampleColors.arms.main);
      expect(merged.body.main).toBe(sampleColors.body.main);
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
