/** Spine (S) and staff hand (L/R) meshes for each Rahkshi variant in rahkshi.glb. */
export const RAHKSHI_VARIANT_MESH_NAMES = [
  'GuurahkL',
  'GuurahkR',
  'GuurahkS',
  'TurahkL',
  'TurahkR',
  'TurahkS',
  'KurahkL',
  'KurahkR',
  'KurahkS',
  'LerahkL',
  'LerahkR',
  'LerahkS',
  'PanrahkL',
  'PanrahkR',
  'PanrahkS',
  'VorahkL',
  'VorahkR',
  'VorahkS',
] as const;

export function isRahkshiVariantMesh(meshName: string): boolean {
  return (RAHKSHI_VARIANT_MESH_NAMES as readonly string[]).includes(meshName);
}

/** Whether a variant mesh should be visible for the active staff type (e.g. Turahk). */
export function shouldShowRahkshiVariantMesh(meshName: string, staffPrefix: string): boolean {
  return meshName.includes(staffPrefix);
}
