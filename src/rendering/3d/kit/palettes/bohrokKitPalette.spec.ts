import { BRAIN_EMISSIVE_INTENSITY, CRYSTAL_BRAIN_SLOT } from './brainKitPalette';
import { BOHROK_KIT_PALETTE_EYE, BOHROK_SWARM_FACEPLATE_PALETTE } from './bohrokKitPalette';

describe('bohrokKitPalette', () => {
  test('eye Brain is crystal and Glowing Eyes stay emissive-only', () => {
    expect(BOHROK_KIT_PALETTE_EYE.Brain).toBe(CRYSTAL_BRAIN_SLOT);
    expect(BOHROK_KIT_PALETTE_EYE.Brain).toEqual(
      expect.objectContaining({
        emissiveIntensity: BRAIN_EMISSIVE_INTENSITY,
        transmissive: 'crystal',
        weathered: false,
      })
    );
    expect(BOHROK_KIT_PALETTE_EYE['Glowing Eyes']).toEqual(
      expect.objectContaining({
        emissive: { key: 'eyes', kind: 'palette' },
        emissiveIntensity: 5,
        weathered: false,
      })
    );
    expect(BOHROK_KIT_PALETTE_EYE['Glowing Eyes']).not.toHaveProperty('transmissive');
  });

  test('swarm faceplate Clear slots are colorless trans-clear without a tint source', () => {
    expect(BOHROK_SWARM_FACEPLATE_PALETTE.CLEAR).toEqual({
      transmissive: 'clear',
      weathered: false,
    });
    expect(BOHROK_SWARM_FACEPLATE_PALETTE.Clear).toBe(BOHROK_SWARM_FACEPLATE_PALETTE.CLEAR);
    expect(BOHROK_SWARM_FACEPLATE_PALETTE.CLEAR).not.toHaveProperty('color');
    expect(BOHROK_SWARM_FACEPLATE_PALETTE.CLEAR).not.toHaveProperty('emissive');
  });
});
