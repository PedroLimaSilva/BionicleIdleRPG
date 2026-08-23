import { MatoranStage, type BaseMatoran } from '../types/Matoran';
import type { MatoranPaletteKey } from '../types/KitParts';
import { mataModelUsesKitPlayerPalette } from './customMataBuild';
import { stageUsesKitSlotEditor, withPaletteDefaults } from './kitSlotMap';

/** Display order for color tabs in character creation. */
export const CUSTOM_CHARACTER_COLOR_TAB_ORDER: MatoranPaletteKey[] = [
  'mask',
  'body',
  'arms',
  'feet',
  'eyes',
  'face',
];

/** Multi-slot kits expose metal/joints (and Toa Mata adds weapon glow). */
const KIT_SLOT_COLOR_TAB_ORDER: MatoranPaletteKey[] = [
  ...CUSTOM_CHARACTER_COLOR_TAB_ORDER,
  'metal',
  'joints',
];

const TOA_MATA_KIT_COLOR_TAB_ORDER: MatoranPaletteKey[] = [
  ...KIT_SLOT_COLOR_TAB_ORDER,
  'weaponGlow',
];

/**
 * Palette keys the player may edit for a custom character at this stage. For Toa Mata,
 * `mataBuildId` is the resolved Mata dex id (`Toa_Tahu`, …) so kit-driven rigs expose the full
 * palette; all selectable Mata builds use the kit palette.
 */
export function getEditablePaletteKeysForStage(
  stage: MatoranStage,
  mataBuildId?: string
): ReadonlySet<MatoranPaletteKey> {
  switch (stage) {
    case MatoranStage.Diminished:
    case MatoranStage.Rebuilt:
      // Custom characters may use any palette slot at each stage (canon matoran often match
      // torso and limbs; players are not restricted to that).
      return new Set(CUSTOM_CHARACTER_COLOR_TAB_ORDER);
    case MatoranStage.ToaMata:
      if (mataBuildId && mataModelUsesKitPlayerPalette(mataBuildId)) {
        return new Set(TOA_MATA_KIT_COLOR_TAB_ORDER);
      }
      return new Set(['mask', 'eyes']);
    case MatoranStage.ToaNuva:
    case MatoranStage.Metru:
    case MatoranStage.ToaMetru:
      return new Set(KIT_SLOT_COLOR_TAB_ORDER);
    default:
      return new Set(CUSTOM_CHARACTER_COLOR_TAB_ORDER);
  }
}

export function getOrderedEditableColorTabs(
  stage: MatoranStage,
  mataBuildId?: string
): MatoranPaletteKey[] {
  const allowed = getEditablePaletteKeysForStage(stage, mataBuildId);
  const order =
    stage === MatoranStage.ToaMata && mataBuildId && mataModelUsesKitPlayerPalette(mataBuildId)
      ? TOA_MATA_KIT_COLOR_TAB_ORDER
      : stageUsesKitSlotEditor(stage)
        ? KIT_SLOT_COLOR_TAB_ORDER
        : CUSTOM_CHARACTER_COLOR_TAB_ORDER;
  return order.filter((k) => allowed.has(k));
}

/**
 * Coerces stored colors to rules for the given stage. Reserved for future per-stage fixes;
 * custom palettes are not forced to match canon defaults (e.g. arms vs body on Diminished).
 */
export function normalizeCustomCharacterColorsForStage(
  _stage: MatoranStage,
  colors: BaseMatoran['colors']
): BaseMatoran['colors'] {
  return { ...colors };
}

/**
 * When opening the editor right after evolution, seed colors for slots that gain new meaning.
 * `fromStage` is the stage before evolution; `toStage` is the current (post-evolve) stage.
 */
export function prefillColorsAfterEvolution(
  fromStage: MatoranStage,
  toStage: MatoranStage,
  colors: BaseMatoran['colors']
): BaseMatoran['colors'] {
  if (fromStage === toStage) return { ...colors };
  const next = normalizeCustomCharacterColorsForStage(toStage, { ...colors });
  if (stageUsesKitSlotEditor(toStage)) {
    return withPaletteDefaults(next, toStage);
  }
  return next;
}
