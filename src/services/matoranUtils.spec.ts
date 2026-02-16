import {
  isMatoran,
  isToa,
  isToaMata,
  recruitMatoran,
  assignJob,
  removeJob,
  masksCollected,
} from './matoranUtils';
import {
  BaseMatoran,
  ListedCharacterData,
  MatoranStage,
  RecruitedCharacterData,
  ElementTribe,
  Mask,
} from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { GameItemId } from '../data/loot';
import { LegoColor } from '../types/Colors';

const MOCK_COLORS = {
  face: LegoColor.LightGray,
  mask: LegoColor.Black,
  body: LegoColor.Black,
  feet: LegoColor.Black,
  arms: LegoColor.Black,
  eyes: LegoColor.Black,
};

describe('matoranUtils', () => {
  describe('isMatoran', () => {
    test('returns true for Diminished stage', () => {
      const matoran: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.Diminished,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns true for Rebuilt stage', () => {
      const matoran: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.Rebuilt,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns true for Metru stage', () => {
      const matoran: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.Metru,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isMatoran(matoran)).toBe(true);
    });

    test('returns false for ToaMata stage', () => {
      const toa: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.ToaMata,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isMatoran(toa)).toBe(false);
    });
  });

  describe('isToaMata', () => {
    test('returns true for ToaMata stage', () => {
      const toa: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.ToaMata,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isToaMata(toa)).toBe(true);
    });

    test('returns false for Matoran stages', () => {
      const matoran: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.Diminished,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isToaMata(matoran)).toBe(false);
    });
  });

  describe('isToa', () => {
    test('returns true for ToaMata', () => {
      const toa: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.ToaMata,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isToa(toa)).toBe(true);
    });

    test('returns false for Matoran', () => {
      const matoran: BaseMatoran = {
        id: 'test',
        name: 'Test',
        element: ElementTribe.Fire,
        stage: MatoranStage.Diminished,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
      };
      expect(isToa(matoran)).toBe(false);
    });
  });

  describe('recruitMatoran', () => {
    const mockAddItem = jest.fn();

    beforeEach(() => {
      mockAddItem.mockClear();
      // Mock alert to prevent console output during tests
      global.alert = jest.fn();
    });

    test('recruits character when enough widgets', () => {
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
        requiredItems: [],
      };
      const buyableCharacters: ListedCharacterData[] = [character];

      const result = recruitMatoran(character, 150, buyableCharacters, mockAddItem);

      expect(result.updatedWidgets).toBe(50);
      expect(result.newRecruit).toEqual({ id: 'Jala', exp: 0 });
      expect(result.updatedBuyable).toHaveLength(0);
    });

    test('fails to recruit when not enough widgets', () => {
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
        requiredItems: [],
      };
      const buyableCharacters: ListedCharacterData[] = [character];

      const result = recruitMatoran(character, 50, buyableCharacters, mockAddItem);

      expect(result.updatedWidgets).toBe(50);
      expect(result.newRecruit).toBeNull();
      expect(result.updatedBuyable).toEqual(buyableCharacters);
      expect(global.alert).toHaveBeenCalledWith('Not enough widgets!');
    });

    test('removes recruited character from buyable list', () => {
      const character1: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
        requiredItems: [],
      };
      const character2: ListedCharacterData = {
        id: 'Hali',
        cost: 100,
        requiredItems: [],
      };
      const buyableCharacters: ListedCharacterData[] = [character1, character2];

      const result = recruitMatoran(character1, 150, buyableCharacters, mockAddItem);

      expect(result.updatedBuyable).toHaveLength(1);
      expect(result.updatedBuyable[0].id).toBe('Hali');
    });

    test('consumes required items when recruiting', () => {
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
        requiredItems: [
          { item: GameItemId.LightStone, quantity: 5 },
          { item: GameItemId.Charcoal, quantity: 3 },
        ],
      };
      const buyableCharacters: ListedCharacterData[] = [character];

      recruitMatoran(character, 150, buyableCharacters, mockAddItem);

      expect(mockAddItem).toHaveBeenCalledWith(GameItemId.LightStone, -5);
      expect(mockAddItem).toHaveBeenCalledWith(GameItemId.Charcoal, -3);
    });
  });

  describe('assignJob', () => {
    test('assigns job to specific matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        { id: 'Jala', exp: 0 },
        { id: 'Hali', exp: 0 },
      ];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      expect(result[0].assignment).toBeDefined();
      expect(result[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(result[1].assignment).toBeUndefined();
    });

    test('sets correct exp rate based on productivity modifier', () => {
      const matoran: RecruitedCharacterData[] = [{ id: 'Jala', exp: 0 }];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      // Jala is Fire element, CharcoalMaker favors Fire (1.2x modifier)
      // Base rate is 1, so 1 * 1.2 = 1.2
      expect(result[0].assignment?.expRatePerSecond).toBe(1.2);
    });

    test('sets assignedAt timestamp', () => {
      const matoran: RecruitedCharacterData[] = [{ id: 'Jala', exp: 0 }];
      const beforeTime = Date.now();

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      const afterTime = Date.now();
      expect(result[0].assignment?.assignedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(result[0].assignment?.assignedAt).toBeLessThanOrEqual(afterTime);
    });

    test('does not modify other matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        { id: 'Jala', exp: 100 },
        { id: 'Hali', exp: 200 },
      ];

      const result = assignJob('Jala', MatoranJob.CharcoalMaker, matoran);

      expect(result[1]).toEqual({ id: 'Hali', exp: 200 });
    });
  });

  describe('removeJob', () => {
    test('removes job from specific matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: 1.2,
            assignedAt: Date.now(),
          },
        },
      ];

      const result = removeJob('Jala', matoran);

      expect(result[0].assignment).toBeUndefined();
    });

    test('does not modify matoran without assignment', () => {
      const matoran: RecruitedCharacterData[] = [{ id: 'Jala', exp: 0 }];

      const result = removeJob('Jala', matoran);

      expect(result[0]).toEqual({ id: 'Jala', exp: 0 });
    });

    test('does not modify other matoran', () => {
      const matoran: RecruitedCharacterData[] = [
        {
          id: 'Jala',
          exp: 0,
          assignment: {
            job: MatoranJob.CharcoalMaker,
            expRatePerSecond: 1.2,
            assignedAt: Date.now(),
          },
        },
        {
          id: 'Hali',
          exp: 0,
          assignment: {
            job: MatoranJob.AlgaeHarvester,
            expRatePerSecond: 1.2,
            assignedAt: Date.now(),
          },
        },
      ];

      const result = removeJob('Jala', matoran);

      expect(result[1].assignment).toBeDefined();
      expect(result[1].assignment?.job).toBe(MatoranJob.AlgaeHarvester);
    });
  });

  describe('masksCollected', () => {
    const mockToa: BaseMatoran = {
      id: 'Toa_Tahu',
      name: 'Tahu',
      element: ElementTribe.Fire,
      stage: MatoranStage.ToaMata,
      mask: Mask.Hau,
      colors: MOCK_COLORS,
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
  });
});
