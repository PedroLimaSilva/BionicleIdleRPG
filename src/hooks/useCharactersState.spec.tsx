/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCharactersState } from './useCharactersState';
import { ListedCharacterData, RecruitedCharacterData, Mask } from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';

describe('useCharactersState', () => {
  let mockProtodermis = 1000;
  const mockSetProtodermis = jest.fn((amount: number) => {
    mockProtodermis = amount;
  });

  beforeEach(() => {
    mockSetProtodermis.mockClear();
    mockProtodermis = 1000;
    global.alert = jest.fn();
  });

  describe('initialization', () => {
    test('initializes with provided recruited and buyable characters', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ id: 'Jala', exp: 100 }];
      const initialBuyable: ListedCharacterData[] = [{ id: 'Hahli', cost: 50 }];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, initialBuyable, mockProtodermis, mockSetProtodermis)
      );

      expect(result.current.recruitedCharacters).toEqual(initialRecruited);
      expect(result.current.buyableCharacters).toEqual(initialBuyable);
    });

    test('filters out already recruited characters from buyable list', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ id: 'Jala', exp: 100 }];
      const initialBuyable: ListedCharacterData[] = [
        { id: 'Jala', cost: 50 },
        { id: 'Hahli', cost: 50 },
      ];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, initialBuyable, mockProtodermis, mockSetProtodermis)
      );

      expect(result.current.buyableCharacters).toHaveLength(1);
      expect(result.current.buyableCharacters[0].id).toBe('Hahli');
    });
  });

  describe('recruitCharacter', () => {
    test('recruits character when enough protodermis', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
      };
      const initialBuyable: ListedCharacterData[] = [character];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, initialBuyable, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(mockSetProtodermis).toHaveBeenCalledWith(900);
      expect(result.current.recruitedCharacters).toHaveLength(1);
      expect(result.current.recruitedCharacters[0]).toEqual({ id: 'Jala', exp: 0 });
      expect(result.current.buyableCharacters).toHaveLength(0);
    });

    test('does not recruit when insufficient protodermis', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 2000,
      };
      const initialBuyable: ListedCharacterData[] = [character];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, initialBuyable, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(result.current.recruitedCharacters).toHaveLength(0);
      expect(result.current.buyableCharacters).toHaveLength(1);
    });

    test('recruits character and deducts only protodermis cost', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = {
        id: 'Jala',
        cost: 100,
      };
      const initialBuyable: ListedCharacterData[] = [character];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, initialBuyable, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(mockSetProtodermis).toHaveBeenCalledWith(900);
      expect(result.current.recruitedCharacters).toHaveLength(1);
    });
  });

  describe('assignJobToMatoran', () => {
    test('assigns job to specific matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [
        { id: 'Jala', exp: 0 },
        { id: 'Hahli', exp: 0 },
      ];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.assignJobToMatoran('Jala', MatoranJob.CharcoalMaker);
      });

      expect(result.current.recruitedCharacters[0].assignment).toBeDefined();
      expect(result.current.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(result.current.recruitedCharacters[1].assignment).toBeUndefined();
    });

    test('sets correct exp rate based on productivity modifier', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ id: 'Jala', exp: 0 }];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.assignJobToMatoran('Jala', MatoranJob.CharcoalMaker);
      });

      // Jala is Fire element, CharcoalMaker favors Fire (1.2x modifier)
      expect(result.current.recruitedCharacters[0].assignment?.expRatePerSecond).toBe(1.2);
    });
  });

  describe('removeJobFromMatoran', () => {
    test('removes job from matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [
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

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.removeJobFromMatoran('Jala');
      });

      expect(result.current.recruitedCharacters[0].assignment).toBeUndefined();
    });

    test('does not affect matoran without job', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ id: 'Jala', exp: 100 }];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.removeJobFromMatoran('Jala');
      });

      expect(result.current.recruitedCharacters[0]).toEqual({ id: 'Jala', exp: 100 });
    });
  });

  describe('setMaskOverride', () => {
    test('sets mask override for specific matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ id: 'Jala', exp: 0 }];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.setMaskOverride('Jala', Mask.Hau);
      });

      expect(result.current.recruitedCharacters[0].maskOverride).toBe(Mask.Hau);
    });

    test('does not affect other matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [
        { id: 'Jala', exp: 0 },
        { id: 'Hahli', exp: 0 },
      ];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.setMaskOverride('Jala', Mask.Hau);
      });

      expect(result.current.recruitedCharacters[1].maskOverride).toBeUndefined();
    });
  });
});
