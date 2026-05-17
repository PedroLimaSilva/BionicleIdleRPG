import type { LegoColor } from './Colors';

/** Keys on `BaseMatoran.colors` used to tint kit materials at runtime */
export type MatoranPaletteKey = 'mask' | 'body' | 'feet' | 'arms' | 'eyes' | 'face' | 'weaponGlow';

/** How to resolve a hex color for a named material slot on a kit mesh */
export type KitMaterialColorSource =
  | { kind: 'lego'; value: LegoColor }
  | { kind: 'palette'; key: MatoranPaletteKey };

/**
 * Optional per-slot fields merged into the character's weathered-metal shader when
 * that slot participates in the pass (`useKitAttachments` + `weathered` on the model).
 * Omitted keys keep the character-level `WeatheredMetalOptions` defaults.
 */
export type KitMaterialWeatheredTuning = {
  grimeDarken?: number;
  grimeRoughness?: number;
  grimeMetalnessReduce?: number;
  largeScale?: number;
  fineScale?: number;
  cavityStrength?: number;
  edgeColor?: string;
  edgeStrength?: number;
  edgeCurvatureScale?: number;
  envMapIntensity?: number;
};

/** Keys merged from `KitMaterialSlotOverride` into weathered-metal options (see hook). */
export const KIT_MATERIAL_WEATHERED_OPTION_KEYS: readonly (keyof KitMaterialWeatheredTuning)[] = [
  'grimeDarken',
  'grimeRoughness',
  'grimeMetalnessReduce',
  'largeScale',
  'fineScale',
  'cavityStrength',
  'edgeColor',
  'edgeStrength',
  'edgeCurvatureScale',
  'envMapIntensity',
];

/**
 * Per-material overrides on a kit piece (key = kit material `.name`, matched case-insensitively).
 * Shorthand: a value that is only `KitMaterialColorSource` is treated as `{ color: … }`.
 */
export type KitMaterialSlotOverride = {
  color?: KitMaterialColorSource;
  roughness?: number;
  metalness?: number;
  /** Emissive color from config (Lego or palette); pair with `emissiveIntensity` for bloom. */
  emissive?: KitMaterialColorSource;
  /** Emissive strength; when unset but `emissive` is set, keeps the cloned GLB intensity if > 0, else 1. */
  emissiveIntensity?: number;
  /**
   * Opt this slot in/out of the character's weathered-metal pass.
   * Defaults: `false` when `emissive` is set or the material name contains `glow`
   * (case-insensitive); otherwise `true`. Set explicitly for non-glow slots that
   * shouldn't be weathered (e.g. translucent brain plastic).
   */
  weathered?: boolean;
} & KitMaterialWeatheredTuning;

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
