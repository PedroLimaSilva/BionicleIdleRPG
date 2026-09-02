import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { TRANSMISSIVE_KIT_IOR, TRANSMISSIVE_KIT_THICKNESS } from './transmissiveKitMaterial';

type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

/** Mata Kaukau — overrides GLB opacity 0.5 for a less clear water mask. */
export const TRANSMISSIVE_MASK_KAUKAU_OPACITY = 0.85;

export const TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION = 0.15;

/** Great Rau — scales baked transmission; lower = less clear. */
export const TRANSMISSIVE_MASK_RAU_TRANSMISSION = 0.35;

export type TransmissiveMaskKind = 'kaukau' | 'rau';

function normalizeMaterialName(name: string): string {
  return name.trim().toLowerCase();
}

export function resolveTransmissiveMaskKind(
  mat: MaskStandardMat
): TransmissiveMaskKind | undefined {
  const name = normalizeMaterialName(mat.name);
  if (name.includes('rau_baked')) return 'rau';
  // Mata Kaukau ships at 0.5 opacity; Nuva Kaukau is opaque with vent holes only.
  if (name.includes('kaukau_baked') && mat.opacity < 0.999) return 'kaukau';
  return undefined;
}

function presetForKind(kind: TransmissiveMaskKind): {
  ior: number;
  opacity: number | undefined;
  transmission: number;
  thickness: number;
} {
  switch (kind) {
    case 'kaukau':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        opacity: TRANSMISSIVE_MASK_KAUKAU_OPACITY,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION,
      };
    case 'rau':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        opacity: undefined,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_MASK_RAU_TRANSMISSION,
      };
  }
}

function upgradeToPhysicalMaterial(mat: MaskStandardMat): MeshPhysicalMaterial {
  if (mat instanceof MeshPhysicalMaterial) return mat;
  const physical = new MeshPhysicalMaterial();
  physical.name = mat.name;
  physical.color.copy(mat.color);
  physical.emissive.copy(mat.emissive);
  physical.emissiveIntensity = mat.emissiveIntensity;
  physical.metalness = mat.metalness;
  physical.roughness = mat.roughness;
  physical.opacity = mat.opacity;
  physical.transparent = mat.transparent;
  physical.map = mat.map;
  physical.normalMap = mat.normalMap;
  physical.metalnessMap = mat.metalnessMap;
  physical.roughnessMap = mat.roughnessMap;
  physical.alphaMap = mat.alphaMap;
  physical.side = mat.side;
  physical.depthWrite = mat.depthWrite;
  physical.envMapIntensity = mat.envMapIntensity;
  return physical;
}

/**
 * Apply runtime transmission + IOR to translucent Kanohi (Kaukau, Great Rau).
 * Keeps GLB alpha and PBR maps intact; only overrides transmission scalars (and
 * Kaukau opacity) so the masks stay less clear than raw GLB defaults.
 */
export function applyTransmissiveMaskMaterial(
  mat: MaskStandardMat
): MeshPhysicalMaterial | undefined {
  const kind = resolveTransmissiveMaskKind(mat);
  if (!kind) return undefined;

  const preset = presetForKind(kind);
  const physical = upgradeToPhysicalMaterial(mat);

  physical.transmission = preset.transmission;
  physical.ior = preset.ior;
  physical.thickness = preset.thickness;
  if (preset.opacity !== undefined) {
    physical.opacity = preset.opacity;
  }
  physical.transparent = true;
  physical.depthWrite = false;
  physical.side = FrontSide;

  return physical;
}

export function isTransmissiveMaskMaterial(mat: unknown): boolean {
  return (
    mat instanceof MeshPhysicalMaterial &&
    mat.transmission > 0 &&
    resolveTransmissiveMaskKind(mat) !== undefined
  );
}
