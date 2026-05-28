import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D } from 'three';

const maskSlotPlaceholdersHidden = new WeakSet<Object3D>();

function isTintableMat(mat: unknown): mat is MeshPhysicalMaterial | MeshStandardMaterial {
  return mat instanceof MeshPhysicalMaterial || mat instanceof MeshStandardMaterial;
}

/**
 * Mata / Matoran GLBs parent mask clones under a node named `Masks` that also carries
 * a tiny placeholder solid (e.g. a small cube) from the mesh author — not a second
 * Kanohi, and not meaningfully visible with current mask assets. We still make that
 * mesh fully transparent so it cannot z-fight or clip through the real mask from
 * `masks.glb` if transforms or materials change.
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
