import { Material, Mesh, Object3D, SkinnedMesh } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import { isRahkshiBattleRenderableMesh, RAHKSHI_BATTLE_BODY_MESH } from './rahkshiBattleMeshes';

const DEBUG_STORAGE_KEY = 'RAHKSHI_LOD_DEBUG';

let enableHintLogged = false;

function isRenderableMesh(child: Object3D): child is Mesh {
  const mesh = child as Mesh;
  return mesh.isMesh === true || (child as SkinnedMesh).isSkinnedMesh === true;
}

function materialNames(mesh: Mesh): string {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials
    .filter((mat): mat is Material => mat != null)
    .map((mat) => mat.name || '(unnamed)')
    .join(', ');
}

export function isRahkshiLodDebugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const value = localStorage.getItem(DEBUG_STORAGE_KEY);
    return value === '1' || value === 'true';
  } catch {
    return false;
  }
}

export function logRahkshiLodEnableHint(): void {
  if (process.env.NODE_ENV === 'production' || enableHintLogged) return;
  enableHintLogged = true;
  console.info(
    `[RahkshiLOD] Debug logs are off. Enable with localStorage.setItem("${DEBUG_STORAGE_KEY}", "1") then reload.`
  );
}

export function logRahkshiLodMeshState(
  action: string,
  mesh: Mesh,
  extra?: Record<string, unknown>
): void {
  if (!isRahkshiLodDebugEnabled()) return;
  const skinned = mesh as SkinnedMesh;
  console.log(`[RahkshiLOD] ${action}`, {
    name: mesh.name,
    uuid: mesh.uuid.slice(0, 8),
    visible: mesh.visible,
    isSkinnedMesh: skinned.isSkinnedMesh === true,
    isBattleLod: isRahkshiBattleRenderableMesh(mesh),
    materials: materialNames(mesh),
    parent: mesh.parent?.name ?? null,
    ...extra,
  });
}

export function logRahkshiLodMeshVisibilityChange(
  source: string,
  mesh: Mesh,
  nextVisible: boolean,
  extra?: Record<string, unknown>
): void {
  if (!isRahkshiLodDebugEnabled()) return;
  if (mesh.visible === nextVisible) return;
  logRahkshiLodMeshState(`${source}: visible ${mesh.visible} -> ${nextVisible}`, mesh, extra);
}

/** Dump every runtime node under the cloned Rahkshi rig when the LOD variant changes. */
export function logRahkshiLodRuntimeNodes(
  root: Object3D,
  variant: RahkshiMeshVariant,
  source: string
): void {
  if (!isRahkshiLodDebugEnabled()) return;

  const meshes: Record<string, unknown>[] = [];
  const namedNodes: Record<string, unknown>[] = [];

  root.traverse((child) => {
    if (child.name) {
      const skinned = child as SkinnedMesh;
      namedNodes.push({
        name: child.name,
        type: child.type,
        isMesh: child.type === 'Mesh' || (child as Mesh).isMesh === true,
        isSkinnedMesh: skinned.isSkinnedMesh === true,
        hasGeometry: (child as Mesh).geometry != null,
        parent: child.parent?.name ?? null,
      });
    }
    if (!isRenderableMesh(child)) return;

    const skinned = child as SkinnedMesh;
    meshes.push({
      name: child.name || '(unnamed)',
      type: child.type,
      visible: child.visible,
      isSkinnedMesh: skinned.isSkinnedMesh === true,
      isBattleLod: isRahkshiBattleRenderableMesh(child),
      materials: materialNames(child),
      parent: child.parent?.name ?? null,
      uuid: child.uuid.slice(0, 8),
    });
  });

  const battleBodyParts = meshes.filter(
    (entry) => entry.isBattleLod && entry.name !== RAHKSHI_BATTLE_BODY_MESH
  );
  const battleBodyNamed = namedNodes.find((entry) => entry.name === RAHKSHI_BATTLE_BODY_MESH);

  console.group(`[RahkshiLOD] ${source}: runtime nodes (variant=${variant})`);
  console.log('named node count:', namedNodes.length);
  console.table(namedNodes);
  console.log('renderable meshes:', meshes.length);
  console.table(meshes);
  if (!battleBodyNamed) {
    console.warn(`[RahkshiLOD] No node named ${RAHKSHI_BATTLE_BODY_MESH} in rig.`);
  } else if (battleBodyNamed.type === 'Group' && battleBodyParts.length > 0) {
    console.log(
      `[RahkshiLOD] ${RAHKSHI_BATTLE_BODY_MESH} is a Group with ${battleBodyParts.length} skinned part(s).`
    );
  } else if (battleBodyNamed.type !== 'SkinnedMesh' && battleBodyParts.length === 0) {
    console.warn(
      `[RahkshiLOD] ${RAHKSHI_BATTLE_BODY_MESH} exists as type="${battleBodyNamed.type}" with no renderable children.`,
      battleBodyNamed
    );
  }
  console.groupEnd();
}
