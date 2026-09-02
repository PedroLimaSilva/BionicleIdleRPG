import { FrontSide, MeshPhysicalMaterial, MeshStandardMaterial } from 'three';
import { TRANSMISSIVE_KIT_IOR, TRANSMISSIVE_KIT_THICKNESS } from './transmissiveKitMaterial';

type MaskStandardMat = MeshPhysicalMaterial | MeshStandardMaterial;

/** Mata Kaukau — semi-transparent water mask; pairs with GLB opacity 0.5. */
export const TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION = 0.5;

/** Great Rau — matches `KHR_materials_transmission.transmissionFactor` in `Toa_Metru/Masks.glb`. */
export const TRANSMISSIVE_MASK_RAU_TRANSMISSION = 1;

export const TRANSMISSIVE_MASK_ROUGHNESS = 0.2;

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
  transmission: number;
  roughness: number;
  thickness: number;
} {
  switch (kind) {
    case 'kaukau':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_MASK_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_MASK_KAUKAU_TRANSMISSION,
      };
    case 'rau':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_MASK_ROUGHNESS,
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
 * Keeps existing alpha / PBR maps; drops baked transmission maps in favor of scalars
 * (same approach as transmissive kit gel).
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
  physical.roughness = preset.roughness;
  physical.transmissionMap = null;
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
