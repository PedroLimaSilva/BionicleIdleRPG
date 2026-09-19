import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  isTahuBattleLodMesh,
  isTahuBattleRenderableMesh,
  TAHU_BATTLE_BODY_MATERIAL_NAMES,
  TAHU_BATTLE_BODY_MESH,
  TAHU_BATTLE_BRAIN_MATERIAL_NAMES,
  TAHU_BATTLE_BRAIN_MESH,
  TAHU_DETAILED_RIG_NODE,
} from './tahuBattleMeshes';

const TAHU_GLB = join(__dirname, '../../../../public/Toa_Mata/tahu.glb');

describe('Toa_Mata/tahu.glb battle LOD layout', () => {
  test('ships a single Tahu armature with Battle_* meshes', () => {
    const gltf = readGlbJsonFromPath(TAHU_GLB);
    const nodes = (gltf.nodes as { name?: string; translation?: number[] }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual([TAHU_DETAILED_RIG_NODE]);
    const tahu = nodes.find((node) => node.name === TAHU_DETAILED_RIG_NODE);
    // Armature object is lifted so scene origin stays at the feet — do not zero it at runtime.
    expect(tahu?.translation?.[1]).toBeGreaterThan(1);
  });

  test('Battle_Body is one skinned mesh with baked slots plus Glow', () => {
    const slots = extractGlbNodeMaterialSlots(TAHU_GLB);
    expect(slots[TAHU_BATTLE_BODY_MESH]).toEqual([...TAHU_BATTLE_BODY_MATERIAL_NAMES].sort());
    expect(slots[TAHU_BATTLE_BRAIN_MESH]).toEqual([...TAHU_BATTLE_BRAIN_MATERIAL_NAMES].sort());
  });

  test('opaque battle slots ship emissive discoloration and normals, not metallicRoughness maps', () => {
    const gltf = readGlbJsonFromPath(TAHU_GLB);
    const materials =
      (gltf.materials as {
        emissiveTexture?: { index: number };
        name?: string;
        normalTexture?: { index: number };
        pbrMetallicRoughness?: { metallicRoughnessTexture?: { index: number } };
      }[]) ?? [];
    const byName = new Map(materials.map((mat) => [mat.name, mat]));
    for (const name of [
      'Battle_Body_Main_Baked',
      'Battle_Body_Metal_Baked',
      'Battle_Body_Black_Baked',
      'Battle_Body_Secondary_Baked',
    ]) {
      const mat = byName.get(name);
      expect(mat).toBeDefined();
      expect(mat?.emissiveTexture).toBeDefined();
      expect(mat?.normalTexture).toBeDefined();
      expect(mat?.pbrMetallicRoughness?.metallicRoughnessTexture).toBeUndefined();
    }
  });
});

describe('tahu battle mesh naming', () => {
  test('identifies battle LOD meshes by Battle_ prefix', () => {
    expect(isTahuBattleLodMesh('Battle_Body')).toBe(true);
    expect(isTahuBattleLodMesh('Battle_Brain')).toBe(true);
    expect(isTahuBattleLodMesh('MataChest')).toBe(false);
  });

  test('treats Battle_* nodes as renderable battle meshes', () => {
    expect(isTahuBattleRenderableMesh({ name: 'Battle_Body' } as import('three').Object3D)).toBe(
      true
    );
    expect(isTahuBattleRenderableMesh({ name: 'MataChest' } as import('three').Object3D)).toBe(
      false
    );
  });

  test('treats skinned primitives parented under Battle_Brain as battle LOD', () => {
    const brainGroup = {
      name: 'Battle_Brain',
      parent: null,
    } as unknown as import('three').Object3D;
    const brainPrim = {
      name: 'Brain',
      parent: brainGroup,
    } as unknown as import('three').Object3D;
    expect(isTahuBattleLodMesh('Brain')).toBe(false);
    expect(isTahuBattleRenderableMesh(brainPrim)).toBe(true);
  });
});
