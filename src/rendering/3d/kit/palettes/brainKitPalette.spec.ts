import {
  BRAIN_EMISSIVE_INTENSITY,
  KIT_PALETTE_BRAIN,
  MCTORAN_FACE_BRAIN_SLOT,
} from './brainKitPalette';
import { MATA_KIT_PLAYER_PALETTE_BRAIN } from './mataKitPlayerPalette';

describe('brainKitPalette', () => {
  test('defines transmissive Brain slots with eye tint and low emissive', () => {
    expect(BRAIN_EMISSIVE_INTENSITY).toBe(0.1);
    expect(KIT_PALETTE_BRAIN.Brain).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
        transmissive: 'brain',
        weathered: false,
      })
    );
    expect(MCTORAN_FACE_BRAIN_SLOT).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
        transmissive: 'mctoranFace',
        weathered: false,
      })
    );
  });

  test('MATA_KIT_PLAYER_PALETTE_BRAIN re-exports the Toa brain slot', () => {
    expect(MATA_KIT_PLAYER_PALETTE_BRAIN).toBe(KIT_PALETTE_BRAIN);
  });
});
