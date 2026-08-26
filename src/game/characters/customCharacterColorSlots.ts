import { LegoColor } from '../../types/Colors';
import type { BodyPartId, BodyPartSlot } from '../../types/KitParts';
import {
  MatoranStage,
  type BaseMatoran,
  type ColorTabId,
  type MatoranColors,
} from '../../types/Matoran';
import { mataModelUsesKitPlayerPalette } from '../../rendering/3d/customMataBuild';
import {
  expandToKitStage,
  getBodyPartSlotColor,
  normalizeMatoranColors,
  setBodyPartSlot,
  stageUsesPartSlots,
} from './matoranColors';

/** Display order for color tabs in character creation (matoran stages). */
export const CUSTOM_CHARACTER_COLOR_TAB_ORDER: ColorTabId[] = [
  'mask',
  'body',
  'arms',
  'feet',
  'eyes',
  'face',
];

/** Kit stages expose legs + weapon palettes in addition to the matoran tabs. */
const KIT_PART_TAB_ORDER: ColorTabId[] = [
  'mask',
  'body',
  'arms',
  'legs',
  'feet',
  'weapon',
  'eyes',
  'face',
];

const FLAT_TABS = new Set<ColorTabId>(['mask', 'eyes', 'face']);

export function isFlatColorTab(tab: ColorTabId): tab is 'eyes' | 'face' | 'mask' {
  return FLAT_TABS.has(tab);
}

export function getEditableColorTabs(stage: MatoranStage, mataBuildId?: string): ColorTabId[] {
  switch (stage) {
    case MatoranStage.Diminished:
    case MatoranStage.Rebuilt:
    case MatoranStage.Turaga:
      return CUSTOM_CHARACTER_COLOR_TAB_ORDER;
    case MatoranStage.ToaMata:
      if (mataBuildId && mataModelUsesKitPlayerPalette(mataBuildId)) {
        return KIT_PART_TAB_ORDER;
      }
      return ['mask', 'eyes'];
    case MatoranStage.ToaNuva:
    case MatoranStage.Metru:
    case MatoranStage.ToaMetru:
      return KIT_PART_TAB_ORDER;
    default:
      return CUSTOM_CHARACTER_COLOR_TAB_ORDER;
  }
}

/** @deprecated Use {@link getEditableColorTabs}. Kept for existing call sites. */
export function getOrderedEditableColorTabs(
  stage: MatoranStage,
  mataBuildId?: string
): ColorTabId[] {
  return getEditableColorTabs(stage, mataBuildId);
}

export function getEditablePaletteKeysForStage(
  stage: MatoranStage,
  mataBuildId?: string
): ReadonlySet<ColorTabId> {
  return new Set(getEditableColorTabs(stage, mataBuildId));
}

/**
 * Material slots shown under a body-part tab. Flat tabs (mask/eyes/face) return [].
 * Diminished / Rebuilt only edit Main; kit stages edit Main/Secondary/Metal/Glow.
 */
export function getEditableSlotsForTab(stage: MatoranStage, tab: ColorTabId): BodyPartSlot[] {
  if (isFlatColorTab(tab)) return [];
  if (!stageUsesPartSlots(stage)) return ['main'];
  return ['main', 'secondary', 'metal', 'glow'];
}

export function getColorTabSwatch(colors: MatoranColors, tab: ColorTabId): LegoColor {
  if (isFlatColorTab(tab)) return colors[tab];
  if (tab === 'legs') return (colors.legs ?? colors.feet).main;
  if (tab === 'weapon') return (colors.weapon ?? colors.body).main;
  return colors[tab].main;
}

export function getActiveTabColor(
  colors: MatoranColors,
  tab: ColorTabId,
  slot: BodyPartSlot = 'main'
): LegoColor {
  if (isFlatColorTab(tab)) return colors[tab];
  return getBodyPartSlotColor(colors, tab, slot);
}

export function setColorTabValue(
  colors: MatoranColors,
  tab: ColorTabId,
  value: LegoColor,
  slot: BodyPartSlot = 'main'
): MatoranColors {
  if (isFlatColorTab(tab)) return { ...colors, [tab]: value };
  return setBodyPartSlot(colors, tab as BodyPartId, slot, value);
}

export function colorPartLabel(part: ColorTabId, stage: MatoranStage): string {
  if (part === 'feet' && stage === MatoranStage.Rebuilt) {
    return 'feet & hands';
  }
  return part;
}

export function slotLabel(slot: BodyPartSlot): string {
  switch (slot) {
    case 'main':
      return 'Main';
    case 'secondary':
      return 'Secondary';
    case 'metal':
      return 'Metal';
    case 'glow':
      return 'Glow';
    default:
      return slot;
  }
}

/**
 * Coerces stored colors (legacy flat or current palettes) to the dex shape.
 */
export function normalizeCustomCharacterColorsForStage(
  stage: MatoranStage,
  colors: BaseMatoran['colors'] | Record<string, unknown>
): MatoranColors {
  return normalizeMatoranColors(colors, stage);
}

/**
 * When opening the editor right after evolution, seed per-part slots so kit
 * Main/Secondary/Metal/Glow match the old flat-palette defaults.
 */
export function prefillColorsAfterEvolution(
  fromStage: MatoranStage,
  toStage: MatoranStage,
  colors: BaseMatoran['colors'] | Record<string, unknown>
): MatoranColors {
  const from = normalizeMatoranColors(colors, fromStage);
  if (fromStage === toStage) return from;
  if (stageUsesPartSlots(toStage) && !stageUsesPartSlots(fromStage)) {
    return expandToKitStage(from, toStage);
  }
  return normalizeMatoranColors(from, toStage);
}
