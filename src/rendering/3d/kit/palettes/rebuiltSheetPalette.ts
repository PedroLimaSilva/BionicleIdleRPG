import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { MatoranColors } from '../../../../types/Matoran';
import { Mesh, Object3D, SkinnedMesh } from 'three';
import type { WeatheredMetalOptions } from '../../CharacterScene/WeatheredMetalMaterial';
import {
  applyKitMaterialsToObject,
  buildKitMaterialSlotLookup,
} from '../../hooks/kitMaterialApplication';
import { MCTORAN_FACE_BRAIN_SLOT } from './brainKitPalette';
import { MATA_METAL_PBR } from './metalPbr';

/** Same weathering as diminished / Kopaka packed body; emissive RGB is R roughness / G metalness / B wear. */
export const REBUILT_SHEET_WEATHERED: WeatheredMetalOptions = {
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

const REBUILT_SHEET_EYES: KitMaterialSlotEntry = {
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: 50,
  weathered: false,
};

/**
 * Material names on `Body_Baked` / `Brain` → player palette.
 * Opaque baked slots weather; brain gel and glowing eyes stay unweathered.
 *
 * `Body_Limbs_Baked` is one atlas for arms + legs/feet, so it can only take
 * one tint — `arms.main`. Feet stay independently editable on 2D avatars.
 */
export const REBUILT_SHEET_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Body_Body_Baked: { kind: 'part', part: 'body', slot: 'main' },
  Body_Limbs_Baked: { kind: 'part', part: 'arms', slot: 'main' },
  Body_Metal_Baked: {
    color: { kind: 'part', part: 'body', slot: 'metal' },
    ...MATA_METAL_PBR,
  },
  Brain: MCTORAN_FACE_BRAIN_SLOT,
  'Glowing Eyes': REBUILT_SHEET_EYES,
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

/** Tints the packed rebuilt body with the player palette; packed emissive drives PBR + wear. */
export function applyRebuiltSheetMaterials(root: Object3D, colors: MatoranColors): void {
  const slotLookup = buildKitMaterialSlotLookup(REBUILT_SHEET_SLOT_COLORS);
  applyKitMaterialsToObject(root, slotLookup, colors, REBUILT_SHEET_WEATHERED);
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    disableSkinnedSheetFrustumCulling(child as Mesh);
  });
}
