import type { KitMaterialSlotEntry, MatoranPaletteKey } from '../../../types/KitParts';
import { LegoColor } from '../../../types/Colors';

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
 *   `LegoColor.TransNeonYellow` when unset). Slots may also set `metalness`, `roughness`, and
 *   `KitMaterialWeatheredTuning` fields so kit metal reads correctly under the Mata weathered pass.
 */
export const MATA_KIT_PLAYER_PALETTE_PLASTICS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { key: 'body', kind: 'palette' },
  /**
   * Technic silver (light gray): not a palette color slot — override character-level
   * weathered defaults (Mata bodies use very low metalness) so pins/gears read as metal.
   */
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.52,
    grimeRoughness: 0.22,
    metalness: 0.88,
    roughness: 0.32,
  },
  Secondary: { key: 'arms', kind: 'palette' },
};

export const MATA_KIT_PLAYER_PALETTE_BRAIN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Brain: { color: { key: 'eyes', kind: 'palette' }, weathered: false },
};

/** Face / head kit glow (e.g. Tahu flame); follows eye color. */
export function mataKitPlayerPaletteGlow(
  glowingEyesIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { key: 'eyes', kind: 'palette' },
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

/** Weapon / tool emissive accents (e.g. Gali hooks); uses optional `colors.weaponGlow`. */
export function mataKitPlayerPaletteWeaponGlow(
  emissiveIntensity = 50,
  colorKey: MatoranPaletteKey = 'weaponGlow'
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { key: colorKey, kind: 'palette' },
      emissiveIntensity,
      weathered: false,
    },
  };
}
