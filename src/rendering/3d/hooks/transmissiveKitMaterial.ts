import { Color, FrontSide, MeshPhysicalMaterial } from 'three';
import { float } from 'three/tsl';
import type { KitTransmissivePreset } from '../../../types/KitParts';
import type { KitMaterialSlotOverride } from '../../../types/KitParts';
import {
  applySelectiveBloomMrt,
  shouldSelectiveBloomTransmissiveKind,
} from '../CharacterScene/selectiveBloom';

/** Kit GLB `KHR_materials_ior` export (~1.45 glass / trans-plastic). */
export const TRANSMISSIVE_KIT_IOR = 1.45;

/** Toa / Metru brain gel (`MataBrain` / `MetruBrain` kit nodes) — kit transmission 0.35. */
export const TRANSMISSIVE_KIT_BRAIN_TRANSMISSION = 0.5;

/** Bohrok eye shell — optically clear crystal, not murky gel. */
export const TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION = 1;

/**
 * Swarm faceplate viewport — trans-clear plastic, not optically perfect.
 * Full crystal transmission disappears head-on against the dark card.
 */
export const TRANSMISSIVE_KIT_CLEAR_TRANSMISSION = 0.8;

/** McToran face brain — clearer than Toa brain gel. */
export const TRANSMISSIVE_KIT_MCTORAN_FACE_TRANSMISSION = 1;

/**
 * Vahki visor — murkier than brain in-game (kit export is 0.75; we override down).
 */
export const TRANSMISSIVE_KIT_VAHKI_HOOD_TRANSMISSION = 0.5;

export const TRANSMISSIVE_KIT_BRAIN_ROUGHNESS = 0.2;
export const TRANSMISSIVE_KIT_CRYSTAL_ROUGHNESS = 0.05;
export const TRANSMISSIVE_KIT_CLEAR_ROUGHNESS = 0.22;
export const TRANSMISSIVE_KIT_MCTORAN_FACE_ROUGHNESS = 0.15;
export const TRANSMISSIVE_KIT_VAHKI_HOOD_ROUGHNESS = 0.3;

export const TRANSMISSIVE_KIT_THICKNESS = 0.15;

/** Draw transmissive kit gel after Kanohi so in-front gel wins depth over mask back-faces. */
export const TRANSMISSIVE_KIT_RENDER_ORDER = 11;

export type TransmissiveKitKind = KitTransmissivePreset;

/** Runtime transmission when the slot sets an explicit preset (emissive is optional). */
export function resolveTransmissiveKitKind(
  _materialName: string,
  spec: KitMaterialSlotOverride | undefined
): TransmissiveKitKind | undefined {
  return spec?.transmissive;
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
    case 'clear':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_KIT_CLEAR_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_KIT_CLEAR_TRANSMISSION,
      };
    case 'crystal':
      return {
        ior: TRANSMISSIVE_KIT_IOR,
        roughness: TRANSMISSIVE_KIT_CRYSTAL_ROUGHNESS,
        thickness: TRANSMISSIVE_KIT_THICKNESS,
        transmission: TRANSMISSIVE_KIT_CRYSTAL_TRANSMISSION,
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

/** Uniform transmissive plastic — transmissive pass; draws after Kanohi with depthWrite. */
export function buildTransmissiveKitMaterial(
  materialName: string,
  kind: TransmissiveKitKind,
  color: string,
  emissiveColor: string,
  emissiveIntensity: number
): MeshPhysicalMaterial {
  const preset = presetForKind(kind);
  const mat = new MeshPhysicalMaterial({
    color: new Color(color),
    depthWrite: true,
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
    transparent: false,
  });
  // WebGPU MeshPhysicalNodeMaterial.useTransmission also keys off this node.
  (mat as MeshPhysicalMaterial & { transmissionNode?: unknown }).transmissionNode = float(
    preset.transmission
  );
  if (shouldSelectiveBloomTransmissiveKind(kind)) {
    applySelectiveBloomMrt(mat);
  }
  return mat;
}

export function isTransmissiveKitMaterial(mat: unknown): boolean {
  return mat instanceof MeshPhysicalMaterial && mat.transmission > 0;
}
