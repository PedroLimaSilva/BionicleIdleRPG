import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { MatoranColors } from '../../../../types/Matoran';
import { Mesh, Object3D, SkinnedMesh } from 'three';
import type { WeatheredMetalOptions } from '../../CharacterScene/WeatheredMetalMaterial';
import { BOHROK_SHEET_FACEPLATE_MESH } from '../../CharacterScene/bohrokSheetMeshes';
import {
  applyKitMaterialsToObject,
  buildKitMaterialSlotLookup,
} from '../../hooks/kitMaterialApplication';
import { CRYSTAL_BRAIN_SLOT } from './brainKitPalette';
import { MATA_METAL_PBR } from './metalPbr';
import { BOHROK_WEATHERED } from './bohrokKitPalette';

/** Same weathering as Tahu / Kopaka packed body; emissive RGB is R roughness / G metalness / B wear. */
export const BOHROK_SHEET_WEATHERED: WeatheredMetalOptions = {
  authoredPbrMaps: 'packed',
  cavityStrength: 1,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18.0,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  metalness: 0.05,
  roughness: 0.55,
};

const BOHROK_SHEET_IRIS: KitMaterialSlotEntry = {
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: 5,
  weathered: false,
};

const BOHROK_SHEET_SILVER: KitMaterialSlotEntry = {
  color: { kind: 'lego', value: LegoColor.LightGray },
  ...MATA_METAL_PBR,
};

/**
 * Packed `Body` slots. Secondary is the limb/accent atlas (`arms.main`);
 * feet stay independently editable on 2D avatars.
 */
export const BOHROK_SHEET_BODY_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Swarm_Body_Black_Baked: { kind: 'lego', value: LegoColor.Black },
  Swarm_Body_Main_Baked: { kind: 'part', part: 'body', slot: 'main' },
  Swarm_Body_Metal_Baked: {
    color: { kind: 'part', part: 'body', slot: 'metal' },
    ...MATA_METAL_PBR,
  },
  Swarm_Body_Secondary_Baked: { kind: 'part', part: 'arms', slot: 'main' },
};

/** Packed Kal chassis. Main stays the breed color; Metal / shields are silver. */
export const BOHROK_SHEET_KAL_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Kal_Black_Baked: { kind: 'lego', value: LegoColor.Black },
  Kal_Main_Baked: { kind: 'part', part: 'body', slot: 'main' },
  Kal_Metal_Baked: BOHROK_SHEET_SILVER,
  KalShields_Baked: BOHROK_SHEET_SILVER,
};

/** Packed atlas on the swarm faceplate shell and every swarm shield. */
const BOHROK_SHEET_SWARMS_SLOT: KitMaterialSlotEntry = {
  kind: 'part',
  part: 'body',
  slot: 'main',
};

export const BOHROK_SHEET_PACKED_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  ...BOHROK_SHEET_BODY_SLOT_COLORS,
  ...BOHROK_SHEET_KAL_SLOT_COLORS,
  Swarms_Baked: BOHROK_SHEET_SWARMS_SLOT,
};

/** Eyes / Krana. Faceplate `Clear` is the transmissive viewport (applied on that mesh only). */
export const BOHROK_SHEET_ACCESSORY_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Glowing: BOHROK_SHEET_IRIS,
  Krana: {
    color: { key: 'eyes', kind: 'palette' },
    weathered: false,
  },
  Trans_Color: CRYSTAL_BRAIN_SLOT,
};

const BOHROK_SHEET_FACEPLATE_CLEAR: Partial<Record<string, KitMaterialSlotEntry>> = {
  Clear: { transmissive: 'clear', weathered: false },
};

/**
 * Bind-pose bounds are wrong for a posed skinned mesh, so Three.js would
 * frustum-cull the sheet mesh off-screen. Disable culling instead of calling
 * `SkinnedMesh.computeBoundingSphere()`.
 */
function disableSkinnedSheetFrustumCulling(mesh: Mesh): void {
  const skinned = mesh as SkinnedMesh;
  if (!skinned.isSkinnedMesh) return;
  mesh.frustumCulled = false;
}

/** Tints packed swarm / Kal chassis plus unpacked eyes, Krana, and the swarm viewport. */
export function applyBohrokSheetMaterials(root: Object3D, colors: MatoranColors): void {
  applyKitMaterialsToObject(
    root,
    buildKitMaterialSlotLookup(BOHROK_SHEET_PACKED_SLOT_COLORS),
    colors,
    BOHROK_SHEET_WEATHERED
  );
  applyKitMaterialsToObject(
    root,
    buildKitMaterialSlotLookup(BOHROK_SHEET_ACCESSORY_SLOT_COLORS),
    colors,
    BOHROK_WEATHERED
  );
  const faceplate = root.getObjectByName(BOHROK_SHEET_FACEPLATE_MESH);
  if (faceplate) {
    applyKitMaterialsToObject(
      faceplate,
      buildKitMaterialSlotLookup(BOHROK_SHEET_FACEPLATE_CLEAR),
      colors,
      BOHROK_WEATHERED
    );
  }
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    disableSkinnedSheetFrustumCulling(child as Mesh);
  });
}
