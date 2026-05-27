import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';

const maskSlotPlaceholdersHidden = new WeakSet<Object3D>();

function isTintableMat(mat: unknown): mat is MeshPhysicalMaterial | MeshStandardMaterial {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/**
 * Mata / Matoran character GLBs parent mask clones under a node named "Masks" that
 * often still includes the mesh author's default kanohi. Hide that placeholder mesh
 * so only masks.glb clones render. Without this, equipping a mask that differs from
 * the default (e.g. custom Toa on a borrowed Mata rig) shows two overlapping masks.
 *
 * Uses a WeakSet so we only replace materials once per shared cached `nodes.Masks`
 * instance from useGLTF.
 */
export function ensureMaskSlotPlaceholderHidden(masksParent: Object3D | undefined): void {
  if (!masksParent || maskSlotPlaceholdersHidden.has(masksParent)) return;
  const mesh = masksParent as Mesh;
  if (!mesh.isMesh || !mesh.material) return;
  const raw = mesh.material;
  const mats = Array.isArray(raw) ? raw : [raw];
  const next = mats.map((m) => {
    if (!isTintableMat(m)) return m;
    const c = m.clone();
    c.transparent = true;
    c.opacity = 0;
    c.depthWrite = false;
    return c;
  });
  mesh.material = Array.isArray(raw) ? next : next[0];
  maskSlotPlaceholdersHidden.add(masksParent);
}
