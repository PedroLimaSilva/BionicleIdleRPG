import {
  CUSTOM_SELECTABLE_MATA_MODEL_IDS,
  DEFAULT_CUSTOM_MATA_MODEL_ID,
  isValidCustomMataModelId,
  mataModelUsesKitPlayerPalette,
  resolveToaMataBuildId,
} from './customMataBuild';

describe('customMataBuild', () => {
  test('resolveToaMataBuildId uses dex id for canon characters', () => {
    expect(resolveToaMataBuildId({ id: 'Toa_Gali' })).toBe('Toa_Gali');
  });

  test('resolveToaMataBuildId falls back for custom characters', () => {
    expect(resolveToaMataBuildId({ id: 'custom_0' })).toBe(DEFAULT_CUSTOM_MATA_MODEL_ID);
    expect(resolveToaMataBuildId({ customMataModelId: 'Toa_Lewa', id: 'custom_0' })).toBe(
      'Toa_Lewa'
    );
  });

  test('isValidCustomMataModelId', () => {
    expect(isValidCustomMataModelId('Toa_Onua')).toBe(true);
    expect(isValidCustomMataModelId('not_a_toa')).toBe(false);
  });

  test('mataModelUsesKitPlayerPalette', () => {
    expect(mataModelUsesKitPlayerPalette('Toa_Tahu')).toBe(true);
    expect(mataModelUsesKitPlayerPalette('Toa_Kopaka')).toBe(false);
  });

  test('CUSTOM_SELECTABLE_MATA_MODEL_IDS lists six Mata', () => {
    expect(CUSTOM_SELECTABLE_MATA_MODEL_IDS).toHaveLength(6);
  });
});
