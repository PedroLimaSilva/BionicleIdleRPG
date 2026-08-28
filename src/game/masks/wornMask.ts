import { Mask } from '../../types/Matoran';

/** Character fields used to pick which Kanohi is actually worn. */
export type WornMaskSource = {
  mask: Mask;
  maskOverride?: Mask;
  /**
   * When true, honor `maskOverride` even if it is not in the collected list.
   * Used by the character dex preview so every sculpt can be swapped freely.
   */
  unlockAllMasks?: boolean;
};

/** Resolve the worn Kanohi from dex default, runtime override, and collected masks. */
export function resolveWornMask(matoran: WornMaskSource, collected: Mask[]): Mask {
  if (matoran.unlockAllMasks) {
    return matoran.maskOverride ?? matoran.mask;
  }
  const fallback = collected[0] ?? matoran.mask;
  const effectiveMask = collected.includes(matoran.mask) ? matoran.mask : fallback;
  const override = matoran.maskOverride;
  return override && collected.includes(override) ? override : effectiveMask;
}
