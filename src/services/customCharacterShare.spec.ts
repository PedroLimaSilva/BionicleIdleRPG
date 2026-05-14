/**
 * @jest-environment jsdom
 */
import {
  encodeCustomCharacterShare,
  parseCustomCharacterShare,
  SHARE_QUERY_PARAM,
} from './customCharacterShare';
import { BaseMatoran, ElementTribe, Mask, MatoranStage, MatoranTag } from '../types/Matoran';
import { LegoColor } from '../types/Colors';

function makeCustom(overrides: Partial<BaseMatoran> = {}): BaseMatoran {
  return {
    colors: {
      arms: LegoColor.Blue,
      body: LegoColor.Blue,
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.DarkGray,
      feet: LegoColor.Yellow,
      mask: LegoColor.Blue,
    },
    element: ElementTribe.Water,
    id: 'custom_0',
    isMaskTransparent: false,
    mask: Mask.Kaukau,
    name: 'Pridak',
    stage: MatoranStage.Diminished,
    tags: [MatoranTag.Custom],
    ...overrides,
  };
}

describe('customCharacterShare', () => {
  describe('encode / parse round-trip', () => {
    it('returns an equivalent BaseMatoran', () => {
      const original = makeCustom();
      const token = encodeCustomCharacterShare(original);
      const parsed = parseCustomCharacterShare(token);

      expect(parsed).not.toBeNull();
      expect(parsed!.id).toBe(original.id);
      expect(parsed!.name).toBe(original.name);
      expect(parsed!.element).toBe(original.element);
      expect(parsed!.mask).toBe(original.mask);
      expect(parsed!.stage).toBe(original.stage);
      expect(parsed!.colors).toEqual(original.colors);
    });

    it('produces URL-safe tokens (no +/= characters)', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      expect(token).not.toMatch(/[+/=]/);
    });
  });

  describe('parseCustomCharacterShare', () => {
    it('rejects non-custom ids to prevent overwriting static dex entries', () => {
      const token = encodeCustomCharacterShare(makeCustom({ id: 'Jala' }));
      expect(parseCustomCharacterShare(token)).toBeNull();
    });

    it('rejects payloads with an invalid mask value', () => {
      const token = encodeCustomCharacterShare(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        makeCustom({ mask: 'NotARealMask' as any })
      );
      expect(parseCustomCharacterShare(token)).toBeNull();
    });

    it('rejects payloads with an invalid element value', () => {
      const token = encodeCustomCharacterShare(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        makeCustom({ element: 'Plasma' as any })
      );
      expect(parseCustomCharacterShare(token)).toBeNull();
    });

    it('rejects malformed base64 tokens', () => {
      expect(parseCustomCharacterShare('!!!notbase64!!!')).toBeNull();
    });

    it('rejects empty names', () => {
      const token = encodeCustomCharacterShare(makeCustom({ name: '   ' }));
      expect(parseCustomCharacterShare(token)).toBeNull();
    });

    it('truncates excessively long names to 32 characters', () => {
      const longName = 'A'.repeat(80);
      const token = encodeCustomCharacterShare(makeCustom({ name: longName }));
      const parsed = parseCustomCharacterShare(token);
      expect(parsed?.name.length).toBe(32);
    });
  });

  it('exposes the expected query param name', () => {
    expect(SHARE_QUERY_PARAM).toBe('recruit');
  });
});
