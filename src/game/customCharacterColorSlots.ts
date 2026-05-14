import { MatoranStage, type BaseMatoran } from '../types/Matoran';
import type { MatoranPaletteKey } from '../types/KitParts';

/** Display order for color tabs in character creation. */
export const CUSTOM_CHARACTER_COLOR_TAB_ORDER: MatoranPaletteKey[] = [
  'mask',
  'body',
  'arms',
  'feet',
  'eyes',
  'face',
];

/**
 * Palette keys the player may edit for a custom character at this stage. Matches how each
 * body model maps `BaseMatoran.colors` (see DiminishedMatoranModel, RebuiltMatoranModel, and
 * custom Toa using the Mata kit + useMask).
 */
export function getEditablePaletteKeysForStage(
  stage: MatoranStage
): ReadonlySet<MatoranPaletteKey> {
  switch (stage) {
    case MatoranStage.Diminished:
    case MatoranStage.Rebuilt:
      // Custom characters may use any palette slot at each stage (canon matoran often match
      // torso and limbs; players are not restricted to that).
      return new Set(CUSTOM_CHARACTER_COLOR_TAB_ORDER);
    case MatoranStage.ToaMata:
      // Kit plastics use fixed LEGO tints; mask + eyes follow the custom palette today.
      return new Set(['mask', 'eyes']);
    default:
      return new Set(CUSTOM_CHARACTER_COLOR_TAB_ORDER);
  }
}

export function getOrderedEditableColorTabs(stage: MatoranStage): MatoranPaletteKey[] {
  const allowed = getEditablePaletteKeysForStage(stage);
  return CUSTOM_CHARACTER_COLOR_TAB_ORDER.filter((k) => allowed.has(k));
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
  return normalizeCustomCharacterColorsForStage(toStage, { ...colors });
}
