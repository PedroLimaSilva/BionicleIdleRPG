import {
  isRahkshiBattleSpeciesMesh,
  shouldShowRahkshiBattleSpeciesMesh,
} from './rahkshiBattleMeshes';

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
