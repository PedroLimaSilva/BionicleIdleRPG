import type { BodyPartId, KitMaterialSlotEntry } from '../../../types/KitParts';

const MATA_METAL_PBR = {
  envMapIntensity: 0.52,
  fineScale: 26,
  grimeMetalnessReduce: 0.52,
  grimeRoughness: 0.22,
  metalness: 0.88,
  roughness: 0.32,
};

const NUVA_METAL_PBR = {
  envMapIntensity: 0.9,
  fineScale: 22,
  grimeDarken: 0.15,
  grimeMetalnessReduce: 0.25,
  grimeRoughness: 0.12,
  metalness: 0.95,
  roughness: 0.18,
  weathered: true as const,
};

/** Kit Main / Secondary / Metal / Face → that body part's dex palette. */
export function kitPartSlots(
  part: BodyPartId,
  metalStyle: 'mata' | 'nuva' = 'mata'
): Partial<Record<string, KitMaterialSlotEntry>> {
  const metalPbr = metalStyle === 'nuva' ? NUVA_METAL_PBR : MATA_METAL_PBR;
  return {
    Face: { color: { key: 'face', kind: 'palette' }, weathered: true },
    Main: { kind: 'part', part, slot: 'main' },
    Metal: {
      color: { kind: 'part', part, slot: 'metal' },
      ...metalPbr,
    },
    Secondary: { kind: 'part', part, slot: 'secondary' },
  };
}

/** Emissive Glow / Glowing Eyes for sockets that actually have those materials. */
export function kitPartGlow(
  part: BodyPartId,
  glowIntensity = 50
): Partial<Record<string, KitMaterialSlotEntry>> {
  return {
    Glow: {
      emissive: { kind: 'part', part, slot: 'glow' },
      emissiveIntensity: glowIntensity,
      weathered: false,
    },
    'Glowing Eyes': {
      emissive: { key: 'eyes', kind: 'palette' },
      emissiveIntensity: glowIntensity,
      weathered: false,
    },
  };
}

export function kitPartMetal(
  part: BodyPartId,
  metalStyle: 'mata' | 'nuva' = 'nuva'
): KitMaterialSlotEntry {
  const metalPbr = metalStyle === 'nuva' ? NUVA_METAL_PBR : MATA_METAL_PBR;
  return {
    color: { kind: 'part', part, slot: 'metal' },
    ...metalPbr,
  };
}

export function kitPartMainAsMetal(
  part: BodyPartId,
  metalStyle: 'mata' | 'nuva' = 'nuva'
): KitMaterialSlotEntry {
  const metalPbr = metalStyle === 'nuva' ? NUVA_METAL_PBR : MATA_METAL_PBR;
  return {
    color: { kind: 'part', part, slot: 'main' },
    ...metalPbr,
  };
}
