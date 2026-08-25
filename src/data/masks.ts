import { Mask, MatoranStage } from '../types/Matoran';

/**
 * Every Kanohi in the game, in the order the character-creation picker shows them:
 * Matoran-tier sculpts, then Great, then Nuva, then the unique story masks.
 *
 * `Mask` is a const enum, so it has no runtime object to enumerate. This array is the runtime
 * source of truth for "all masks" — the creation picker and share-token validation both read
 * it, and `ALL_MASKS.length` is asserted against the enum in `masks.spec.ts`.
 */
export const ALL_MASKS: Mask[] = [
  Mask.Hau,
  Mask.Kaukau,
  Mask.Kakama,
  Mask.Akaku,
  Mask.Pakari,
  Mask.Miru,
  Mask.Huna,
  Mask.Ruru,
  Mask.Komau,
  Mask.Rau,
  Mask.Matatu,
  Mask.Mahiki,
  Mask.HauGreat,
  Mask.HunaGreat,
  Mask.KomauGreat,
  Mask.MahikiGreat,
  Mask.MatatuGreat,
  Mask.RauGreat,
  Mask.RuruGreat,
  Mask.HauNuva,
  Mask.KaukauNuva,
  Mask.KakamaNuva,
  Mask.AkakuNuva,
  Mask.PakariNuva,
  Mask.MiruNuva,
  Mask.Avohkii,
  Mask.Vahi,
  Mask.Kraahkan,
  Mask.HauNuvaInfected,
  Mask.Krana,
];

/** Original 12 Kanohi in `masks.glb` (diminished, rebuilt, metru, toa mata, turaga rigs). */
export const MATAN_MASKS: Mask[] = ALL_MASKS.slice(0, 12);

/** Great Kanohi in `Toa_Metru/Masks.glb` (Toa Metru rig). */
export const GREAT_MASKS: Mask[] = ALL_MASKS.slice(12, 19);

/** Nuva Kanohi in `Toa_Nuva/masks.glb` (Toa Nuva rig). */
export const NUVA_MASKS: Mask[] = ALL_MASKS.slice(19, 25);

/**
 * Kanohi the character-creation picker may offer for a rig stage.
 * Story masks (Avohkii, Vahi, Kraahkan, etc.) are excluded — they are not modeled on custom rigs.
 */
export function getSelectableMasksForStage(stage: MatoranStage): Mask[] {
  switch (stage) {
    case MatoranStage.ToaMetru:
      return GREAT_MASKS;
    case MatoranStage.ToaNuva:
      return NUVA_MASKS;
    case MatoranStage.Diminished:
    case MatoranStage.Rebuilt:
    case MatoranStage.Metru:
    case MatoranStage.ToaMata:
    case MatoranStage.Turaga:
      return MATAN_MASKS;
    default:
      return MATAN_MASKS;
  }
}

export function isMaskSelectableForStage(mask: Mask, stage: MatoranStage): boolean {
  return getSelectableMasksForStage(stage).includes(mask);
}

/** Kanohi rendered with a transparent lens (Kaukau and its Nuva sculpt). */
export const TRANSPARENT_MASKS: Mask[] = [Mask.Kaukau, Mask.KaukauNuva];

export function isTransparentMask(mask: Mask): boolean {
  return TRANSPARENT_MASKS.includes(mask);
}
