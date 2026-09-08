import { join } from 'node:path';
import { extractGlbNodeMaterialSlots } from '../kit/nodes/readGlbJson';
import {
  isRahkshiBattleSpeciesMesh,
  RAHKSHI_BATTLE_GLOW_MATERIAL,
  RAHKSHI_BATTLE_GLOW_MESH,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';

const RAHKSHI_GLB = join(__dirname, '../../../../public/rahkshi.glb');

describe('rahkshi.glb battle LOD layout', () => {
  // Remove .skip after re-exporting rahkshi.glb with a single Battle_Bloom primitive on Battle_Glow.
  test.skip('Battle_Glow ships one merged mesh with a single Battle_Bloom slot', () => {
    const slots = extractGlbNodeMaterialSlots(RAHKSHI_GLB);
    expect(slots[RAHKSHI_BATTLE_GLOW_MESH]).toEqual([RAHKSHI_BATTLE_GLOW_MATERIAL]);
  });
});

describe('rahkshi battle species mesh visibility', () => {
  test('identifies battle species overlay meshes', () => {
    expect(isRahkshiBattleSpeciesMesh('Guurahk')).toBe(true);
    expect(isRahkshiBattleSpeciesMesh('GuurahkL')).toBe(false);
  });

  test('shows only the overlay matching the active staff breed', () => {
    expect(shouldShowRahkshiBattleSpeciesMesh('Guurahk', 'Guurahk')).toBe(true);
    expect(shouldShowRahkshiBattleSpeciesMesh('Guurahk', 'Turahk')).toBe(false);
    expect(shouldShowRahkshiBattleSpeciesMesh('Panrahk', 'Panrahk')).toBe(true);
  });
});
