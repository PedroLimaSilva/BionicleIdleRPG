import type { LegoColor } from './Colors';

/** Body parts that carry a Main / Secondary / Metal / Glow palette in the dex. */
export const BODY_PART_IDS = ['body', 'arms', 'legs', 'feet', 'weapon'] as const;
export type BodyPartId = (typeof BODY_PART_IDS)[number];

export const BODY_PART_SLOTS = ['main', 'secondary', 'metal', 'glow'] as const;
export type BodyPartSlot = (typeof BODY_PART_SLOTS)[number];

/** Flat palette keys that are not per-part kit slots (avatar / Kanohi / brain). */
export type FlatPaletteKey = 'mask' | 'eyes' | 'face';

/** Runtime transmission presets for kit gel / visor slots (`transmissiveKitMaterial`). */
export type KitTransmissivePreset = 'brain' | 'mctoranFace' | 'vahkiHood';

/** How to resolve a hex color for a named material slot on a kit mesh */
export type KitMaterialColorSource =
  | { kind: 'lego'; value: LegoColor }
  | { kind: 'palette'; key: FlatPaletteKey }
  | { kind: 'part'; part: BodyPartId; slot: BodyPartSlot };

/**
 * Optional per-slot fields merged into the character's weathered-metal shader when
 * that slot participates in the pass (`useKitAttachments` + `weathered` on the model).
 * Omitted keys keep the character-level `WeatheredMetalOptions` defaults.
 *
 * Baked bevel atlases are kit-level (one map + UVs on the mesh), not listed here.
 * Weathered slots on the same mesh share that atlas; glow / emissive / transmissive
 * slots still opt out via `weathered: false`.
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
  /** When below 1, enables alpha blending on the cloned kit material. */
  opacity?: number;
  /** Overrides material-name defaults for runtime transmission gel / visor. */
  transmissive?: KitTransmissivePreset;
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
