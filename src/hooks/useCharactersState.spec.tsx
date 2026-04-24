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
    test('initializes with provided recruited; buyable derived from completedQuests', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 100, id: 'Jala' }];
      const completedQuests = ['mnog_restore_ga_koro']; // unlocks Hahli

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      expect(result.current.recruitedCharacters).toEqual(initialRecruited);
      expect(result.current.buyableCharacters).toContainEqual({ cost: 1000, id: 'Hahli' });
    });

    test('filters out already recruited characters from buyable list (incl. evolution line)', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 100, id: 'Jala' }];
      const completedQuests = ['mnog_tahu_unlock_01', 'mnog_restore_ga_koro']; // Jala + Hahli

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      expect(result.current.buyableCharacters).toHaveLength(1);
      expect(result.current.buyableCharacters[0].id).toBe('Hahli');
    });
  });

  describe('recruitCharacter', () => {
    test('recruits character when enough protodermis', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = { cost: 2000, id: 'Jala' };
      const completedQuests = ['mnog_tahu_unlock_01']; // unlocks Jala (cost 2000 in registry)
      const protodermis = 3000;

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, protodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(mockSetProtodermis).toHaveBeenCalledWith(1000);
      expect(result.current.recruitedCharacters).toHaveLength(1);
      expect(result.current.recruitedCharacters[0]).toEqual({ exp: 0, id: 'Jala' });
      expect(result.current.buyableCharacters.some((c) => c.id === 'Jala')).toBe(false);
    });

    test('does not recruit when insufficient protodermis', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = { cost: 2000, id: 'Jala' };
      const completedQuests = ['mnog_tahu_unlock_01'];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(result.current.recruitedCharacters).toHaveLength(0);
      expect(result.current.buyableCharacters.some((c) => c.id === 'Jala')).toBe(true);
    });

    test('recruits character and deducts only protodermis cost', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = { cost: 2000, id: 'Jala' };
      const completedQuests = ['mnog_tahu_unlock_01'];
      const protodermis = 3000;

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, protodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(mockSetProtodermis).toHaveBeenCalledWith(1000);
      expect(result.current.recruitedCharacters).toHaveLength(1);
    });
  });

  describe('assignJobToMatoran', () => {
    test('assigns job to specific matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [
        { exp: 0, id: 'Jala' },
        { exp: 0, id: 'Hahli' },
      ];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.assignJobToMatoran('Jala', MatoranJob.CharcoalMaker);
      });

      expect(result.current.recruitedCharacters[0].assignment).toBeDefined();
      expect(result.current.recruitedCharacters[0].assignment?.job).toBe(MatoranJob.CharcoalMaker);
      expect(result.current.recruitedCharacters[1].assignment).toBeUndefined();
    });

    test('sets correct exp rate based on productivity modifier', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 0, id: 'Jala' }];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
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
          assignment: {
            assignedAt: Date.now(),
            expRatePerSecond: 1.2,
            job: MatoranJob.CharcoalMaker,
          },
          exp: 0,
          id: 'Jala',
        },
      ];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.removeJobFromMatoran('Jala');
      });

      expect(result.current.recruitedCharacters[0].assignment).toBeUndefined();
    });

    test('does not affect matoran without job', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 100, id: 'Jala' }];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.removeJobFromMatoran('Jala');
      });

      expect(result.current.recruitedCharacters[0]).toEqual({ exp: 100, id: 'Jala' });
    });
  });

  describe('setMaskOverride', () => {
    test('sets mask override for specific matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 0, id: 'Jala' }];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.setMaskOverride('Jala', Mask.Hau);
      });

      expect(result.current.recruitedCharacters[0].maskOverride).toBe(Mask.Hau);
    });

    test('does not affect other matoran', () => {
      const initialRecruited: RecruitedCharacterData[] = [
        { exp: 0, id: 'Jala' },
        { exp: 0, id: 'Hahli' },
      ];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, completedQuests, mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.setMaskOverride('Jala', Mask.Hau);
      });

      expect(result.current.recruitedCharacters[1].maskOverride).toBeUndefined();
    });
  });
});
