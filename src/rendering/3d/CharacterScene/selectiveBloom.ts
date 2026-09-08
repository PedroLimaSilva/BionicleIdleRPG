import { mrt, uniform } from 'three/tsl';
import type { KitTransmissivePreset } from '../../../types/KitParts';

/** Shared MRT mask written by kit materials that should bloom. */
const BLOOM_INTENSITY_ON = uniform(1);

export type SelectiveBloomMrtMaterial = {
  mrtNode?: unknown;
  name: string;
};

/**
 * Kit `Glow` (hooks, weapons, visor lines) blooms. `Glowing Eyes` stay emissive-only
 * so the face doesn't blow out behind the Kanohi. Rahkshi `Eyes` bloom on the sheet.
 */
export function isSelectiveBloomKitGlowName(name: string | undefined): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (lower.includes('glowing eyes')) return false;
  return lower.includes('glow');
}

/** Rahkshi GLB eye / kraata glow slots join the bloom MRT; Kanohi Glowing Eyes do not. */
export function isSelectiveBloomRahkshiEyeName(name: string | undefined): boolean {
  return isSelectiveBloomRahkshiGlowMaterial(name);
}

/** Rahkshi baked `Glow` (detailed rig) and battle `Battle_Bloom` on `Battle_Glow`. Legacy `Eyes` still matches. */
export function isSelectiveBloomRahkshiGlowMaterial(name: string | undefined): boolean {
  if (!name) return false;
  const lower = name.toLowerCase();
  if (lower.includes('glowing eyes')) return false;
  return lower === 'eyes' || lower === 'glow' || lower === 'battle_bloom';
}

/** Toa / Metru brain gel and Bohrok crystal brains bloom; colorless viewports and visors do not. */
export function shouldSelectiveBloomTransmissiveKind(
  kind: KitTransmissivePreset | undefined
): boolean {
  return kind === 'brain' || kind === 'crystal';
}

/** Marks a material so the character bloom MRT picks it up (Three.js selective-bloom pattern). */
export function applySelectiveBloomMrt(
  mat: SelectiveBloomMrtMaterial & { needsUpdate?: boolean }
): void {
  mat.mrtNode = mrt({ bloomIntensity: BLOOM_INTENSITY_ON });
  mat.needsUpdate = true;
}

/** Drops a material from the bloom MRT (mask power off, or a one-off selection). */
export function clearSelectiveBloomMrt(
  mat: SelectiveBloomMrtMaterial & { needsUpdate?: boolean }
): void {
  mat.mrtNode = undefined;
  mat.needsUpdate = true;
}
