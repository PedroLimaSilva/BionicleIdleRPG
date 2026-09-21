import { Object3D } from 'three';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';

/** Live armature in `Bohrok.glb` — packed swarm + Kal chassis, faceplates, and shields. */
export const BOHROK_SHEET_RIG_NODE = 'Bohrok';

/** Packed swarm chassis — one mesh, one draw per `Swarm_Body_*_Baked` slot. */
export const BOHROK_SHEET_BODY_MESH = 'Body';

/** Packed Kal chassis — Main / Black / Metal (no secondary). */
export const BOHROK_SHEET_KAL_BODY_MESH = 'Kal';

/** Transmissive eye shells + iris glow. */
export const BOHROK_SHEET_EYES_MESH = 'Eyes';

/** Swarm faceplate — packed `Swarms_Baked` shell + trans-clear viewport. */
export const BOHROK_SHEET_FACEPLATE_MESH = 'FacePlate_Transparent';

/** Kal faceplate — solid packed metal, no viewport. */
export const BOHROK_SHEET_KAL_FACEPLATE_MESH = 'FacePlate_Kal';

/** Krana, tinted from `colors.eyes`. */
export const BOHROK_SHEET_KRANA_MESH = 'Krana';

/** Printed Kal symbols live under this bone; runtime only toggles visibility. */
export const BOHROK_SHEET_SYMBOL_PARENT = 'Face Plate';

export const BOHROK_SHEET_BREEDS = [
  'Gahlok',
  'Kohrak',
  'Lehvak',
  'Nuhvok',
  'Pahrak',
  'Tahnok',
] as const;

export type BohrokSheetBreed = (typeof BOHROK_SHEET_BREEDS)[number];

/** Swarm shields. Local-space; parented onto the hand sockets at runtime. */
export const BOHROK_SHEET_SHIELD_MESHES = BOHROK_SHEET_BREEDS;

/** Kal shields — `{Breed}.Kal`. */
export const BOHROK_SHEET_KAL_SHIELD_MESHES = BOHROK_SHEET_BREEDS.map(
  (breed) => `${breed}.Kal`
) as readonly `${BohrokSheetBreed}.Kal`[];

/** Printed Kal forehead symbols — `{Breed}.Symbol`. */
export const BOHROK_SHEET_SYMBOL_MESHES = BOHROK_SHEET_BREEDS.map(
  (breed) => `${breed}.Symbol`
) as readonly `${BohrokSheetBreed}.Symbol`[];

export const BOHROK_SHEET_SHIELD_SOCKETS = ['Shield_L', 'Shield_R'] as const;

export const BOHROK_SHEET_BODY_MATERIAL_NAMES = [
  'Swarm_Body_Black_Baked',
  'Swarm_Body_Main_Baked',
  'Swarm_Body_Metal_Baked',
  'Swarm_Body_Secondary_Baked',
] as const;

export const BOHROK_SHEET_KAL_BODY_MATERIAL_NAMES = [
  'Kal_Black_Baked',
  'Kal_Main_Baked',
  'Kal_Metal_Baked',
] as const;

export const BOHROK_SHEET_EYES_MATERIAL_NAMES = ['Glowing', 'Trans_Color'] as const;

/** Packed atlas shared by the swarm faceplate shell and swarm shields. */
export const BOHROK_SHEET_SWARMS_MATERIAL = 'Swarms_Baked';

/** Packed atlas for the Kal faceplate and Kal shields. */
export const BOHROK_SHEET_KAL_SHIELDS_MATERIAL = 'KalShields_Baked';

export const BOHROK_SHEET_FACEPLATE_MATERIAL_NAMES = [
  'Clear',
  BOHROK_SHEET_SWARMS_MATERIAL,
] as const;

export const BOHROK_SHEET_KAL_FACEPLATE_MATERIAL_NAMES = [
  BOHROK_SHEET_KAL_SHIELDS_MATERIAL,
] as const;

export const BOHROK_SHEET_KRANA_MATERIAL_NAMES = ['Krana'] as const;

export const BOHROK_SHEET_SHIELD_MATERIAL_NAMES = [BOHROK_SHEET_SWARMS_MATERIAL] as const;

export const BOHROK_SHEET_KAL_SHIELD_MATERIAL_NAMES = [BOHROK_SHEET_KAL_SHIELDS_MATERIAL] as const;

/**
 * `bohrok_master.glb` authors this scale on the `Bohrok` node. Packed
 * `Bohrok.glb` already matches that visual size in mesh space, so do **not**
 * apply this on the packed clone — battle `0.175` is shared for swarm and Kal.
 */
export const BOHROK_PACKED_MATCH_MASTER_SCALE = 4.732668399810791;

const SWARM_SHIELD_SET = new Set<string>(BOHROK_SHEET_SHIELD_MESHES);
const KAL_SHIELD_SET = new Set<string>(BOHROK_SHEET_KAL_SHIELD_MESHES);

/**
 * GLTFLoader runs names through `PropertyBinding.sanitizeNodeName` (spaces → `_`,
 * reserved `[].:/` stripped). `Tahnok.Kal` becomes `TahnokKal` on the live graph.
 */
