import { Mesh, Object3D, SkinnedMesh } from 'three';
import {
  isTahuBattleRenderableMesh,
  TAHU_BATTLE_BRAIN_MESH,
  type TahuMeshVariant,
} from './tahuBattleMeshes';

/** Bind-pose socket that should carry the rigid `Battle_Brain` overlay. */
export const TAHU_BATTLE_BRAIN_SOCKET = 'Head';

function isRenderableMesh(child: Object3D): child is Mesh {
  const mesh = child as Mesh;
  return mesh.isMesh === true || (child as SkinnedMesh).isSkinnedMesh === true;
}

/**
 * `Battle_Brain` used to ship as a rigid child of `Tahu`, so head motion left the
 * gel/eyes behind. `attach` keeps the bind-pose world transform and parents it
 * to `Head`. Current exports skin it; this is a no-op when already under `Head`.
 */
export function reparentTahuBattleBrain(root: Object3D): void {
  const brain = root.getObjectByName(TAHU_BATTLE_BRAIN_MESH);
  const head = root.getObjectByName(TAHU_BATTLE_BRAIN_SOCKET);
  if (!brain || !head || brain.parent === head) return;
  head.attach(brain);
}

/** Toggle detailed kit sockets vs `Battle_*` meshes via `visible`. */
export function setTahuLodVisibility(root: Object3D, variant: TahuMeshVariant): void {
  const isBattle = variant === 'battle';
  root.traverse((child) => {
    if (!isRenderableMesh(child)) return;
    child.visible = isTahuBattleRenderableMesh(child) === isBattle;
  });
}
