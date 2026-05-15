import type { KitMaterialSlotEntry } from '../types/KitParts';
import { LegoColor } from '../types/Colors';

/**
 * Default kit tinting for Mata (2001) rigs using `useKitAttachments`.
 *
 * **Where colors come from**
 * - Per-character hex values: `BaseMatoran.colors` in `src/types/Matoran.ts` (dex entries,
 *   `customCharacters`, and the character-creation preview).
 * - How they reach meshes: each `*MataKitAttach.ts` maps character sockets → kit GLB nodes and
 *   passes `materialColors` (usually built from the exports below). `useKitAttachments`
 *   (`src/hooks/useKitAttachments.ts`) walks each kit mesh, matches **material `.name`** to those
 *   keys (case-insensitive), and resolves `kind: 'palette'` with `resolveColorSource` →
 *   `palette[key]` from that character’s `colors` (optional `weaponGlow` falls back to
 *   `LegoColor.TransNeonYellow` when unset).
 */
export const MATA_KIT_PLAYER_PALETTE_PLASTICS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'body', kind: 'palette' },
  /** Technic pins / flat silver: fixed LEGO light gray (set dress), not a palette slot. */
  Metal: { kind: 'lego', value: LegoColor.LightGray },
  Secondary: { key: 'arms', kind: 'palette' },
};

export const MATA_KIT_PLAYER_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: { color: { key: 'face', kind: 'palette' }, weathered: false },
};

/** Face / head kit glow (e.g. Tahu flame); follows eye color. */
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

/** Weapon / tool emissive accents (e.g. Gali hooks); uses optional `colors.weaponGlow`. */
export function mataKitPlayerPaletteWeaponGlow(
  emissiveIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { key: 'weaponGlow', kind: 'palette' },
      emissiveIntensity,
      weathered: false,
    },
  };
}
