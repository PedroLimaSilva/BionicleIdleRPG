import type { LegoColor } from './Colors';

/** Keys on `BaseMatoran.colors` used to tint kit materials at runtime */
export type MatoranPaletteKey = 'mask' | 'body' | 'feet' | 'arms' | 'eyes' | 'face';

/** How to resolve a hex color for a named material slot on a kit mesh */
export type KitMaterialColorSource =
  | { kind: 'lego'; value: LegoColor }
  | { kind: 'palette'; key: MatoranPaletteKey };

/**
 * Kit piece for one socket. Use as `Record<socketName, KitSocketAttachment>` so
 * `attachments[socketName]` is O(1) when walking character nodes.
 * `kitNodeName` must match the object name in the kit GLB.
 */
export type KitSocketAttachment = {
  kitNodeName: string;
  /**
   * Map from kit **material** name (e.g. Main, Metal) to a color source.
   * Omitted entries keep the kit GLB’s default materials for that slot.
   */
  materialColors?: Partial<Record<string, KitMaterialColorSource>>;
};
