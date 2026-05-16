import { isCustomCharacterId, type RecruitedCharacterData } from '../types/Matoran';

/** Default Mata rig when a custom character first becomes Toa Mata. */
export const DEFAULT_CUSTOM_MATA_MODEL_ID = 'Toa_Tahu';

/** Canonical Toa Mata dex ids the player may choose for a custom build. */
export const CUSTOM_SELECTABLE_MATA_MODEL_IDS = [
  'Toa_Tahu',
  'Toa_Gali',
  'Toa_Kopaka',
  'Toa_Onua',
  'Toa_Pohatu',
  'Toa_Lewa',
] as const;

export type CustomSelectableMataModelId = (typeof CUSTOM_SELECTABLE_MATA_MODEL_IDS)[number];

const SELECTABLE_SET = new Set<string>(CUSTOM_SELECTABLE_MATA_MODEL_IDS);

export function isValidCustomMataModelId(
  id: string | undefined
): id is CustomSelectableMataModelId {
  return id !== undefined && SELECTABLE_SET.has(id);
}

/** Toa Mata rigs whose kit attachments read player palette keys (not GLB-only bodies). */
export const MATA_MODELS_WITH_KIT_PLAYER_PALETTE = new Set<string>([
  'Toa_Gali',
  'Toa_Kopaka',
  'Toa_Lewa',
  'Toa_Onua',
  'Toa_Pohatu',
  'Toa_Tahu',
]);

export function mataModelUsesKitPlayerPalette(buildId: string): boolean {
  return MATA_MODELS_WITH_KIT_PLAYER_PALETTE.has(buildId);
}

/**
 * Which Mata GLB/kit to render for Toa Mata. Canon characters use their dex id; customs use
 * `customMataModelId` when valid.
 */
export function resolveToaMataBuildId(
  matoran: Pick<RecruitedCharacterData, 'id' | 'customMataModelId'>
): string {
  if (!isCustomCharacterId(matoran.id)) return matoran.id;
  if (isValidCustomMataModelId(matoran.customMataModelId)) {
    return matoran.customMataModelId;
  }
  return DEFAULT_CUSTOM_MATA_MODEL_ID;
}
