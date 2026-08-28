import { BRAIN_BAKED_EMISSIVE_INTENSITY, KIT_PALETTE_BRAIN_BAKED } from './brainKitPalette';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from './mataKitPlayerPalette';

describe('brainKitPalette', () => {
  test('brains use Brain slot with modest emissive intensity', () => {
    expect(BRAIN_BAKED_EMISSIVE_INTENSITY).toBe(0.1);
    expect(KIT_PALETTE_BRAIN_BAKED.Brain).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
        weathered: false,
      })
    );
  });

  test('MATA_KIT_PLAYER_PALETTE_BRAIN re-exports the transmissive brain slot', () => {
    expect(MATA_KIT_PLAYER_PALETTE_BRAIN).toBe(KIT_PALETTE_BRAIN_BAKED);
  });
});
