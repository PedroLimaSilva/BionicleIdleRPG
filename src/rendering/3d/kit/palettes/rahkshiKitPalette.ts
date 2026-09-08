import { LegoColor } from '../../../../types/Colors';
import type { KitMaterialSlotEntry } from '../../../../types/KitParts';
import type { MatoranColors } from '../../../../types/Matoran';
import type { RahkshiArmorColors } from '../../../../data/rahkshiArmorColors';
import type { WeatheredMetalOptions } from '../../CharacterScene/WeatheredMetalMaterial';
import {
  Color,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SkinnedMesh,
} from 'three';
import { uniform } from 'three/tsl';
import { kitPartSlots } from './partSlots';
import { KIT_TECHNIC_MAIN_BLACK, KIT_TECHNIC_MAIN_METAL } from './technicKitPalette';

/** Same weathering as the baked Rahkshi meshes in `Rahkshi.tsx`. */
export const RAHKSHI_WEATHERED: WeatheredMetalOptions = {
  cavityStrength: 1,
  debugGrimeAsColor: false,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18.0,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  largeScale: 3.5,
  metalness: 0.05,
  roughness: 0.55,
};

const DARK_BLUISH_GRAY: KitMaterialSlotEntry = {
  kind: 'lego',
  value: LegoColor.DarkBluishGray,
};

/** Shoulders, torso shell, legs, limbs, and technic arm main/joint. */
export const RAHKSHI_KIT_PALETTE_CHASSIS: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: DARK_BLUISH_GRAY,
  Metal: DARK_BLUISH_GRAY,
  Secondary: DARK_BLUISH_GRAY,
  Solid_Black: DARK_BLUISH_GRAY,
};

/** Limb ball sockets — same color as the feet (joint / gold-yellow on Chameleon). */
export const RAHKSHI_KIT_PALETTE_LIMB_SOCKET = kitPartSlots('feet', 'mata');

/** Shoulder sockets `Socket_SL` / `Socket_SR` — same color as the spine armor. */
export const RAHKSHI_KIT_PALETTE_SPINE_SOCKET = kitPartSlots('body', 'mata');

/**
 * Head socket `Socket_Head` — emissive like baked `Eyes`, no bloom halo.
 * `Rahkshi.tsx` syncs emissive on/off with the kraata glow, without copying bloom.
 */
export const RAHKSHI_KIT_PALETTE_HEAD_SOCKET: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: {
    color: { kind: 'lego', value: LegoColor.Black },
    emissive: { key: 'eyes', kind: 'palette' },
    emissiveIntensity: 1,
    weathered: false,
  },
};

export const RAHKSHI_KIT_PALETTE_FEET = kitPartSlots('feet', 'mata');

/** `TechnicArmPistonN` only has a Metal slot — tint it with the feet main color. */
export const RAHKSHI_KIT_PALETTE_PISTON_N: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'part', part: 'feet', slot: 'main' },
  Metal: { kind: 'part', part: 'feet', slot: 'main' },
};

export const RAHKSHI_KIT_PALETTE_TAN: Partial<Record<string, KitMaterialSlotEntry>> = {
  Main: { kind: 'lego', value: LegoColor.Tan },
};

export const RAHKSHI_KIT_PALETTE_BLACK = KIT_TECHNIC_MAIN_BLACK;
export const RAHKSHI_KIT_PALETTE_METAL = KIT_TECHNIC_MAIN_METAL;

/** Map lore armor/joint hex onto kit part slots (`useKitAttachments` colors). */
/** Kraata-driven tint slots on `SkinnedMesh` — fixed `Battle_*` slots stay as authored in the GLB. */
export function rahkshiBattleTintMap(dex: RahkshiArmorColors): Record<string, string> {
  return {
    Battle_Armor: dex.armor,
    Battle_Joint: dex.joint,
  };
}

