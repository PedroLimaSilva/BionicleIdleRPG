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
      // Limbs share the torso color; arms are driven from body (see normalize…).
      return new Set(['mask', 'body', 'feet', 'eyes', 'face']);
    case MatoranStage.Rebuilt:
      return new Set(['mask', 'body', 'arms', 'feet', 'eyes', 'face']);
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
 * Coerces stored colors to rules for the given stage (e.g. diminished arms track body).
 */
export function normalizeCustomCharacterColorsForStage(
  stage: MatoranStage,
  colors: BaseMatoran['colors']
): BaseMatoran['colors'] {
  const next = { ...colors };
  if (stage === MatoranStage.Diminished) {
    next.arms = next.body;
  }
  return next;
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
  const next = { ...colors };

  if (fromStage === MatoranStage.Diminished && toStage === MatoranStage.Rebuilt) {
    // Rebuilt exposes separate arm plastics; start from the torso color the player used before.
    next.arms = next.body;
  }

  return normalizeCustomCharacterColorsForStage(toStage, next);
}
