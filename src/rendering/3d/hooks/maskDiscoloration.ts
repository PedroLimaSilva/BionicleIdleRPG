import type { Object3D } from 'three';
import type { MaskStandardMat } from './maskMaterial';

/** Vertical crown tint for Metru double-injected Kanohi — unused on the flat-material branch. */
export type MaskDiscoloration = {
  color: string;
  /** Blend toward `color` at the top of the mask (0 = none, 1 = full at crown). */
  intensity: number;
  /** PBR metalness at the crown. */
  metalness?: number;
  /** PBR roughness at the crown. */
  roughness?: number;
};

/** Kept for call-site compatibility; mask-power glow is disabled. */
export const MASK_POWER_EMISSIVE_INTENSITY = 0;

/** No-op: this branch does not sample baked discoloration maps. */
export function setupMaskDiscolorationShader(_root: Object3D, _baseColor = '#ffffff'): void {}

/** No-op: mask-power glow and emissive are disabled. */
export function applyMaskPowerEmissive(
  mat: MaskStandardMat,
  _colorHex: string,
  _active: boolean | undefined
): void {
  if (!mat.emissive) return;
  mat.emissive.set(0x000000);
  mat.emissiveIntensity = 0;
}

/** No-op: crown / bake discoloration uniforms are not installed. */
export function applyMaskDiscolorationUniforms(
  _mat: MaskStandardMat,
  _discoloration: MaskDiscoloration | undefined,
  _baseColor?: string
): void {}

export function applyMaskDiscolorationToObject(
  _root: Object3D,
  _discoloration: MaskDiscoloration | undefined,
  _baseColor?: string
): void {}
