import { join } from 'node:path';
import { extractGlbNodeMaterialSlots, readGlbJsonFromPath } from '../kit/nodes/readGlbJson';
import {
  isRahkshiBattleBodyPartMesh,
  isRahkshiBattleLodMesh,
  isRahkshiBattleRenderableMesh,
  isRahkshiBattleSpeciesMesh,
  RAHKSHI_BATTLE_BODY_MESH,
  RAHKSHI_BATTLE_GLOW_MATERIAL,
  RAHKSHI_BATTLE_GLOW_MESH,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';

const RAHKSHI_GLB = join(__dirname, '../../../../public/rahkshi.glb');

describe('rahkshi.glb battle LOD layout', () => {
  test('ships a single Rahkshi armature with Battle_* meshes', () => {
    const gltf = readGlbJsonFromPath(RAHKSHI_GLB);
    const nodes = (gltf.nodes as { name?: string }[]) ?? [];
    const sceneRoots = ((gltf.scenes as { nodes?: number[] }[])?.[0]?.nodes ?? []).map(
      (index) => nodes[index]?.name
    );
    expect(sceneRoots).toEqual(['Rahkshi']);
  });

  test('Battle_Glow ships one merged mesh with a single Battle_Bloom slot', () => {
    const slots = extractGlbNodeMaterialSlots(RAHKSHI_GLB);
    expect(slots[RAHKSHI_BATTLE_GLOW_MESH]).toEqual([RAHKSHI_BATTLE_GLOW_MATERIAL]);
    expect(slots[RAHKSHI_BATTLE_BODY_MESH]).toEqual([
      'Battle_Armor',
      'Battle_Black',
      'Battle_Chassis',
      'Battle_Joint',
      'Battle_Metal',
      'Battle_Tan',
    ]);
  });
});

describe('rahkshi battle mesh naming', () => {
  test('identifies battle LOD meshes by Battle_ prefix', () => {
    expect(isRahkshiBattleLodMesh('Battle_Body')).toBe(true);
    expect(isRahkshiBattleLodMesh('Face')).toBe(false);
  });

  test('identifies skinned parts parented under the Battle_Body group', () => {
    const group = { name: RAHKSHI_BATTLE_BODY_MESH, parent: null } as import('three').Object3D;
    const part = {
      name: 'Part-44136_dot_dat003',
      parent: group,
    } as import('three').Object3D;

    expect(isRahkshiBattleBodyPartMesh(part)).toBe(true);
    expect(isRahkshiBattleRenderableMesh(part)).toBe(true);
    expect(isRahkshiBattleRenderableMesh(group)).toBe(true);
  });

  test('identifies battle species overlay meshes', () => {
    expect(isRahkshiBattleSpeciesMesh('Battle_Guurahk')).toBe(true);
    expect(isRahkshiBattleSpeciesMesh('Battle_GuurahkL')).toBe(false);
  });

  test('shows only the overlay matching the active staff breed', () => {
    expect(shouldShowRahkshiBattleSpeciesMesh('Battle_Guurahk', 'Guurahk')).toBe(true);
    expect(shouldShowRahkshiBattleSpeciesMesh('Battle_Guurahk', 'Turahk')).toBe(false);
    expect(shouldShowRahkshiBattleSpeciesMesh('Battle_Panrahk', 'Panrahk')).toBe(true);
  });
});
