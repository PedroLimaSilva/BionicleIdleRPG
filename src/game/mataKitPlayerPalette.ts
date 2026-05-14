import type { KitMaterialSlotEntry } from '../types/KitParts';

/**
 * Shared kit material slots for Mata (2001) builds that use `useKitAttachments`.
 * Maps kit "Main / Secondary / Metal" plastics to the custom character palette so
 * creation and in-game rendering stay consistent.
 */
export const MATA_KIT_PLAYER_PALETTE_PLASTICS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'body', kind: 'palette' },
  Metal: { key: 'feet', kind: 'palette' },
  Secondary: { key: 'arms', kind: 'palette' },
};

export const MATA_KIT_PLAYER_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: { color: { key: 'face', kind: 'palette' }, weathered: false },
};

/** Glow slots follow eye color from the character palette. */
export function mataKitPlayerPaletteGlow(
  glowingEyesIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { key: 'eyes', kind: 'palette' },
      emissiveIntensity: 4,
      weathered: false,
    },
    'Glowing Eyes': {
      emissive: { key: 'eyes', kind: 'palette' },
      emissiveIntensity: glowingEyesIntensity,
      weathered: false,
    },
  };
}
