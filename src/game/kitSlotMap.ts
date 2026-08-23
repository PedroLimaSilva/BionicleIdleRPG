import { LegoColor } from '../types/Colors';
import {
  KIT_COLOR_REGIONS,
  KIT_PLAYER_SLOTS,
  type CharacterKitSlotMap,
  type KitColorRegion,
  type KitMaterialSlotEntry,
  type KitPlayerSlot,
  type KitSlotBindings,
  type KitSocketAttachment,
  type MatoranPaletteKey,
} from '../types/KitParts';
import { MatoranStage, type BaseMatoran } from '../types/Matoran';
import { normalizeKitMaterialSlotEntry } from './kit/kitMaterialUtils';

const PLAYER_SLOT_LOOKUP = new Map<string, KitPlayerSlot>(
  KIT_PLAYER_SLOTS.map((slot) => [slot.toLowerCase(), slot])
);

const KIT_SLOT_EDITOR_STAGES = new Set<MatoranStage>([
  MatoranStage.ToaMata,
  MatoranStage.ToaNuva,
  MatoranStage.ToaMetru,
  MatoranStage.Metru,
]);

const TOA_REGION_DEFAULTS: KitSlotBindings = {
  Glow: 'eyes',
  Main: 'body',
  Metal: 'metal',
  Secondary: 'arms',
};

const TOA_WEAPON_DEFAULTS: KitSlotBindings = {
  ...TOA_REGION_DEFAULTS,
  Glow: 'weaponGlow',
};

const MATORAN_DEFAULTS: CharacterKitSlotMap = {
  arms: { Main: 'arms' },
  feet: { Main: 'feet' },
  head: { Glow: 'eyes', Main: 'face' },
  legs: { Main: 'feet' },
  torso: { Main: 'body' },
  weapon: { Glow: 'weaponGlow', Main: 'body' },
};

const METRU_DEFAULTS: CharacterKitSlotMap = {
  arms: { Glow: 'eyes', Main: 'joints', Metal: 'metal', Secondary: 'arms' },
  feet: { Main: 'feet' },
  head: { Glow: 'eyes', Main: 'joints', Metal: 'metal', Secondary: 'arms' },
  legs: { Glow: 'eyes', Main: 'joints', Metal: 'metal', Secondary: 'arms' },
  torso: { Glow: 'eyes', Main: 'body', Metal: 'metal', Secondary: 'arms' },
  weapon: { Glow: 'weaponGlow', Main: 'body', Metal: 'metal', Secondary: 'arms' },
};

const TOA_DEFAULTS: CharacterKitSlotMap = {
  arms: TOA_REGION_DEFAULTS,
  feet: TOA_REGION_DEFAULTS,
  head: TOA_REGION_DEFAULTS,
  legs: TOA_REGION_DEFAULTS,
  torso: TOA_REGION_DEFAULTS,
  weapon: TOA_WEAPON_DEFAULTS,
};

/** Stages where the creation UI exposes metal/joints and per-part slot bindings. */
export function stageUsesKitSlotEditor(stage: MatoranStage): boolean {
  return KIT_SLOT_EDITOR_STAGES.has(stage);
}

export function defaultJointsColorForStage(stage: MatoranStage): LegoColor {
  switch (stage) {
    case MatoranStage.Metru:
    case MatoranStage.ToaMetru:
      return LegoColor.DarkGray;
    default:
      return LegoColor.LightGray;
  }
}

/**
 * Fills optional palette keys used by kit slots. Existing customs that omit `metal` /
 * `joints` / `weaponGlow` keep the same resolved colors as before this change.
 */
export function withPaletteDefaults(
  colors: BaseMatoran['colors'],
  stage: MatoranStage
): BaseMatoran['colors'] {
  return {
    ...colors,
    joints: colors.joints ?? defaultJointsColorForStage(stage),
    metal: colors.metal ?? LegoColor.LightGray,
    weaponGlow: colors.weaponGlow ?? LegoColor.TransNeonYellow,
  };
}

export function getDefaultKitSlotMap(stage: MatoranStage): CharacterKitSlotMap {
  switch (stage) {
    case MatoranStage.ToaMata:
    case MatoranStage.ToaNuva:
      return TOA_DEFAULTS;
    case MatoranStage.Metru:
    case MatoranStage.ToaMetru:
      return METRU_DEFAULTS;
    default:
      return MATORAN_DEFAULTS;
  }
}

export function getDefaultBindingsForRegion(
  stage: MatoranStage,
  region: KitColorRegion
): KitSlotBindings {
  return { ...(getDefaultKitSlotMap(stage)[region] ?? {}) };
}

/** Merge stage defaults with a character's stored overrides (overrides win). */
export function resolveKitSlotMap(
  stage: MatoranStage,
  overrides: CharacterKitSlotMap | undefined
): CharacterKitSlotMap {
  const defaults = getDefaultKitSlotMap(stage);
  if (!overrides) return defaults;
  const resolved: CharacterKitSlotMap = {};
  for (const region of KIT_COLOR_REGIONS) {
    resolved[region] = {
      ...defaults[region],
      ...overrides[region],
    };
  }
  return resolved;
}

export function resolveBindingsForRegion(
  stage: MatoranStage,
  region: KitColorRegion,
  overrides: CharacterKitSlotMap | undefined
): KitSlotBindings {
  return {
    ...getDefaultBindingsForRegion(stage, region),
    ...overrides?.[region],
  };
}

function bindingsEqual(a: KitSlotBindings | undefined, b: KitSlotBindings | undefined): boolean {
  const keys = new Set([...Object.keys(a ?? {}), ...Object.keys(b ?? {})]) as Set<KitPlayerSlot>;
  for (const key of keys) {
    if ((a?.[key] ?? undefined) !== (b?.[key] ?? undefined)) return false;
  }
  return true;
}