function isTintableBattleMaterial(mat: Material): mat is MeshStandardMaterial {
  return (
    mat instanceof MeshStandardMaterial ||
    mat instanceof MeshPhysicalMaterial ||
    (mat as MeshStandardMaterial).isMeshStandardMaterial === true
  );
}

type SkinnedMaterial = MeshStandardMaterial & { skinning?: boolean };

const BATTLE_TINT_UNIFORM_KEY = 'battleTintUniform';

function tintUniformForMaterial(mat: MeshStandardMaterial, hex: string) {
  const existing = mat.userData[BATTLE_TINT_UNIFORM_KEY] as { value: Color } | undefined;
  if (existing) {
    existing.value.set(hex);
    return existing;
  }
  const tintUniform = uniform(new Color(hex));
  mat.userData[BATTLE_TINT_UNIFORM_KEY] = tintUniform;
  return tintUniform;
}

function applyBattleTintColorNode(mat: MeshStandardMaterial, hex: string): void {
  const tintUniform = tintUniformForMaterial(mat, hex);
  (mat as unknown as { colorNode?: unknown }).colorNode = tintUniform;
  mat.color.set(hex);
  mat.customProgramCacheKey = () => `battle_tint_${mat.name}_${mat.uuid}`;
  mat.needsUpdate = true;
}

function createTintedBattleMaterial(
  source: MeshStandardMaterial,
  hex: string
): MeshPhysicalMaterial {
  const isMetal = source.name === 'Battle_Metal';
  const tinted = new MeshPhysicalMaterial({
    color: hex,
    envMapIntensity: isMetal ? 0.52 : 0.4,
    metalness: isMetal ? 0.9 : 0.05,
    name: source.name,
    roughness: isMetal ? 0.3 : 0.55,
  });
  (tinted as SkinnedMaterial).skinning = (source as SkinnedMaterial).skinning ?? true;
  applyBattleTintColorNode(tinted, hex);
  return tinted;
}

function tintBattleMaterialInPlace(mat: MeshStandardMaterial, hex: string): void {
  if (mat.name === 'Battle_Metal') {
    mat.metalness = 0.9;
    mat.roughness = 0.3;
    mat.envMapIntensity = 0.52;
  }
  applyBattleTintColorNode(mat, hex);
}

/**
 * Applies battle LOD color tints on matching `Battle_*` slots. Skinned meshes cannot use
 * weathered TSL; a `colorNode` uniform keeps WebGPU skinning and kraata colors in sync.
 */
export function applyRahkshiBattleMaterialsToMesh(mesh: Mesh, tints: Record<string, string>): void {
  const raw = mesh.material;
  const materials = Array.isArray(raw) ? raw : [raw];
  let changed = false;
  const next = materials.map((mat) => {
    if (!isTintableBattleMaterial(mat)) return mat;
    const hex = tints[mat.name];
    if (!hex) return mat;
    changed = true;
    if ((mesh as SkinnedMesh).isSkinnedMesh) {
      tintBattleMaterialInPlace(mat, hex);
      return mat;
    }
    return createTintedBattleMaterial(mat, hex);
  });
  if (changed && !(mesh as SkinnedMesh).isSkinnedMesh) {
    mesh.material = Array.isArray(raw) ? next : next[0];
  }
  if ((mesh as SkinnedMesh).isSkinnedMesh) {
    mesh.frustumCulled = false;
  }
}

export function rahkshiKitColors(dex: RahkshiArmorColors): MatoranColors {
  const armor = dex.armor as LegoColor;
  const joint = dex.joint as LegoColor;
  const metal = LegoColor.LightGray;
  const feet: MatoranColors['body'] = {
    glow: joint,
    main: joint,
    metal,
    secondary: armor,
  };
  return {
    arms: feet,
    body: { glow: armor, main: armor, metal, secondary: armor },
    eyes: LegoColor.Orange,
    face: armor,
    feet,
    legs: feet,
    mask: armor,
  };
}
