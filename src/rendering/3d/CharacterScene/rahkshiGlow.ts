import { Mesh, MeshStandardMaterial } from 'three';
import { RAHKSHI_BATTLE_GLOW_MESH } from './rahkshiBattleMeshes';
import { isSelectiveBloomRahkshiGlowMaterial } from './selectiveBloom';

/** Baked detailed-rig kraata disk / eye mesh in `rahkshi.glb`. */
export const RAHKSHI_DETAILED_GLOW_MESH = 'Glow';

export function isRahkshiGlowMesh(meshName: string): boolean {
  return meshName === RAHKSHI_DETAILED_GLOW_MESH || meshName === RAHKSHI_BATTLE_GLOW_MESH;
}

export function forEachRahkshiGlowMaterial(
  mesh: Mesh,
  visit: (mat: MeshStandardMaterial, index: number) => void
): void {
  const raw = mesh.material;
  const materials = Array.isArray(raw) ? raw : [raw];
  materials.forEach((mat, index) => {
    if (!(mat instanceof MeshStandardMaterial)) return;
    if (!isSelectiveBloomRahkshiGlowMaterial(mat.name) && !isRahkshiGlowMesh(mesh.name)) return;
    visit(mat, index);
  });
}

export function mapRahkshiGlowMaterials(
  mesh: Mesh,
  mapMaterial: (mat: MeshStandardMaterial, index: number) => MeshStandardMaterial
): boolean {
  const raw = mesh.material;
  const materials = Array.isArray(raw) ? raw : [raw];
  let changed = false;
  const next = materials.map((mat, index) => {
    if (!(mat instanceof MeshStandardMaterial)) return mat;
    if (!isSelectiveBloomRahkshiGlowMaterial(mat.name) && !isRahkshiGlowMesh(mesh.name)) {
      return mat;
    }
    changed = true;
    return mapMaterial(mat, index);
  });
  if (changed) {
    mesh.material = Array.isArray(raw) ? next : next[0];
  }
  return changed;
}
