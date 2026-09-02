import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import { KIT_PALETTE_BRAIN } from './brainKitPalette';
import { kitPartSlots } from './partSlots';

/**
 * Default kit tinting for Mata (2001) rigs using `useKitAttachments`.
 *
 * Each socket picks a **body-part palette** from the dex (`body`, `arms`, `legs`,
 * `feet`, `weapon`). Kit material names then map 1:1:
 * Main → part.main, Secondary → part.secondary, Metal → part.metal, Glow → part.glow.
 */
export const MATA_KIT_PLAYER_PALETTE_PLASTICS: Partial<Record<string, KitMaterialSlotEntry>> =
  kitPartSlots('body', 'mata');

/** Transmissive Mata / Metru brains — `Brain` material slot (see `brainKitPalette`). */
export const MATA_KIT_PLAYER_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> =
  KIT_PALETTE_BRAIN;

/** Face / head kit glow (e.g. Tahu flame); follows the body glow slot (eyes fallback). */
export function mataKitPlayerPaletteGlow(
  glowingEyesIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { kind: 'part', part: 'body', slot: 'glow' },
      emissiveIntensity: glowingEyesIntensity,
      weathered: false,
    },
    'Glowing Eyes': {
      emissive: { key: 'eyes', kind: 'palette' },
      emissiveIntensity: glowingEyesIntensity,
      weathered: false,
    },
  };
}

/** Weapon / tool emissive accents (e.g. Gali hooks); uses `colors.weapon.glow`. */
export function mataKitPlayerPaletteWeaponGlow(
  emissiveIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { kind: 'part', part: 'weapon', slot: 'glow' },
      emissiveIntensity,
      weathered: false,
    },
  };
}
