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

/** Same weathering as Tahu kit plastics; battle LOD uses noise for metalness / roughness. */
export const TAHU_WEATHERED: WeatheredMetalOptions = {
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

/** Battle skinned slots keep baked normals + emissive discoloration; FBM drives PBR. */
export const TAHU_BATTLE_WEATHERED: WeatheredMetalOptions = {
  ...TAHU_WEATHERED,
  authoredPbrMaps: 'noise',
};

const TAHU_BATTLE_WEAPON_GLOW: KitMaterialSlotEntry = {
  emissive: { kind: 'part', part: 'weapon', slot: 'glow' },
  emissiveIntensity: 2.5,
  weathered: false,
};

const TAHU_BATTLE_BRAIN: KitMaterialSlotEntry = {
  color: { key: 'eyes', kind: 'palette' },
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
  transmissive: 'brain',
  weathered: false,
};

const TAHU_BATTLE_EYES: KitMaterialSlotEntry = {
  emissive: { key: 'eyes', kind: 'palette' },
  emissiveIntensity: 50,
  weathered: false,
};

/**
 * Material names on `Battle_Body` / `Battle_Brain` → player palette.
 * Opaque baked slots weather; glow, eyes, and brain gel stay unweathered.
 */
export const TAHU_BATTLE_SLOT_COLORS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Battle_Body_Black_Baked: { kind: 'lego', value: LegoColor.Black },
  Battle_Body_Main_Baked: { kind: 'part', part: 'body', slot: 'main' },
  Battle_Body_Metal_Baked: {
    color: { kind: 'part', part: 'body', slot: 'metal' },
    ...MATA_METAL_PBR,
  },
  Battle_Body_Secondary_Baked: { kind: 'part', part: 'body', slot: 'secondary' },
  Glow: TAHU_BATTLE_WEAPON_GLOW,
  'Tahu Eyes': TAHU_BATTLE_EYES,
  'TRANS-DARK_PINK': TAHU_BATTLE_BRAIN,
};

/**
 * Bind-pose bounds are wrong for a posed skinned mesh, so Three.js would
 * frustum-cull battle LOD off-screen. Disable culling instead of calling
 * `SkinnedMesh.computeBoundingSphere()`.
 */
function disableSkinnedBattleFrustumCulling(mesh: Mesh): void {
  const skinned = mesh as SkinnedMesh;
  if (!skinned.isSkinnedMesh) return;
  mesh.frustumCulled = false;
}

/** Tints battle meshes with the player palette; weathered FBM fills metalness / roughness. */
export function applyTahuBattleMaterials(root: Object3D, colors: MatoranColors): void {
  const slotLookup = buildKitMaterialSlotLookup(TAHU_BATTLE_SLOT_COLORS);
  applyKitMaterialsToObject(root, slotLookup, colors, TAHU_BATTLE_WEATHERED);
  root.traverse((child) => {
    if (!(child as Mesh).isMesh) return;
    disableSkinnedBattleFrustumCulling(child as Mesh);
  });
}
