/**
 * @jest-environment jsdom
 */
import {
  encodeCustomCharacterShare,
  extractRecruitTokenFromShareInput,
  areEquivalentSharedCustomMatoran,
  findSharedCustomCharacterIdentityMatch,
  parseCustomCharacterShare,
  SHARE_QUERY_PARAM,
} from './customCharacterShare';
import { BaseMatoran, ElementTribe, Mask, MatoranStage, MatoranTag } from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import { partPalette, simpleLimbColors } from '../data/dex/partPalettes';

function makeCustom(overrides: Partial<BaseMatoran> = {}): BaseMatoran {
  return {
    colors: simpleLimbColors({
      arms: LegoColor.Blue,
      body: LegoColor.Blue,
      eyes: LegoColor.TransNeonOrange,
      face: LegoColor.DarkGray,
      feet: LegoColor.Yellow,
      mask: LegoColor.Blue,
    }),
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

function encodeRaw(payload: unknown): string {
  return encodeCustomCharacterShare(payload as BaseMatoran);
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

    it('round-trips optional weapon and legs palettes', () => {
      const original = makeCustom({
        colors: {
          ...makeCustom().colors,
          legs: partPalette(LegoColor.LightGray, { secondary: LegoColor.White }),
          weapon: partPalette(LegoColor.FlatDarkGold, { glow: LegoColor.TransNeonGreen }),
        },
        mask: Mask.KaukauNuva,
        stage: MatoranStage.ToaNuva,
      });
      const parsed = parseCustomCharacterShare(encodeCustomCharacterShare(original));
      expect(parsed).not.toBeNull();
      expect(parsed!.colors.weapon?.glow).toBe(LegoColor.TransNeonGreen);
      expect(parsed!.colors.legs?.main).toBe(LegoColor.LightGray);
    });

    it('expands legacy flat tokens including weaponGlow/metal/joints', () => {
      const token = encodeRaw({
        colors: {
          arms: LegoColor.Orange,
          body: LegoColor.Red,
          eyes: LegoColor.TransNeonRed,
          face: LegoColor.LightGray,
          feet: LegoColor.Red,
          joints: LegoColor.DarkBluishGray,
          mask: LegoColor.Red,
          metal: LegoColor.FlatDarkGold,
          weaponGlow: LegoColor.Orange,
        },
        element: ElementTribe.Fire,
        id: 'custom_0',
        isMaskTransparent: false,
        kitSlotMap: {
          arms: { Main: 'joints', Secondary: 'body' },
        },
        mask: Mask.HauGreat,
        name: 'Legacy',
        stage: MatoranStage.ToaMetru,
        tags: [MatoranTag.Custom],
      });
      const parsed = parseCustomCharacterShare(token);
      expect(parsed).not.toBeNull();
      expect(parsed!.colors.body.main).toBe(LegoColor.Red);
      expect(parsed!.colors.arms.main).toBe(LegoColor.DarkBluishGray);
      expect(parsed!.colors.arms.secondary).toBe(LegoColor.Orange);
      expect(parsed!.colors.arms.metal).toBe(LegoColor.FlatDarkGold);
      expect(parsed!.colors.weapon?.glow).toBe(LegoColor.Orange);
      expect((parsed as { kitSlotMap?: unknown }).kitSlotMap).toBeUndefined();
    });

    it('parses legacy tokens that omit optional extras', () => {
      const token = encodeRaw({
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
      });
      const parsed = parseCustomCharacterShare(token);
      expect(parsed).not.toBeNull();
      expect(parsed!.colors.body).toEqual({ main: LegoColor.Blue });
      expect(parsed!.colors.arms).toEqual({ main: LegoColor.Blue });
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

    it('rejects a mask that does not match the rig stage', () => {
      const token = encodeCustomCharacterShare(
        makeCustom({ mask: Mask.HauGreat, stage: MatoranStage.Diminished })
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

    it('rejects payloads with invalid weapon palette type', () => {
      const token = encodeRaw({
        ...makeCustom(),
        colors: { ...makeCustom().colors, weapon: 123 },
      });
      expect(parseCustomCharacterShare(token)).toBeNull();
    });

    it('ignores leftover kitSlotMap instead of rejecting the token', () => {
      const token = encodeRaw({
        ...makeCustom(),
        kitSlotMap: { wings: { Main: 'body' } },
      });
      const parsed = parseCustomCharacterShare(token);
      expect(parsed).not.toBeNull();
      expect(parsed!.name).toBe('Pridak');
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

  describe('extractRecruitTokenFromShareInput', () => {
    it('extracts token from a full URL', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      const url = `https://example.org/BionicleIdleRPG/?${SHARE_QUERY_PARAM}=${token}`;
      expect(extractRecruitTokenFromShareInput(url)).toBe(token);
    });

    it('extracts token from a path-only URL fragment', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      const path = `/BionicleIdleRPG/?${SHARE_QUERY_PARAM}=${token}`;
      expect(extractRecruitTokenFromShareInput(path)).toBe(token);
    });

    it('extracts token after other query params', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      const url = `https://x.test/app?foo=1&${SHARE_QUERY_PARAM}=${token}`;
      expect(extractRecruitTokenFromShareInput(url)).toBe(token);
    });

    it('decodes percent-encoded token values', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      const encoded = encodeURIComponent(token);
      const url = `https://x.test/?${SHARE_QUERY_PARAM}=${encoded}`;
      expect(extractRecruitTokenFromShareInput(url)).toBe(token);
    });

    it('returns raw token when pasted alone', () => {
      const token = encodeCustomCharacterShare(makeCustom());
      expect(extractRecruitTokenFromShareInput(`  ${token}  `)).toBe(token);
    });

    it('returns null for unrelated strings', () => {
      expect(extractRecruitTokenFromShareInput('https://example.com/')).toBeNull();
      expect(extractRecruitTokenFromShareInput('')).toBeNull();
      expect(extractRecruitTokenFromShareInput('short')).toBeNull();
    });
  });

  describe('areEquivalentSharedCustomMatoran', () => {
    it('returns true for same design with different ids', () => {
      const a = makeCustom({ id: 'custom_0' });
      const b = makeCustom({ id: 'custom_99' });
      expect(areEquivalentSharedCustomMatoran(a, b)).toBe(true);
    });

    it('returns false when mask differs', () => {
      const a = makeCustom({ id: 'custom_0' });
      const b = makeCustom({ id: 'custom_0', mask: Mask.Hau });
      expect(areEquivalentSharedCustomMatoran(a, b)).toBe(false);
    });

    it('treats a legacy flat palette as equal to its expanded form', () => {
      const expanded = makeCustom({ stage: MatoranStage.Diminished });
      const legacy = {
        ...expanded,
        colors: {
          arms: LegoColor.Blue,
          body: LegoColor.Blue,
          eyes: LegoColor.TransNeonOrange,
          face: LegoColor.DarkGray,
          feet: LegoColor.Yellow,
          mask: LegoColor.Blue,
        },
      } as unknown as BaseMatoran;
      expect(areEquivalentSharedCustomMatoran(expanded, legacy)).toBe(true);
    });

    it('treats optional weapon glow consistently', () => {
      const base = makeCustom({ mask: Mask.HauNuva, stage: MatoranStage.ToaNuva });
      const withGlow = makeCustom({
        colors: {
          ...base.colors,
          weapon: partPalette(LegoColor.Blue, { glow: LegoColor.TransNeonGreen }),
        },
        stage: MatoranStage.ToaNuva,
      });
      const withGlow2 = makeCustom({
        colors: {
          ...base.colors,
          weapon: partPalette(LegoColor.Blue, { glow: LegoColor.TransNeonGreen }),
        },
        id: 'custom_5',
        stage: MatoranStage.ToaNuva,
      });
      expect(areEquivalentSharedCustomMatoran(withGlow, withGlow2)).toBe(true);
      expect(areEquivalentSharedCustomMatoran(base, withGlow)).toBe(false);
    });
  });

  describe('findSharedCustomCharacterIdentityMatch', () => {
    it('finds a matching entry ignoring id', () => {
      const stored = makeCustom({ id: 'custom_1', name: 'Zaktan' });
      const incoming = makeCustom({ id: 'custom_0', name: 'Zaktan' });
      expect(findSharedCustomCharacterIdentityMatch([stored], incoming)).toBe(stored);
    });
  });
});
