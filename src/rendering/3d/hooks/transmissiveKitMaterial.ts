import { Color, DoubleSide, MeshPhysicalMaterial } from 'three';

/** Kit GLB `KHR_materials_ior` export (~1.45 glass / trans-plastic). */
export const TRANSMISSIVE_KIT_IOR = 1.45;

/** Brain gel — kit export transmission 0.35. */
export const TRANSMISSIVE_KIT_BRAIN_TRANSMISSION = 0.35;

/**
 * Vahki visor — dialed less clear than brain in-game (kit export is 0.75; we override).
 */
export const TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION = 0.15;

export const TRANSMISSIVE_KIT_BRAIN_ROUGHNESS = 0.2;
export const TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS = 0.3;

export const TRANSMISSIVE_KIT_THICKNESS = 0.25;

export type TransmissiveKitKind = 'brain' | 'vahkiHood';

const LEGACY_TRANSMISSIVE_NAMES: Record<string, TransmissiveKitKind> = {
  brain: 'brain',
  matabrain: 'brain',
  metrubrain: 'brain',
  matabrain_baked: 'brain',
  metrubrain_baked: 'brain',
  vahkihood: 'vahkiHood',
  vahkihood_baked: 'vahkiHood',
};

/**
 * Brains / Vahki visor use runtime transmission when the slot tints emissive (Bohrok
 * `Brain` is color-only and stays on the normal plastic path).
 */
export function resolveTransmissiveKitKind(
  materialName: string,
  spec: { emissive?: unknown } | undefined
): TransmissiveKitKind | undefined {
  if (!spec?.emissive) return undefined;
  return LEGACY_TRANSMISSIVE_NAMES[materialName.trim().toLowerCase()];
}

function presetForKind(kind: TransmissiveKitKind): {
  ior: number;
  transmission: number;
  roughness: number;
  thickness: number;
} {
  if (kind === 'brain') {
    return {
      ior: TRANSMISSIVE_KIT_IOR,
      transmission: TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
      roughness: TRANSMISSIVE_KIT_BRAIN_ROUGHNESS,
      thickness: TRANSMISSIVE_KIT_THICKNESS,
    };
  }
  return {
    ior: TRANSMISSIVE_KIT_IOR,
    transmission: TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
    roughness: TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS,
    thickness: TRANSMISSIVE_KIT_THICKNESS,
  };
}

/** Uniform transmissive plastic — no baked maps; avoids `alphaMode: BLEND` vs Kanohi masks. */
export function buildTransmissiveKitMaterial(
  materialName: string,
  kind: TransmissiveKitKind,
  color: string,
  emissiveColor: string,
  emissiveIntensity: number
): MeshPhysicalMaterial {
  const preset = presetForKind(kind);
  return new MeshPhysicalMaterial({
    color: new Color(color),
    emissive: new Color(emissiveColor),
    emissiveIntensity,
    ior: preset.ior,
    metalness: 0,
    name: materialName,
    opacity: 1,
    roughness: preset.roughness,
    side: DoubleSide,
    thickness: preset.thickness,
    transmission: preset.transmission,
    transparent: true,
  });
}
