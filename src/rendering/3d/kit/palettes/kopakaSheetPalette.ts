import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { MatoranColors } from '../../../../types/Matoran';
import { Mesh, Object3D, SkinnedMesh } from 'three';
import type { WeatheredMetalOptions } from '../../CharacterScene/WeatheredMetalMaterial';
import {
  applyKitMaterialsToObject,
  buildKitMaterialSlotLookup,
} from '../../hooks/kitMaterialApplication';
import { BRAIN_EMISSIVE_INTENSITY } from './brainKitPalette';
import { MATA_METAL_PBR } from './metalPbr';

/** Same weathering as Tahu packed body; emissive RGB is R roughness / G metalness / B wear. */
export const KOPAKA_SHEET_WEATHERED: WeatheredMetalOptions = {
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

/** Ice gel — same transmissive brain preset (and selective bloom) as MataBrain. */
const KOPAKA_SHEET_GEL: KitMaterialSlotEntry = {
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
  transmissive: 'brain',
  weathered: false,
};

const KOPAKA_SHEET_EYES: KitMaterialSlotEntry = {
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: 50,
  weathered: false,
};

/**
 * Material names on `Body` / `Brain` / `Sword` → player palette.
 * Opaque baked slots weather; brain, eyes, and sword gel stay unweathered.
 */
export const KOPAKA_SHEET_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Body_Black_Baked: { kind: 'lego', value: LegoColor.Black },
  Body_Main_Baked: { kind: 'part', part: 'body', slot: 'main' },
  Body_Metal_Baked: {
    color: { kind: 'part', part: 'body', slot: 'metal' },
    ...MATA_METAL_PBR,
  },
  Body_Secondary_Baked: { kind: 'part', part: 'body', slot: 'secondary' },
  Brain: KOPAKA_SHEET_GEL,
  'Glowing Eyes': KOPAKA_SHEET_EYES,
  'Weapon Transparent': KOPAKA_SHEET_GEL,
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

/** Tints Kopaka's skinned body; packed emissive drives PBR + wear; ice gel blooms with the brain. */
export function applyKopakaSheetMaterials(root: Object3D, colors: MatoranColors): void {
  const slotLookup = buildKitMaterialSlotLookup(KOPAKA_SHEET_SLOT_COLORS);
  applyKitMaterialsToObject(root, slotLookup, colors, KOPAKA_SHEET_WEATHERED);
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    disableSkinnedSheetFrustumCulling(child as Mesh);
  });
}
