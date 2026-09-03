import { Color, FrontSide, MeshPhysicalMaterial } from 'three';
import type { KitTransmissivePreset } from '../../../types/KitParts';
import type { KitMaterialSlotOverride } from '../../../types/KitParts';

/** Kit GLB `KHR_materials_ior` export (~1.45 glass / trans-plastic). */
export const TRANSMISSIVE_KIT_IOR = 1.45;

/** Toa / Metru brain gel (`MataBrain` / `MetruBrain` kit nodes) — kit transmission 0.35. */
export const TRANSMISSIVE_KIT_BRAIN_TRANSMISSION = 0.5;

/** McToran face brain — clearer than Toa brain gel. */
export const TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION = 1;

/**
 * Vahki visor — murkier than brain in-game (kit export is 0.75; we override down).
 */
export const TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION = 0.5;

export const TRANSMISSIVE_KIT_BRAIN_ROUGHNESS = 0.2;
export const TRANSMISSIVE_KIT_MCTORAN_FACE_ROUGHNESS = 0.15;
export const TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS = 0.3;

export const TRANSMISSIVE_KIT_THICKNESS = 0.15;

/** Draw transmissive kit gel before opaque head stalk + Kanohi masks. */
export const TRANSMISSIVE_KIT_RENDER_ORDER = -1;

export type TransmissiveKitKind = KitTransmissivePreset;

/**
 * Brains / Vahki visor use runtime transmission when the slot tints emissive (Bohrok
 * `Brain` is color-only and stays on the normal plastic path).
 */
export function resolveTransmissiveKitKind(
  _materialName: string,
  spec: KitMaterialSlotOverride | undefined
): TransmissiveKitKind | undefined {
  if (!spec?.emissive) return undefined;
  return spec.transmissive;
}

function presetForKind(kind: TransmissiveKitKind): {
  ior: number;
  transmission: number;
  roughness: number;
  thickness: number;
} {
  switch (kind) {
    case 'brain':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_KIT_BRAIN_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_KIT_BRAIN_TRANSMISSION,
      };
    case 'mctoranFace':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_KIT_MCTORAN_FACE_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION,
      };
    case 'vahkiHood':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION,
      };
  }
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
    depthWrite: false,
    emissive: new Color(emissiveColor),
    emissiveIntensity,
    ior: preset.ior,
    metalness: 0,
    name: materialName,
    opacity: 1,
    roughness: preset.roughness,
    side: FrontSide,
    thickness: preset.thickness,
    transmission: preset.transmission,
    transparent: true,
  });
}

export function isTransmissiveKitMaterial(mat: unknown): boolean {
  return mat instanceof MeshPhysicalMaterial && mat.transmission > 0;
}
