import {
  applySelectiveBloomMrt,
  clearSelectiveBloomMrt,
  isSelectiveBloomKitGlowName,
  isSelectiveBloomRahkshiEyeName,
  shouldSelectiveBloomTransmissiveKind,
} from './selectiveBloom';

describe('selectiveBloom selection', () => {
  test('kit Glow blooms and Glowing Eyes do not', () => {
    expect(isSelectiveBloomKitGlowName('Glow')).toBe(true);
    expect(isSelectiveBloomKitGlowName('Matatu Glow')).toBe(true);
    expect(isSelectiveBloomKitGlowName('Glowing Eyes')).toBe(false);
    expect(isSelectiveBloomKitGlowName('Main')).toBe(false);
  });

  test('Rahkshi Eyes bloom and Kanohi Glowing Eyes do not', () => {
    expect(isSelectiveBloomRahkshiEyeName('Eyes')).toBe(true);
    expect(isSelectiveBloomRahkshiEyeName('eyes')).toBe(true);
    expect(isSelectiveBloomRahkshiEyeName('Glowing Eyes')).toBe(false);
    expect(isSelectiveBloomRahkshiEyeName('Glow')).toBe(false);
    expect(isSelectiveBloomRahkshiEyeName(undefined)).toBe(false);
  });

  test('only transmissive brain gel and crystal are selected, not visors', () => {
    expect(shouldSelectiveBloomTransmissiveKind('brain')).toBe(true);
    expect(shouldSelectiveBloomTransmissiveKind('crystal')).toBe(true);
    expect(shouldSelectiveBloomTransmissiveKind('clear')).toBe(false);
    expect(shouldSelectiveBloomTransmissiveKind('mctoranFace')).toBe(false);
    expect(shouldSelectiveBloomTransmissiveKind('vahkiHood')).toBe(false);
    expect(shouldSelectiveBloomTransmissiveKind(undefined)).toBe(false);
  });

  test('applySelectiveBloomMrt writes an MRT mask', () => {
    const mat: { mrtNode?: unknown; name: string } = { name: 'Glow' };
    applySelectiveBloomMrt(mat);
    expect(mat.mrtNode).toBeDefined();
  });

  test('clearSelectiveBloomMrt drops the MRT mask', () => {
    const mat: { mrtNode?: unknown; name: string } = { name: 'Glow' };
    applySelectiveBloomMrt(mat);
    clearSelectiveBloomMrt(mat);
    expect(mat.mrtNode).toBeUndefined();
  });
});
