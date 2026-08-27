import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import { LegoColor } from '../../../../types/Colors';
import {
  MATORAN_KIT_PALETTE_ARMS,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_METAL,
} from './matoranKitPlayerPalette';
import { mataKitPlayerPaletteGlow } from './mataKitPlayerPalette';

export const BOHROK_KIT_PALETTE_BODY = MATORAN_KIT_PALETTE_BODY;
export const BOHROK_KIT_PALETTE_ARMS = MATORAN_KIT_PALETTE_ARMS;
export const BOHROK_KIT_PALETTE_FEET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: {
    color: { kind: 'part', part: 'feet', slot: 'main' },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
  Metal: {
    color: { kind: 'part', part: 'feet', slot: 'main' },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};
export const BOHROK_KIT_PALETTE_METAL = MATORAN_KIT_PALETTE_METAL;

/** Bohrok socket colors: Black in swarm, Light Gray in Kal. */
export const BOHROK_KIT_PALETTE_SOCKETS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: {
    color: { key: 'mask', kind: 'palette' },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};

export const BOHROK_KIT_PALETTE_EYE: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...mataKitPlayerPaletteGlow(50),
  Brain: { color: { key: 'eyes', kind: 'palette' }, weathered: false },
};

export const BOHROK_KIT_PALETTE_TEETH: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.White },
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};

/** Swarm faceplate: colored shell, clear viewport unchanged. */
export const BOHROK_SWARM_FACEPLATE_PALETTE: Partial<Record<string, KitMaterialSlotEntry>> = {
  CLEAR: { weathered: false },
  Clear: { weathered: false },
  Main: { kind: 'part', part: 'body', slot: 'main' },
};

/** Bohrok-Kal faceplate: silver shell and viewport. */
export const BOHROK_KAL_FACEPLATE_PALETTE: Partial<Record<string, KitMaterialSlotEntry>> = {
  CLEAR: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
  Main: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};

export const BOHROK_PRIMARY_PALETTE: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'body', slot: 'main' },
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};

export const BOHROK_SHIELD_KAL_PALETTE: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
  Metal: {
    color: { kind: 'lego', value: LegoColor.LightGray },
    envMapIntensity: 0.52,
    fineScale: 26,
    grimeMetalnessReduce: 0.5,
    grimeRoughness: 0.2,
    metalness: 0.9,
    roughness: 0.3,
  },
};
