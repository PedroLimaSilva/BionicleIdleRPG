import { Color, DoubleSide, MeshPhysicalMaterial } from 'three';

/** Matches kit GLB `KHR_materials_ior` — glass / trans-neon plastic. */
export const TRANSMISSIVE_KIT_IOR = 1.45;

/** Full transmission; spatial masks were uniform in bakes so we use a scalar. */
export const TRANSMISSIVE_KIT_TRANSMISSION = 1;

/** Slight haze on the gel / visor (baked roughness maps were flat). */
export const TRANSMISSIVE_KIT_ROUGHNESS = 0.35;

/** Thin shell — reads as clear gel without a thickness map. */
export const TRANSMISSIVE_KIT_THICKNESS = 0.25;

const TRANSMISSIVE_KIT_MATERIAL_NAMES = new Set([
  'matabrain_baked',
  'metrubrain_baked',
  'metrubrain',
  'vahkihood_baked',
]);

export function isTransmissiveKitMaterialName(name: string): boolean {
  return TRANSMISSIVE_KIT_MATERIAL_NAMES.has(name.trim().toLowerCase());
}

/**
 * Uniform transmissive plastic (brains, Vahki visor): no baked maps — transmission
 * + IOR handle see-through without `alphaMode: BLEND` fighting Kanohi masks.
 */
export function buildTransmissiveKitMaterial(
  materialName: string,
  color: string,
  emissiveColor: string,
  emissiveIntensity: number
): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color(color),
    emissive: new Color(emissiveColor),
    emissiveIntensity,
    ior: TRANSMISSIVE_KIT_IOR,
    metalness: 0,
    name: materialName,
    opacity: 1,
    roughness: TRANSMISSIVE_KIT_ROUGHNESS,
    side: DoubleSide,
    thickness: TRANSMISSIVE_KIT_THICKNESS,
    transmission: TRANSMISSIVE_KIT_TRANSMISSION,
    transparent: true,
  });
}
