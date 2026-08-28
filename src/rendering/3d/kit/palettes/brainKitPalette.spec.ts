import {
  BRAIN_BAKED_EMISSIVE_INTENSITY,
  KIT_PALETTE_BRAIN_BAKED,
  MATA_KIT_PALETTE_BRAIN_BAKED,
  METRU_KIT_PALETTE_BRAIN_BAKED,
} from './brainKitPalette';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from './mataKitPlayerPalette';

describe('brainKitPalette', () => {
  test('baked brains use a modest emissive intensity instead of the GLB default of 1', () => {
    expect(BRAIN_BAKED_EMISSIVE_INTENSITY).toBe(0.1);
    expect(MATA_KIT_PALETTE_BRAIN_BAKED.MataBrain_baked).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
        weathered: false,
      })
    );
    expect(METRU_KIT_PALETTE_BRAIN_BAKED.MetruBrain_baked).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
        weathered: false,
      })
    );
  });

  test('MATA_KIT_PLAYER_PALETTE_BRAIN re-exports the combined baked brain slots', () => {
    expect(MATA_KIT_PLAYER_PALETTE_BRAIN).toBe(KIT_PALETTE_BRAIN_BAKED);
  });
});
