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

export const DEFAULT_CUSTOM_COLORS: MatoranColors = {
  arms: { main: LegoColor.LightGray },
  body: { main: LegoColor.LightGray },
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: { main: LegoColor.LightGray },
  mask: LegoColor.LightGray,
};
