import { Object3D } from 'three';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';

/** Live armature in `Bohrok.glb` — packed body, baked faceplate, and six baked shields. */
export const BOHROK_SHEET_RIG_NODE = 'Bohrok';

/** Merged opaque body — one mesh, one draw per `Body_Original_*_Baked` slot. */
export const BOHROK_SHEET_BODY_MESH = 'Body_Baked';

/** Transmissive eye shells + iris glow. */
export const BOHROK_SHEET_EYES_MESH = 'Eyes';

/** Swarm faceplate — packed `Swarms_Baked` shell + trans-clear viewport. */
export const BOHROK_SHEET_FACEPLATE_MESH = 'FacePlate_Transparent';

/** Krana, tinted from `colors.eyes`. */
export const BOHROK_SHEET_KRANA_MESH = 'Krana';

/** One authored shield per swarm. Local-space; parented onto the hand sockets at runtime. */
export const BOHROK_SHEET_SHIELD_MESHES = [
  'Gahlok',
  'Kohrak',
  'Lehvak',
  'Nuhvok',
  'Pahrak',
  'Tahnok',
] as const;

export type BohrokSheetShieldMesh = (typeof BOHROK_SHEET_SHIELD_MESHES)[number];

export const BOHROK_SHEET_SHIELD_SOCKETS = ['Shield_L', 'Shield_R'] as const;

export const BOHROK_SHEET_BODY_MATERIAL_NAMES = [
  'Body_Original_Black_Baked',
  'Body_Original_Main_Baked',
  'Body_Original_Metal_Baked',
  'Body_Original_Secondary_Baked',
] as const;

export const BOHROK_SHEET_EYES_MATERIAL_NAMES = ['Glowing', 'Trans_Color'] as const;

/** Packed atlas shared by the faceplate shell and every breed shield. */
export const BOHROK_SHEET_SWARMS_MATERIAL = 'Swarms_Baked';

export const BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES = [
  'Clear',
  BOHROK_SHEET_SWARMS_MATERIAL,
] as const;

export const BOHROK_SHEET_KRANA_MATERIAL_NAMES = ['Krana'] as const;

export const BOHROK_SHEET_SHIELD_MATERIAL_NAMES = [BOHROK_SHEET_SWARMS_MATERIAL] as const;

/**
 * `bohrok_master.glb` authors this scale on the `Bohrok` node. Packed
 * `Bohrok.glb` already matches that visual size in mesh space, so do **not**
 * apply this on the packed clone — sheet `4.5` is Kal-only, and battle `0.175`
 * is shared.
 */
export const BOHROK_PACKED_MATCH_MASTER_SCALE = 4.732668399810791;

const SHIELD_MESH_SET = new Set<string>(BOHROK_SHEET_SHIELD_MESHES);

export function isBohrokSheetShieldMesh(meshName: string): boolean {
  return SHIELD_MESH_SET.has(meshName);
}

/** `tahnok` / `tahnok_kal` → `Tahnok`. */
export function bohrokSheetBreedName(id: string): string {
  const [breed] = id.split('_');
  return breed.replace(/^./, (char) => char.toUpperCase());
}

function showObjectTree(root: Object3D): void {
  root.visible = true;
  root.traverse((child) => {
    child.visible = true;
  });
}

/**
 * Hide every packed shield at the armature origin, then instance the active
 * breed onto `Shield_L` / `Shield_R` at identity (same as Kal kit attach).
 */
export function attachBohrokSwarmShields(root: Object3D, breed: string): Object3D[] {
  for (const name of BOHROK_SHEET_SHIELD_MESHES) {
    const mesh = root.getObjectByName(name);
    if (mesh) mesh.visible = false;
  }

  const template = root.getObjectByName(breed);
  if (!template) {
    console.warn(`[BohrokModel] Shield mesh '${breed}' not found in Bohrok.glb`);
    return [];
  }

  const clones: Object3D[] = [];
  for (const socketName of BOHROK_SHEET_SHIELD_SOCKETS) {
    const socket = root.getObjectByName(socketName);
    if (!socket) {
      console.warn(`[BohrokModel] Socket '${socketName}' not found on Bohrok rig`);
      continue;
    }
    const clone = cloneGltfInstance(template);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    showObjectTree(clone);
    socket.add(clone);
    clones.push(clone);
  }
  return clones;
}
