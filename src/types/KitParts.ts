import type { LegoColor } from './Colors';
import { BaseMatoran } from './Matoran';

/** Keys on `BaseMatoran.colors` used to tint kit materials at runtime */
export type MatoranPaletteKey = keyof BaseMatoran['colors'];

/** Kit mesh material names the player can rebind to palette keys. */
export const KIT_PLAYER_SLOTS = ['Main', 'Secondary', 'Metal', 'Glow'] as const;
export type KitPlayerSlot = (typeof KIT_PLAYER_SLOTS)[number];

/** Body regions that can have independent Main/Secondary/Metal/Glow bindings. */
export const KIT_COLOR_REGIONS = ['torso', 'arms', 'legs', 'feet', 'head', 'weapon'] as const;
export type KitColorRegion = (typeof KIT_COLOR_REGIONS)[number];

/** Which palette key fills each remappable kit slot on one body region. */
export type KitSlotBindings = Partial<Record<KitPlayerSlot, MatoranPaletteKey>>;

/**
 * Per-region overrides of kit slot → palette key. Missing regions/slots keep the
 * attachment's authored mapping (required for existing custom characters).
 */
export type CharacterKitSlotMap = Partial<Record<KitColorRegion, KitSlotBindings>>;

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
 * `kitNodeName` must match the object name in the kit GLB — use `KIT_2001_NODES` /
 * `KIT_2003_NODES` constants rather than raw strings.
 */
export type KitSocketAttachment<TKitNodeName extends string = string> = {
  kitNodeName: TKitNodeName;
  /**
   * Map from kit **material** name (e.g. Main, Metal, Glow) to color and/or PBR overrides.
   * Omitted entries keep the kit GLB’s defaults for that slot.
   */
  materialColors?: Partial<Record<string, KitMaterialSlotEntry>>;
};
