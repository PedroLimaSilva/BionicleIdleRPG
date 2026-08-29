import {
  isCustomCharacterId,
  MatoranStage,
  type RecruitedCharacterData,
} from '../../types/Matoran';
import {
  CUSTOM_SELECTABLE_MATA_MODEL_IDS,
  DEFAULT_CUSTOM_MATA_MODEL_ID,
  isValidCustomMataModelId,
  type CustomSelectableMataModelId,
} from './customMataBuild';

/** Canonical Toa Nuva dex ids the player may choose for a custom build. */
export const CUSTOM_SELECTABLE_NUVA_MODEL_IDS = [
  'Toa_Tahu_Nuva',
  'Toa_Gali_Nuva',
  'Toa_Kopaka_Nuva',
  'Toa_Onua_Nuva',
  'Toa_Pohatu_Nuva',
  'Toa_Lewa_Nuva',
] as const;

/** Canonical Toa Metru dex ids the player may choose for a custom build. */
export const CUSTOM_SELECTABLE_METRU_MODEL_IDS = [
  'Toa_Vakama',
  'Toa_Matau',
  'Toa_Nokama',
  'Toa_Nuju',
  'Toa_Onewa',
  'Toa_Whenua',
] as const;

export type CustomSelectableNuvaModelId = (typeof CUSTOM_SELECTABLE_NUVA_MODEL_IDS)[number];
export type CustomSelectableMetruModelId = (typeof CUSTOM_SELECTABLE_METRU_MODEL_IDS)[number];

export type CustomToaArmorFamily = 'mata' | 'nuva' | 'metru';

export const DEFAULT_CUSTOM_NUVA_MODEL_ID: CustomSelectableNuvaModelId = 'Toa_Tahu_Nuva';
export const DEFAULT_CUSTOM_METRU_MODEL_ID: CustomSelectableMetruModelId = 'Toa_Vakama';

export const CUSTOM_SELECTABLE_TOA_MODEL_IDS = [
  ...CUSTOM_SELECTABLE_MATA_MODEL_IDS,
  ...CUSTOM_SELECTABLE_NUVA_MODEL_IDS,
  ...CUSTOM_SELECTABLE_METRU_MODEL_IDS,
] as const;

export type CustomSelectableToaModelId = (typeof CUSTOM_SELECTABLE_TOA_MODEL_IDS)[number];

const SELECTABLE_TOA_SET = new Set<string>(CUSTOM_SELECTABLE_TOA_MODEL_IDS);

const MATA_SET = new Set<string>(CUSTOM_SELECTABLE_MATA_MODEL_IDS);
const NUVA_SET = new Set<string>(CUSTOM_SELECTABLE_NUVA_MODEL_IDS);
const METRU_SET = new Set<string>(CUSTOM_SELECTABLE_METRU_MODEL_IDS);

export function isValidCustomToaModelId(id: string | undefined): id is CustomSelectableToaModelId {
  return id !== undefined && SELECTABLE_TOA_SET.has(id);
}

export function getCustomToaArmorFamily(modelId: string): CustomToaArmorFamily | null {
  if (MATA_SET.has(modelId)) return 'mata';
  if (NUVA_SET.has(modelId)) return 'nuva';
  if (METRU_SET.has(modelId)) return 'metru';
  return null;
}

export function getStageForCustomToaModelId(modelId: string): MatoranStage | null {
  const family = getCustomToaArmorFamily(modelId);
  switch (family) {
    case 'mata':
      return MatoranStage.ToaMata;
    case 'nuva':
      return MatoranStage.ToaNuva;
    case 'metru':
      return MatoranStage.ToaMetru;
    default:
      return null;
  }
}

export function getDefaultCustomToaModelIdForStage(stage: MatoranStage): string {
  switch (stage) {
    case MatoranStage.ToaNuva:
      return DEFAULT_CUSTOM_NUVA_MODEL_ID;
    case MatoranStage.ToaMetru:
      return DEFAULT_CUSTOM_METRU_MODEL_ID;
    default:
      return DEFAULT_CUSTOM_MATA_MODEL_ID;
  }
}

/**
 * Which Toa GLB/kit to render for custom characters. Canon characters use their dex id.
 * `customMataModelId` stores any selectable Toa rig id (Mata, Nuva, or Metru).
 */
export function resolveCustomToaBuildId(
  matoran: Pick<RecruitedCharacterData, 'id' | 'customMataModelId' | 'stage'>
): string {
  if (!isCustomCharacterId(matoran.id)) return matoran.id;
  if (isValidCustomToaModelId(matoran.customMataModelId)) {
    return matoran.customMataModelId;
  }
  if (isValidCustomMataModelId(matoran.customMataModelId)) {
    return matoran.customMataModelId;
  }
  return getDefaultCustomToaModelIdForStage(matoran.stage ?? MatoranStage.ToaMata);
}

/** @deprecated Use {@link resolveCustomToaBuildId}. */
export function resolveToaMataBuildId(
  matoran: Pick<RecruitedCharacterData, 'id' | 'customMataModelId' | 'stage'>
): string {
  return resolveCustomToaBuildId(matoran);
}

export type { CustomSelectableMataModelId };
