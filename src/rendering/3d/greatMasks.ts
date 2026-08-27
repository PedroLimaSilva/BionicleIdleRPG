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
