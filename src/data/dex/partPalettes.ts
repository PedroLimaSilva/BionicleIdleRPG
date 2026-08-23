import { LegoColor } from '../../types/Colors';
import type { BodyPartPalette, MatoranColors } from '../../types/Matoran';

export function partPalette(
  main: LegoColor,
  extra: Omit<BodyPartPalette, 'main'> = {}
): BodyPartPalette {
  return { main, ...extra };
}

/** Same slot colors on body, arms, feet, and legs (typical Mata / Nuva). */
export function uniformLimbPalettes(
  part: BodyPartPalette
): Pick<MatoranColors, 'arms' | 'body' | 'feet' | 'legs'> {
  return {
    arms: { ...part },
    body: { ...part },
    feet: { ...part },
    legs: { ...part },
  };
}

export function metruLimbPalettes(
  accent: LegoColor,
  extra: { glow?: LegoColor; metal?: LegoColor } = {}
): Pick<MatoranColors, 'arms' | 'legs'> {
  const limb = partPalette(LegoColor.DarkGray, {
    metal: extra.metal ?? LegoColor.LightGray,
    secondary: accent,
    ...(extra.glow ? { glow: extra.glow } : {}),
  });
  return { arms: { ...limb }, legs: { ...limb } };
}

export type FlatLimbColors = {
  arms: LegoColor;
  body: LegoColor;
  eyes: LegoColor;
  face: LegoColor;
  feet: LegoColor;
  mask: LegoColor;
};

/** Diminished / Rebuilt / Turaga / Bohrok: one Main color per limb. */
export function simpleLimbColors(colors: FlatLimbColors): MatoranColors {
  return {
    arms: partPalette(colors.arms),
    body: partPalette(colors.body),
    eyes: colors.eyes,
    face: colors.face,
    feet: partPalette(colors.feet),
    mask: colors.mask,
  };
}

/** Metru matoran: DarkGray structure on arms/legs, accent as Secondary. */
export function metruMatoranColors(colors: FlatLimbColors): MatoranColors {
  return {
    ...metruLimbPalettes(colors.arms),
    body: partPalette(colors.body, { metal: LegoColor.LightGray }),
    eyes: colors.eyes,
    face: colors.face,
    feet: partPalette(colors.feet, { metal: LegoColor.LightGray }),
    mask: colors.mask,
  };
}

export const DEFAULT_CUSTOM_COLORS: MatoranColors = simpleLimbColors({
  arms: LegoColor.LightGray,
  body: LegoColor.LightGray,
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: LegoColor.LightGray,
  mask: LegoColor.LightGray,
});
