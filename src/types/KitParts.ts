import type { LegoColor } from './Colors';

/** Keys on `BaseMatoran.colors` used to tint kit materials at runtime */
export type MatoranPaletteKey = 'mask' | 'body' | 'feet' | 'arms' | 'eyes' | 'face';

/** How to resolve a hex color for a named material slot on a kit mesh */
export type KitMaterialColorSource =
  | { kind: 'lego'; value: LegoColor }
  | { kind: 'palette'; key: MatoranPaletteKey };

/**
 * Per-material overrides on a kit piece (key = kit material `.name`, matched case-insensitively).
 * Shorthand: a value that is only `KitMaterialColorSource` is treated as `{ color: … }`.
 */
export type KitMaterialSlotOverride = {
  color?: KitMaterialColorSource;
  roughness?: number;
  metalness?: number;
  /** Do not replace with weathered metal (use with glow / emissive parts). */
  skipWeatheredMetal?: boolean;
  /** Drive emissive from eye color for selective bloom (e.g. hook lenses). */
  emissiveFromEyes?: boolean;
  emissiveIntensity?: number;
};

export type KitMaterialSlotEntry = KitMaterialColorSource | KitMaterialSlotOverride;

/**
 * Kit piece for one socket. Use as `Record<socketName, KitSocketAttachment>` so
 * `attachments[socketName]` is O(1) when walking character nodes.
 * `kitNodeName` must match the object name in the kit GLB.
 */
export type KitSocketAttachment = {
  kitNodeName: string;
  /**
   * Map from kit **material** name (e.g. Main, Metal, Glow) to color and/or PBR overrides.
   * Omitted entries keep the kit GLB’s defaults for that slot.
   */
  materialColors?: Partial<Record<string, KitMaterialSlotEntry>>;
};
