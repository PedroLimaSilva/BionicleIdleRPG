import { isRahkshiVariantMesh, shouldShowRahkshiVariantMesh } from './rahkshiVariantMeshes';

describe('rahkshi variant mesh visibility', () => {
  test('identifies variant mesh names', () => {
    expect(isRahkshiVariantMesh('TurahkL')).toBe(true);
    expect(isRahkshiVariantMesh('Rahkshi')).toBe(false);
  });

  test('shows only meshes matching the active staff prefix', () => {
    expect(shouldShowRahkshiVariantMesh('TurahkL', 'Turahk')).toBe(true);
    expect(shouldShowRahkshiVariantMesh('GuurahkS', 'Turahk')).toBe(false);
    expect(shouldShowRahkshiVariantMesh('GuurahkS', 'Guurahk')).toBe(true);
  });

  test('switching staff types re-enables previously hidden meshes', () => {
    expect(shouldShowRahkshiVariantMesh('PanrahkR', 'Turahk')).toBe(false);
    expect(shouldShowRahkshiVariantMesh('PanrahkR', 'Panrahk')).toBe(true);
  });
});
