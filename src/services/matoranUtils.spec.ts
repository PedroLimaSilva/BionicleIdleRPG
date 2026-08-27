import { isMatoran, isToa, isToaMata } from '../game/characters/matoranStage';
import { recruitMatoran, assignJob, removeJob, masksCollected } from './matoranUtils';
import {
  BaseMatoran,
  ListedCharacterData,
  MatoranStage,
  RecruitedCharacterData,
  ElementTribe,
  Mask,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { LegoColor } from '../types/Colors';
import { simpleLimbColors } from '../data/dex/partPalettes';

const MOCK_COLORS = simpleLimbColors({
  arms: LegoColor.Black,
  body: LegoColor.Black,
  eyes: LegoColor.Black,
  face: LegoColor.LightGray,
  feet: LegoColor.Black,
  mask: LegoColor.Black,
});

describe('matoranUtils', () => {
  describe('isMatoran', () => {
    test('returns true for Diminished stage', () => {
      const matoran: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.Diminished,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns true for Rebuilt stage', () => {
      const matoran: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.Rebuilt,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns true for Metru stage', () => {
      const matoran: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.Metru,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns false for ToaMata stage', () => {
      const toa: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.ToaMata,
      };
      expect(isMatoran(toa)).toBe(false);
    });
  });

  describe('isToaMata', () => {
    test('returns true for ToaMata stage', () => {
      const toa: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.ToaMata,
      };
      expect(isToaMata(toa)).toBe(true);
    });

    test('returns false for Matoran stages', () => {
      const matoran: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.Diminished,
      };
      expect(isToaMata(matoran)).toBe(false);
    });
  });

  describe('isToa', () => {
    test('returns true for ToaMata', () => {
      const toa: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.ToaMata,
      };
      expect(isToa(toa)).toBe(true);
    });

    test('returns false for Matoran', () => {
      const matoran: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'test',
        mask: Mask.Hau,
        name: 'Test',
        stage: MatoranStage.Diminished,
      };
      expect(isToa(matoran)).toBe(false);
    });
  });

  describe('recruitMatoran', () => {
    test('recruits character when enough protodermis', () => {
      const character: ListedCharacterData = {
        cost: 100,
        id: 'Jala',
      };
      const buyableCharacters: ListedCharacterData[] = [character];

      const result = recruitMatoran(character, 150, buyableCharacters);

      expect(result.updatedProtodermis).toBe(50);
      expect(result.newRecruit).toEqual({ exp: 0, id: 'Jala' });
      expect(result.updatedBuyable).toHaveLength(0);
    });

    test('fails to recruit when not enough protodermis', () => {
      const character: ListedCharacterData = {
        cost: 100,
        id: 'Jala',
      };
      const buyableCharacters: ListedCharacterData[] = [character];

      const result = recruitMatoran(character, 50, buyableCharacters);

      expect(result.updatedProtodermis).toBe(50);
      expect(result.newRecruit).toBeNull();
      expect(result.updatedBuyable).toEqual(buyableCharacters);
    });

    test('removes recruited character from buyable list', () => {
      const character1: ListedCharacterData = {
        cost: 100,
        id: 'Jala',
      };
      const character2: ListedCharacterData = {
        cost: 100,
        id: 'Hahli',
      };
      const buyableCharacters: ListedCharacterData[] = [character1, character2];

      const result = recruitMatoran(character1, 150, buyableCharacters);

      expect(result.updatedBuyable).toHaveLength(1);
      expect(result.updatedBuyable[0].id).toBe('Hahli');
    });
  });

  describe('assignJob', () => {
    test('assigns job to specific matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        { exp: 0, id: 'Jala' },
        { exp: 0, id: 'Hahli' },
      ];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      expect(result[0].assignment).toBeDefined();
      expect(result[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(result[1].assignment).toBeUndefined();
    });

    test('sets correct exp rate based on productivity modifier', () => {
      const matoran: RecruitedCharacterData[] = [{ exp: 0, id: 'Jala' }];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      // Jala is Fire element, CharcoalMaker favors Fire (1.2x modifier)
      // Base rate is 1, so 1 * 1.2 = 1.2
      expect(result[0].assignment?.expRatePerSecond).toBe(1.2);
    });

    test('sets assignedAt timestamp', () => {
      const matoran: RecruitedCharacterData[] = [{ exp: 0, id: 'Jala' }];
      const beforeTime = Date.now();

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      const afterTime = Date.now();
      expect(result[0].assignment?.assignedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(result[0].assignment?.assignedAt).toBeLessThanOrEqual(afterTime);
    });

    test('does not modify other matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        { exp: 100, id: 'Jala' },
        { exp: 200, id: 'Hahli' },
      ];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      expect(result[1]).toEqual({ exp: 200, id: 'Hahli' });
    });
  });

  describe('removeJob', () => {
    test('removes job from specific matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        {
          assignment: {
            assignedAt: Date.now(),
            expRatePerSecond: 1.2,
            job: MatoranJob.CharcoalMaker,
          },
          exp: 0,
          id: 'Jala',
        },
      ];

      const result = removeJob('Jala', matoran);

      expect(result[0].assignment).toBeUndefined();
    });

    test('does not modify matoran without assignment', () => {
      const matoran: RecruitedCharacterData[] = [{ exp: 0, id: 'Jala' }];

      const result = removeJob('Jala', matoran);

      expect(result[0]).toEqual({ exp: 0, id: 'Jala' });
    });

    test('does not modify other matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        {
          assignment: {
            assignedAt: Date.now(),
            expRatePerSecond: 1.2,
            job: MatoranJob.CharcoalMaker,
          },
          exp: 0,
          id: 'Jala',
        },
        {
          assignment: {
            assignedAt: Date.now(),
            expRatePerSecond: 1.2,
            job: MatoranJob.AlgaeHarvester,
          },
          exp: 0,
          id: 'Hahli',
        },
      ];

      const result = removeJob('Jala', matoran);

      expect(result[1].assignment).toBeDefined();
      expect(result[1].assignment?.job).toBe(MatoranJob.AlgaeHarvester);
    });
  });

  describe('masksCollected', () => {
    const mockToa: BaseMatoran = {
      colors: MOCK_COLORS,
      element: ElementTribe.Fire,
      id: 'Toa_Tahu',
      mask: Mask.Hau,
      name: 'Tahu',
      stage: MatoranStage.ToaMata,
    };

    test('returns only base mask when no quests completed', () => {
      const masks = masksCollected(mockToa, []);
      expect(masks).toEqual([Mask.Hau]);
    });

    test('returns full mask set when final collection quest is completed', () => {
      const masks = masksCollected(mockToa, ['maskhunt_final_collection']);
      expect(masks).toHaveLength(12);
      expect(masks).toContain(Mask.Hau);
      expect(masks).toContain(Mask.Kaukau);
      expect(masks).toContain(Mask.Miru);
    });

    test('adds Akaku for Tahu when cave quest is completed', () => {
      const masks = masksCollected(mockToa, ['maskhunt_tahu_cave_akaku']);
      expect(masks).toContain(Mask.Hau);
      expect(masks).toContain(Mask.Akaku);
    });

    test('adds multiple masks for multiple quests', () => {
      const masks = masksCollected(mockToa, ['maskhunt_tahu_cave_akaku', 'maskhunt_tahu_miru']);
      expect(masks).toContain(Mask.Hau);
      expect(masks).toContain(Mask.Akaku);
      expect(masks).toContain(Mask.Miru);
    });

    describe('Toa Nuva', () => {
      const mockToaNuva: BaseMatoran = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        id: 'Toa_Tahu_Nuva',
        mask: Mask.HauNuva,
        name: 'Toa Tahu Nuva',
        stage: MatoranStage.ToaNuva,
      };

      test('returns only dex mask when no quests completed', () => {
        const masks = masksCollected(mockToaNuva, []);
        expect(masks).toEqual([Mask.HauNuva]);
      });

      test('custom Toa Nuva only has dex mask even after Kanohi Nuva hunt', () => {
        const custom: BaseMatoran = {
          colors: MOCK_COLORS,
          element: ElementTribe.Fire,
          id: 'custom_0',
          mask: Mask.HauNuva,
          name: 'Custom',
          stage: MatoranStage.ToaNuva,
        };
        expect(masksCollected(custom, ['tales_kanohi_nuva_hunt'])).toEqual([Mask.HauNuva]);
      });

      test('returns only dex mask even when final collection quest is completed', () => {
        const masks = masksCollected(mockToaNuva, ['maskhunt_final_collection']);
        expect(masks).toEqual([Mask.HauNuva]);
      });

      test('returns only dex mask even when mask hunt quests are completed', () => {
        const masks = masksCollected(mockToaNuva, [
          'maskhunt_final_collection',
          'maskhunt_tahu_cave_akaku',
          'maskhunt_tahu_miru',
        ]);
        expect(masks).toEqual([Mask.HauNuva]);
      });

      test('returns only infected mask during the Mask of Light infection period', () => {
        const masks = masksCollected(mockToaNuva, ['mol_fall_of_ta_koro']);
        expect(masks).toEqual([Mask.HauNuvaInfected]);
      });

      test('returns only infected mask during infection even when Vahi is unlocked', () => {
        const masks = masksCollected(mockToaNuva, [
          'bohrok_kal_reconstruction',
          'mol_fall_of_ta_koro',
        ]);
        expect(masks).toEqual([Mask.HauNuvaInfected]);
      });

      test('restores normal mask options after Tahu is healed', () => {
        const masks = masksCollected(mockToaNuva, [
          'bohrok_kal_reconstruction',
          'mol_fall_of_ta_koro',
          'mol_tahu_poisoned',
        ]);
        expect(masks).toEqual([Mask.HauNuva, Mask.Vahi]);
      });
    });

    describe('Toa Metru', () => {
      test('Lhikan only has his Great Hau', () => {
        const lhikan: BaseMatoran = {
          colors: MOCK_COLORS,
          element: ElementTribe.Fire,
          id: 'Toa_Lhikan',
          mask: Mask.HauGreat,
          name: 'Toa Lhikan',
          stage: MatoranStage.ToaMetru,
        };
        expect(masksCollected(lhikan, [])).toEqual([Mask.HauGreat]);
      });
    });
  });
});
