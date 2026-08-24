import { Mask } from '../types/Matoran';

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

/** Kanohi rendered with a transparent lens (Kaukau and its Nuva sculpt). */
export const TRANSPARENT_MASKS: Mask[] = [Mask.Kaukau, Mask.KaukauNuva];

export function isTransparentMask(mask: Mask): boolean {
  return TRANSPARENT_MASKS.includes(mask);
}
