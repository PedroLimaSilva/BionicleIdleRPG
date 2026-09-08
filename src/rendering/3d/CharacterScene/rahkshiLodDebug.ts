import { Camera, Mesh, Object3D, SkinnedMesh } from 'three';
import type { RahkshiMeshVariant } from './Rahkshi';
import { isRahkshiBattleLodMesh } from './rahkshiBattleMeshes';

const DEBUG_STORAGE_KEY = 'RAHKSHI_LOD_DEBUG';
const RAHKSHI_DETAILED_LAYER = 0;
const RAHKSHI_BATTLE_LAYER = 1;

let enableHintLogged = false;
let lastLoggedCameraMask = -1;

function isRenderableMesh(child: Object3D): child is Mesh {
  const mesh = child as Mesh;
  return mesh.isMesh === true || (child as SkinnedMesh).isSkinnedMesh === true;
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

export function logRahkshiLod(message: string, data?: Record<string, unknown>): void {
  if (!isRahkshiLodDebugEnabled()) return;
  if (data) console.log(`[RahkshiLOD] ${message}`, data);
  else console.log(`[RahkshiLOD] ${message}`);
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
    layersMask: mesh.layers.mask,
    layerIndex:
      mesh.layers.mask === 1 << RAHKSHI_BATTLE_LAYER
        ? RAHKSHI_BATTLE_LAYER
        : mesh.layers.mask === 1 << RAHKSHI_DETAILED_LAYER
          ? RAHKSHI_DETAILED_LAYER
          : 'other',
    isSkinnedMesh: skinned.isSkinnedMesh === true,
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

export function logRahkshiLodCameraLayers(
  camera: Camera,
  variant: RahkshiMeshVariant,
  source: string
): void {
  if (!isRahkshiLodDebugEnabled()) return;
  if (camera.layers.mask === lastLoggedCameraMask) return;
  lastLoggedCameraMask = camera.layers.mask;
  logRahkshiLod(`${source}: camera layers`, {
    variant,
    mask: camera.layers.mask,
    enabledLayer: variant === 'battle' ? RAHKSHI_BATTLE_LAYER : RAHKSHI_DETAILED_LAYER,
  });
}

export function logRahkshiLodSnapshot(
  root: Object3D,
  variant: RahkshiMeshVariant,
  source: string
): void {
  if (!isRahkshiLodDebugEnabled()) return;

  const battleMeshes: Record<string, unknown>[] = [];
  root.traverse((child) => {
    if (!isRenderableMesh(child) || !isRahkshiBattleLodMesh(child.name)) return;
    const skinned = child as SkinnedMesh;
    battleMeshes.push({
      name: child.name,
      visible: child.visible,
      layersMask: child.layers.mask,
      isSkinnedMesh: skinned.isSkinnedMesh === true,
      parent: child.parent?.name ?? null,
    });
  });

  console.groupCollapsed(`[RahkshiLOD] ${source}: snapshot (variant=${variant})`);
  console.table(battleMeshes);
  console.groupEnd();
}
