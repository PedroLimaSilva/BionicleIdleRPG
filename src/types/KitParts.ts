import type { LegoColor } from './Colors';

/** Keys on `BaseMatoran.colors` used to tint kit materials at runtime */
export type MatoranPaletteKey = 'mask' | 'body' | 'feet' | 'arms' | 'eyes' | 'face';

/** How to resolve a hex color for a named material slot on a kit mesh */
export type KitMaterialColorSource =
  | { kind: 'lego'; value: LegoColor }
  | { kind: 'palette'; key: MatoranPaletteKey };

/**
 * One kit piece placed on a socket (empty) in the character GLB.
 * `socketName` must match the exported empty/object name on the rig.
 * `kitNodeName` must match the object name in the kit GLB.
 */
export type KitAttachmentSpec = {
  socketName: string;
  kitNodeName: string;
  /**
   * Map from kit **material** name (e.g. Main, Metal) to a color source.
   * Omitted entries keep the kit GLB’s default materials for that slot.
   */
  materialColors?: Partial<Record<string, KitMaterialColorSource>>;
};
