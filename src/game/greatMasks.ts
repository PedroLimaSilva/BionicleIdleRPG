import { Mask } from '../types/Matoran';

/** Great Kanohi in `Toa_Metru/Masks.glb` are stored as Hau, Huna, … */
const GREAT_MASK_SUFFIX = '_Great';

/**
 * Map a Mask enum value (`Hau_Great`) to the node name in `Toa_Metru/Masks.glb` (`Hau`).
 * Noble / Mata ids (`Hau`) pass through so the same hook works for either naming.
 */
export function getGreatMaskNodeName(maskName: string): string {
  return maskName.endsWith(GREAT_MASK_SUFFIX)
    ? maskName.slice(0, -GREAT_MASK_SUFFIX.length)
    : maskName;
}

/**
 * The seven Kanohi sculpted as Great masks — one node in `Toa_Metru/Masks.glb` and one
 * `public/avatar/Kanohi/*_Great.webp` each. Masks absent from this map (Akaku, Kakama,
 * Kaukau, Miru, Pakari, Nuva variants, …) have no Great sculpt.
 */
const GREAT_MASK_BY_BASE: Partial<Record<Mask, Mask>> = {
  [Mask.Hau]: Mask.HauGreat,
  [Mask.Huna]: Mask.HunaGreat,
  [Mask.Komau]: Mask.KomauGreat,
  [Mask.Mahiki]: Mask.MahikiGreat,
  [Mask.Matatu]: Mask.MatatuGreat,
  [Mask.Rau]: Mask.RauGreat,
  [Mask.Ruru]: Mask.RuruGreat,
};

/**
 * Upgrade a Kanohi id to its Great sculpt (`Huna` → `Huna_Great`) for Toa Metru.
 * Ids that already name a Great mask, or that have no Great sculpt, pass through.
 */
export function getGreatMaskVariant(mask: Mask): Mask {
  return GREAT_MASK_BY_BASE[mask] ?? mask;
}