export function bohrokSheetRuntimeName(name: string): string {
  return name.replace(/\s/g, '_').replace(/[[\].:/]/g, '');
}

export function isBohrokSheetShieldMesh(meshName: string): boolean {
  return SWARM_SHIELD_SET.has(meshName) || KAL_SHIELD_SET.has(meshName);
}

/** `tahnok` / `tahnok_kal` → `Tahnok`. */
export function bohrokSheetBreedName(id: string): string {
  const [breed] = id.split('_');
  return breed.replace(/^./, (char) => char.toUpperCase());
}

export function bohrokSheetShieldMeshName(breed: string, isKal: boolean): string {
  return isKal ? `${breed}.Kal` : breed;
}

export function bohrokSheetSymbolMeshName(breed: string): string {
  return `${breed}.Symbol`;
}

function showObjectTree(root: Object3D): void {
  root.visible = true;
  root.traverse((child) => {
    child.visible = true;
  });
}

function matchesAuthoredName(object: Object3D, authoredName: string): boolean {
  return (
    object.name === authoredName ||
    object.name === bohrokSheetRuntimeName(authoredName) ||
    object.userData.name === authoredName
  );
}

function getByAuthoredName(root: Object3D, authoredName: string): Object3D | undefined {
  let found: Object3D | undefined;
  root.traverse((child) => {
    if (!found && matchesAuthoredName(child, authoredName)) found = child;
  });
  return found;
}

function getTemplate(
  templates: Record<string, Object3D>,
  authoredName: string
): Object3D | undefined {
  const runtime = bohrokSheetRuntimeName(authoredName);
  const keyed = templates[authoredName] ?? templates[runtime];
  if (keyed && matchesAuthoredName(keyed, authoredName)) return keyed;
  return Object.values(templates).find((object) => matchesAuthoredName(object, authoredName));
}

/**
 * Multi-material exports land as a named Group of SkinnedMeshes (`Body` /
 * `Kal` / `FacePlate_Transparent`). Toggle the whole tree. Skip bones so the
 * skeleton `Body` under `ROOT` stays posed.
 */
function setNamedTreeVisible(root: Object3D, authoredName: string, visible: boolean): void {
  let found: Object3D | undefined;
  root.traverse((child) => {
    if (found) return;
    if ((child as { isBone?: boolean }).isBone) return;
    if (matchesAuthoredName(child, authoredName)) found = child;
  });
  if (!found) return;
  found.traverse((child) => {
    child.visible = visible;
  });
}

function setBohrokSheetSymbols(root: Object3D, breed: string, isKal: boolean): void {
  const active = bohrokSheetSymbolMeshName(breed);
  root.traverse((child) => {
    const isSymbol = BOHROK_SHEET_SYMBOL_MESHES.some((authored) =>
      matchesAuthoredName(child, authored)
    );
    if (!isSymbol) return;
    child.visible = isKal && matchesAuthoredName(child, active);
  });
}

/** Swap swarm vs Kal skinned chassis and faceplates on the packed armature. */
export function setBohrokSheetVariant(root: Object3D, isKal: boolean): void {
  setNamedTreeVisible(root, BOHROK_SHEET_BODY_MESH, !isKal);
  setNamedTreeVisible(root, BOHROK_SHEET_FACEPLATE_MESH, !isKal);
  setNamedTreeVisible(root, BOHROK_SHEET_KAL_BODY_MESH, isKal);
  setNamedTreeVisible(root, BOHROK_SHEET_KAL_FACEPLATE_MESH, isKal);
}

function attachAtSocket(template: Object3D, socket: Object3D): Object3D {
  const clone = cloneGltfInstance(template);
  clone.position.set(0, 0, 0);
  clone.rotation.set(0, 0, 0);
  clone.scale.set(1, 1, 1);
  showObjectTree(clone);
  socket.add(clone);
  return clone;
}

/**
 * Instance the active breed's shield onto `Shield_L` / `Shield_R` (swarm and Kal
 * use the same local-space attach). Symbols are already parented under
 * `Face Plate` — show the active Kal print and hide the rest.
 */
export function attachBohrokSheetAccessories(args: {
  breed: string;
  isKal: boolean;
  root: Object3D;
  templates: Record<string, Object3D>;
}): Object3D[] {
  const { breed, isKal, root, templates } = args;
  setBohrokSheetVariant(root, isKal);
  setBohrokSheetSymbols(root, breed, isKal);

  const clones: Object3D[] = [];
  const shieldName = bohrokSheetShieldMeshName(breed, isKal);
  const shieldTemplate = getTemplate(templates, shieldName);
  if (!shieldTemplate) {
    console.warn(`[BohrokModel] Shield mesh '${shieldName}' not found in Bohrok.glb`);
    return clones;
  }
  for (const socketName of BOHROK_SHEET_SHIELD_SOCKETS) {
    const socket = getByAuthoredName(root, socketName);
    if (!socket) {
      console.warn(`[BohrokModel] Socket '${socketName}' not found on Bohrok rig`);
      continue;
    }
    clones.push(attachAtSocket(shieldTemplate, socket));
  }
  return clones;
}
