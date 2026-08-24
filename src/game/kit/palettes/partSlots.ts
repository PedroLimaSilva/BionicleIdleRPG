import type { BodyPartId, KitMaterialSlotEntry } from '../../../types/KitParts';
import { metalPbrForStyle, type MetalStyle } from './metalPbr';

/** Kit Main / Secondary / Metal / Face → that body part's dex palette. */
export function kitPartSlots(
  part: BodyPartId,
  metalStyle: MetalStyle = 'mata'
): Partial<Record<string, KitMaterialSlotEntry>> {
  const metalPbr = metalPbrForStyle(metalStyle);
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
  metalStyle: MetalStyle = 'nuva'
): KitMaterialSlotEntry {
  return {
    color: { kind: 'part', part, slot: 'metal' },
    ...metalPbrForStyle(metalStyle),
  };
}

export function kitPartMainAsMetal(
  part: BodyPartId,
  metalStyle: MetalStyle = 'nuva'
): KitMaterialSlotEntry {
  return {
    color: { kind: 'part', part, slot: 'main' },
    ...metalPbrForStyle(metalStyle),
  };
}
