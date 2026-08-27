import { LegoColor } from '../../types/Colors';
import { ElementTribe, Mask, MatoranStage, MatoranTag } from '../../types/Matoran';
import {
  expandToKitStage,
  getBodyPartSlotColor,
  isBodyPartPalette,
  migrateCustomCharacters,
  normalizeMatoranColors,
  parseMatoranColors,
  partPalette,
  uniformLimbPalettes,
} from './matoranColors';

describe('matoranColors', () => {
  test('legacy diminished customs expand each limb to main only', () => {
    const next = normalizeMatoranColors(
      {
        arms: LegoColor.Red,
        body: LegoColor.Blue,
        eyes: LegoColor.TransNeonOrange,
        face: LegoColor.DarkGray,
        feet: LegoColor.Green,
        mask: LegoColor.Yellow,
      },
      MatoranStage.Diminished
    );
    expect(next.body).toEqual({ main: LegoColor.Blue });
    expect(next.arms).toEqual({ main: LegoColor.Red });
    expect(next.feet).toEqual({ main: LegoColor.Green });
    expect(next.mask).toBe(LegoColor.Yellow);
  });

  test('legacy Toa customs copy body/arms into every part slot (Mata look)', () => {
    const next = normalizeMatoranColors(
      {
        arms: LegoColor.Orange,
        body: LegoColor.Red,
        eyes: LegoColor.TransNeonRed,
        face: LegoColor.LightGray,
        feet: LegoColor.Red,
        mask: LegoColor.Red,
        weaponGlow: LegoColor.Orange,
      },
      MatoranStage.ToaMata
    );
    expect(next.body).toEqual({
      glow: LegoColor.TransNeonRed,
      main: LegoColor.Red,
      metal: LegoColor.LightGray,
      secondary: LegoColor.Orange,
    });
    expect(next.arms).toEqual(next.body);
    expect(next.weapon?.glow).toBe(LegoColor.Orange);
  });

  test('legacy Metru customs put joints on limb Main and arms on Secondary', () => {
    const next = normalizeMatoranColors(
      {
        arms: LegoColor.Orange,
        body: LegoColor.Red,
        eyes: LegoColor.TransNeonRed,
        face: LegoColor.LightGray,
        feet: LegoColor.Red,
        joints: LegoColor.DarkGray,
        mask: LegoColor.Red,
        metal: LegoColor.LightGray,
      },
      MatoranStage.Metru
    );
    expect(next.body.main).toBe(LegoColor.Red);
    expect(next.arms).toEqual({
      main: LegoColor.DarkGray,
      metal: LegoColor.LightGray,
      secondary: LegoColor.Orange,
    });
    expect(next.legs).toEqual(next.arms);
    expect(next.feet.main).toBe(LegoColor.Red);
  });

  test('already-normalized palettes pass through', () => {
    const colors = {
      arms: partPalette(LegoColor.Orange),
      body: partPalette(LegoColor.Red, { metal: LegoColor.FlatDarkGold }),
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.White,
      feet: partPalette(LegoColor.White),
      mask: LegoColor.FlatDarkGold,
    };
    expect(isBodyPartPalette(colors.body)).toBe(true);
    const next = normalizeMatoranColors(colors, MatoranStage.ToaNuva);
    expect(next.body.metal).toBe(LegoColor.FlatDarkGold);
    expect(next.arms.main).toBe(LegoColor.Orange);
  });

  test('slot fallbacks: secondary→main, metal→LightGray, glow→eyes', () => {
    const colors = normalizeMatoranColors(
      {
        arms: LegoColor.Tan,
        body: LegoColor.Brown,
        eyes: LegoColor.TransNeonOrange,
        face: LegoColor.DarkGray,
        feet: LegoColor.Brown,
        mask: LegoColor.Brown,
      },
      MatoranStage.Diminished
    );
    expect(getBodyPartSlotColor(colors, 'body', 'main')).toBe(LegoColor.Brown);
    expect(getBodyPartSlotColor(colors, 'body', 'secondary')).toBe(LegoColor.Brown);
    expect(getBodyPartSlotColor(colors, 'body', 'metal')).toBe(LegoColor.LightGray);
    expect(getBodyPartSlotColor(colors, 'body', 'glow')).toBe(LegoColor.TransNeonOrange);
    expect(getBodyPartSlotColor(colors, 'legs', 'main')).toBe(LegoColor.Brown);
  });

  test('expandToKitStage copies the Mata look onto every limb', () => {
    const colors = normalizeMatoranColors(
      {
        arms: LegoColor.Orange,
        body: LegoColor.Red,
        eyes: LegoColor.TransNeonRed,
        face: LegoColor.LightGray,
        feet: LegoColor.Yellow,
        mask: LegoColor.Red,
      },
      MatoranStage.Diminished
    );
    const next = expandToKitStage(colors, MatoranStage.ToaNuva);
    expect(next.arms).toEqual(next.body);
    expect(next.body.secondary).toBe(LegoColor.Orange);
    expect(next.feet.main).toBe(LegoColor.Red);
  });

  test('parseMatoranColors rejects incomplete palettes', () => {
    expect(
      parseMatoranColors({ body: LegoColor.Red, mask: LegoColor.Red }, MatoranStage.Diminished)
    ).toBeNull();
  });

  test('migrateCustomCharacters expands flat saves and drops leftover kitSlotMap', () => {
    const [next] = migrateCustomCharacters([
      {
        colors: {
          arms: LegoColor.Orange,
          body: LegoColor.Red,
          eyes: LegoColor.TransNeonRed,
          face: LegoColor.LightGray,
          feet: LegoColor.Red,
          mask: LegoColor.Red,
          weaponGlow: LegoColor.Orange,
        },
        element: ElementTribe.Fire,
        id: 'custom_0',
        kitSlotMap: { arms: { Main: 'joints' } },
        mask: Mask.Hau,
        name: 'Legacy',
        stage: MatoranStage.ToaMata,
        tags: [MatoranTag.Custom],
      },
    ]);
    expect(next.colors.body).toEqual({
      glow: LegoColor.TransNeonRed,
      main: LegoColor.Red,
      metal: LegoColor.LightGray,
      secondary: LegoColor.Orange,
    });
    expect(next.colors.weapon?.glow).toBe(LegoColor.Orange);
    expect(next).not.toHaveProperty('kitSlotMap');
    expect(next.colors).not.toHaveProperty('weaponGlow');
  });

  test('migrateCustomCharacters drops invalid customs and keeps already-new palettes', () => {
    const kept = {
      colors: {
        arms: { main: LegoColor.Blue },
        body: { main: LegoColor.Blue },
        eyes: LegoColor.TransNeonOrange,
        face: LegoColor.DarkGray,
        feet: { main: LegoColor.Yellow },
        mask: LegoColor.Blue,
      },
      element: ElementTribe.Water,
      id: 'custom_1',
      mask: Mask.Kaukau,
      name: 'Pridak',
      stage: MatoranStage.Diminished,
    };
    const next = migrateCustomCharacters([
      { id: 'Jala', name: 'Not custom' },
      { colors: { mask: LegoColor.Red }, id: 'custom_0', name: 'Broken' },
      kept,
    ]);
    expect(next).toHaveLength(1);
    expect(next[0].id).toBe('custom_1');
    expect(next[0].colors.body).toEqual({ main: LegoColor.Blue });
  });

  test('uniformLimbPalettes copies the same slots onto each limb', () => {
    const part = partPalette(LegoColor.White, {
      metal: LegoColor.FlatDarkGold,
      secondary: LegoColor.White,
    });
    const limbs = uniformLimbPalettes(part);
    expect(limbs.arms).toEqual(part);
    expect(limbs.legs).toEqual(part);
    expect(limbs.arms).not.toBe(part);
  });
});
