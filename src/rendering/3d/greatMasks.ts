/** Great Kanohi in `Toa_Metru/Masks.glb` are stored as Hau_Great, Huna_Great, … */
const GREAT_MASK_SUFFIX = '_Great';

/**
 * Map a Mask enum value (`Hau_Great`) to the node name in `Toa_Metru/Masks.glb` (`Hau_Great`).
 * Noble / Mata ids (`Hau`) get the `_Great` suffix appended for GLB lookup.
 */
export function getGreatMaskNodeName(maskName: string): string {
  return maskName.endsWith(GREAT_MASK_SUFFIX) ? maskName : `${maskName}${GREAT_MASK_SUFFIX}`;
}