/**
 * Drops regions/slots that match stage defaults so stored customs stay compact and
 * equivalent to older saves that omitted `kitSlotMap`.
 */
export function compactKitSlotMap(
  stage: MatoranStage,
  map: CharacterKitSlotMap | undefined
): CharacterKitSlotMap | undefined {
  if (!map) return undefined;
  const defaults = getDefaultKitSlotMap(stage);
  const compact: CharacterKitSlotMap = {};
  for (const region of KIT_COLOR_REGIONS) {
    const regionMap = map[region];
    if (!regionMap) continue;
    const defaultRegion = defaults[region] ?? {};
    const next: KitSlotBindings = {};
    for (const slot of KIT_PLAYER_SLOTS) {
      const value = regionMap[slot];
      if (value !== undefined && value !== defaultRegion[slot]) {
        next[slot] = value;
      }
    }
    if (Object.keys(next).length > 0) {
      compact[region] = next;
    }
  }
  return Object.keys(compact).length > 0 ? compact : undefined;
}

export function kitSlotMapsEquivalent(
  stage: MatoranStage,
  a: CharacterKitSlotMap | undefined,
  b: CharacterKitSlotMap | undefined
): boolean {
  const resolvedA = resolveKitSlotMap(stage, a);
  const resolvedB = resolveKitSlotMap(stage, b);
  return KIT_COLOR_REGIONS.every((region) => bindingsEqual(resolvedA[region], resolvedB[region]));
}

export function isKitPlayerSlot(slotName: string): slotName is KitPlayerSlot {
  return PLAYER_SLOT_LOOKUP.has(slotName.trim().toLowerCase());
}

export function normalizeKitPlayerSlot(slotName: string): KitPlayerSlot | undefined {
  return PLAYER_SLOT_LOOKUP.get(slotName.trim().toLowerCase());
}

/**
 * Classify a character socket as a color region. Structural pins/axles without a
 * body-part token default to torso so they keep attachment-authored colors unless
 * the player overrides torso slots.
 */
export function inferKitColorRegion(socketName: string): KitColorRegion {
  const n = socketName.toLowerCase().replace(/[_\-\s.]/g, '');
  if (/(weapon|spear|blade|sword|hook|axe|disklauncher|magma|kolhii)/.test(n)) {
    return 'weapon';
  }
  if (/(face|brain|eye|head|mask)/.test(n)) return 'head';
  if (/foot/.test(n)) return 'feet';
  // Arm tokens before shin/leg so `LimbShinArmLower` is arms, not legs.
  if (/(bicep|triceps|forearm|arm|hand|shoulder)/.test(n)) return 'arms';
  if (/(calf|shin|thigh|quad|ankle|leg)/.test(n)) return 'legs';
  if (/(chest|abdomen|torso|hip|oblique|body)/.test(n)) return 'torso';
  return 'torso';
}

function remapColorSourceKey(
  entry: KitMaterialSlotEntry,
  key: MatoranPaletteKey
): KitMaterialSlotEntry | undefined {
  const spec = normalizeKitMaterialSlotEntry(entry);
  let changed = false;
  const next = { ...spec };
  if (spec.color?.kind === 'palette' && spec.color.key !== key) {
    next.color = { key, kind: 'palette' };
    changed = true;
  }
  if (spec.emissive?.kind === 'palette' && spec.emissive.key !== key) {
    next.emissive = { key, kind: 'palette' };
    changed = true;
  }
  return changed ? next : undefined;
}

/**
 * Rewrites palette-backed Main/Secondary/Metal/Glow keys using the character's
 * stored overrides only. Hardcoded `kind: 'lego'` slots (black pins, etc.) stay
 * fixed. Attachments with no override for their region are returned unchanged.
 */
export function remapMaterialColorsForSlotMap(
  materialColors: Partial<Record<string, KitMaterialSlotEntry>> | undefined,
  overrides: KitSlotBindings | undefined
): Partial<Record<string, KitMaterialSlotEntry>> | undefined {
  if (!materialColors || !overrides || Object.keys(overrides).length === 0) {
    return materialColors;
  }
  let changed = false;
  const next: Partial<Record<string, KitMaterialSlotEntry>> = { ...materialColors };
  for (const [slotName, entry] of Object.entries(materialColors)) {
    if (!entry) continue;
    const slot = normalizeKitPlayerSlot(slotName);
    if (!slot) continue;
    const key = overrides[slot];
    if (!key) continue;
    const remapped = remapColorSourceKey(entry, key);
    if (remapped) {
      next[slotName] = remapped;
      changed = true;
    }
  }
  return changed ? next : materialColors;
}

export function applyKitSlotMapToAttachments<T extends KitSocketAttachment>(
  attachments: Record<string, T>,
  kitSlotMap: CharacterKitSlotMap | undefined
): Record<string, T> {
  if (!kitSlotMap || Object.keys(kitSlotMap).length === 0) return attachments;
  let changed = false;
  const next: Record<string, T> = { ...attachments };
  for (const [socketName, row] of Object.entries(attachments)) {
    const region = inferKitColorRegion(socketName);
    const remapped = remapMaterialColorsForSlotMap(row.materialColors, kitSlotMap[region]);
    if (remapped !== row.materialColors) {
      next[socketName] = { ...row, materialColors: remapped };
      changed = true;
    }
  }
  return changed ? next : attachments;
}

export const KIT_SLOT_BINDING_OPTIONS: readonly MatoranPaletteKey[] = [
  'mask',
  'body',
  'arms',
  'feet',
  'eyes',
  'face',
  'metal',
  'joints',
  'weaponGlow',
];
