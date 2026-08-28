import {
  BRAIN_BAKED_EMISSIVE_INTENSITY,
  KIT_PALETTE_BRAIN_BAKED,
  MCTORAN_FACE_BRAIN_SLOT,
} from './brainKitPalette';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from './mataKitPlayerPalette';

describe('brainKitPalette', () => {
  test('brain slots use modest emissive intensity and transmissive presets', () => {
    expect(BRAIN_BAKED_EMISSIVE_INTENSITY).toBe(0.1);
    expect(KIT_PALETTE_BRAIN_BAKED.Brain).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
        transmissive: 'brain',
        weathered: false,
      })
    );
    expect(MCTORAN_FACE_BRAIN_SLOT).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_BAKED_EMISSIVE_INTENSITY,
        transmissive: 'mctoranFace',
        weathered: false,
      })
    );
  });

  test('MATA_KIT_PLAYER_PALETTE_BRAIN re-exports the Toa brain slot', () => {
    expect(MATA_KIT_PLAYER_PALETTE_BRAIN).toBe(KIT_PALETTE_BRAIN_BAKED);
  });
});
