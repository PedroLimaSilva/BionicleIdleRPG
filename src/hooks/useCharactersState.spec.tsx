/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useCharactersState } from './useCharactersState';
import {
  BaseMatoran,
  ListedCharacterData,
  Mask,
  MatoranStage,
  MatoranTag,
  RecruitedCharacterData,
  ElementTribe,
} from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import { DEFAULT_CUSTOM_COLORS, simpleLimbColors } from '../data/dex/partPalettes';
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
      );

      expect(result.current.recruitedCharacters).toEqual(initialRecruited);
      expect(result.current.buyableCharacters).toContainEqual({ cost: 1000, id: 'Hahli' });
    });

    test('filters out already recruited characters from buyable list (incl. evolution line)', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 100, id: 'Jala' }];
      const completedQuests = ['mnog_tahu_unlock_01', 'mnog_restore_ga_koro']; // Jala + Hahli

      const { result } = renderHook(() =>
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
      );

      // Buyable list always includes the "create custom matoran" sentinel entry plus other recruits.
      const nonCreate = result.current.buyableCharacters.filter(
        (c) => c.id !== 'create_custom_matoran'
      );
      expect(nonCreate).toHaveLength(1);
      expect(nonCreate[0].id).toBe('Hahli');
    });
  });

  describe('recruitCharacter', () => {
    test('recruits character when enough protodermis', () => {
      const initialRecruited: RecruitedCharacterData[] = [];
      const character: ListedCharacterData = { cost: 2000, id: 'Jala' };
      const completedQuests = ['mnog_tahu_unlock_01']; // unlocks Jala (cost 2000 in registry)
      const protodermis = 3000;

      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [], completedQuests, protodermis, mockSetProtodermis)
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(initialRecruited, [], completedQuests, protodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.recruitCharacter(character);
      });

      expect(mockSetProtodermis).toHaveBeenCalledWith(1000);
      expect(result.current.recruitedCharacters).toHaveLength(1);
    });
  });

  describe('createCustomCharacter', () => {
    const baseMinusId = (stage: MatoranStage): Omit<BaseMatoran, 'id'> => ({
      colors: DEFAULT_CUSTOM_COLORS,
      element: ElementTribe.Fire,
      mask: Mask.Hau,
      name: 'Test',
      stage,
      tags: [MatoranTag.Custom],
    });

    test('stores customMataModelId on recruit when creating at Toa Mata', () => {
      const { result } = renderHook(() =>
        useCharactersState([], [], [], mockProtodermis, mockSetProtodermis)
      );

      let id: string | null = null;
      act(() => {
        id = result.current.createCustomCharacter(baseMinusId(MatoranStage.ToaMata), {
          customMataModelId: 'Toa_Gali',
        });
      });

      expect(id).toBe('custom_0');
      expect(result.current.recruitedCharacters[0].customMataModelId).toBe('Toa_Gali');
      expect(result.current.customCharacters[0].stage).toBe(MatoranStage.ToaMata);
    });

    test('defaults customMataModelId when Toa Mata extras omitted', () => {
      const { result } = renderHook(() =>
        useCharactersState([], [], [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.createCustomCharacter(baseMinusId(MatoranStage.ToaMata));
      });

      expect(result.current.recruitedCharacters[0].customMataModelId).toBe('Toa_Tahu');
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
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
        useCharactersState(
          initialRecruited,
          [],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
      );

      act(() => {
        result.current.setMaskOverride('Jala', Mask.Hau);
      });

      expect(result.current.recruitedCharacters[1].maskOverride).toBeUndefined();
    });
  });

  describe('registerSharedCustomCharacter', () => {
    const sharedLook: BaseMatoran = {
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
    };

    test('returns existing entry when share identity matches (incoming id may differ)', () => {
      const { result } = renderHook(() =>
        useCharactersState([], [sharedLook], [], mockProtodermis, mockSetProtodermis)
      );

      const incoming = { ...sharedLook, id: 'custom_999' };
      let registered: BaseMatoran | undefined;
      act(() => {
        registered = result.current.registerSharedCustomCharacter(incoming);
      });

      expect(result.current.customCharacters).toHaveLength(1);
      expect(registered).toBe(result.current.customCharacters[0]);
      expect(registered?.id).toBe('custom_0');
    });

    test('assigns a new id when incoming id collides with a different design', () => {
      const occupant: BaseMatoran = {
        ...sharedLook,
        colors: { ...sharedLook.colors, mask: LegoColor.Red },
        id: 'custom_0',
        mask: Mask.Hau,
        name: 'Mine',
      };
      const incoming: BaseMatoran = {
        ...sharedLook,
        colors: { ...sharedLook.colors, mask: LegoColor.Green },
        id: 'custom_0',
        mask: Mask.Miru,
        name: 'Theirs',
      };

      const { result } = renderHook(() =>
        useCharactersState([], [occupant], [], mockProtodermis, mockSetProtodermis)
      );

      let registered: BaseMatoran | undefined;
      act(() => {
        registered = result.current.registerSharedCustomCharacter(incoming);
      });

      expect(result.current.customCharacters).toHaveLength(2);
      expect(registered?.id).toBe('custom_1');
      expect(registered?.mask).toBe(Mask.Miru);
      expect(result.current.customCharacters[0].id).toBe('custom_0');
    });
  });

  describe('updateCustomCharacter', () => {
    const customBase: BaseMatoran = {
      colors: DEFAULT_CUSTOM_COLORS,
      element: ElementTribe.Fire,
      id: 'custom_0',
      mask: Mask.Hau,
      name: 'Old',
      stage: MatoranStage.Diminished,
      tags: [MatoranTag.Custom],
    };

    test('updates custom base, recruited stage, and returns true', () => {
      const initialRecruited: RecruitedCharacterData[] = [
        { exp: 50, id: 'custom_0', stage: MatoranStage.Rebuilt },
      ];
      const completedQuests: string[] = [];

      const { result } = renderHook(() =>
        useCharactersState(
          initialRecruited,
          [customBase],
          completedQuests,
          mockProtodermis,
          mockSetProtodermis
        )
      );

      let ok = false;
      act(() => {
        ok = result.current.updateCustomCharacter('custom_0', {
          colors: simpleLimbColors({
            arms: LegoColor.Red,
            body: LegoColor.Blue,
            eyes: LegoColor.TransGreen,
            face: LegoColor.White,
            feet: LegoColor.Black,
            mask: LegoColor.Yellow,
          }),
          element: ElementTribe.Water,
          mask: Mask.Kaukau,
          name: 'New Name',
          stage: MatoranStage.ToaMata,
          tags: [MatoranTag.Custom],
        });
      });

      expect(ok).toBe(true);
      expect(result.current.customCharacters[0].name).toBe('New Name');
      expect(result.current.customCharacters[0].element).toBe(ElementTribe.Water);
      expect(result.current.customCharacters[0].mask).toBe(Mask.Kaukau);
      expect(result.current.recruitedCharacters[0].stage).toBe(MatoranStage.ToaMata);
    });

    test('optional extras set customMataModelId on recruit', () => {
      const initialRecruited: RecruitedCharacterData[] = [{ exp: 50, id: 'custom_0' }];
      const { result } = renderHook(() =>
        useCharactersState(initialRecruited, [customBase], [], mockProtodermis, mockSetProtodermis)
      );

      act(() => {
        result.current.updateCustomCharacter(
          'custom_0',
          {
            colors: customBase.colors,
            element: ElementTribe.Fire,
            mask: Mask.Hau,
            name: 'X',
            stage: MatoranStage.ToaMata,
            tags: [MatoranTag.Custom],
          },
          { customMataModelId: 'Toa_Pohatu' }
        );
      });

      expect(result.current.recruitedCharacters[0].customMataModelId).toBe('Toa_Pohatu');
    });

    test('returns false for non-custom id', () => {
      const { result } = renderHook(() =>
        useCharactersState([{ exp: 0, id: 'Jala' }], [], [], mockProtodermis, mockSetProtodermis)
      );

      let ok = true;
      act(() => {
        ok = result.current.updateCustomCharacter('Jala', {
          colors: customBase.colors,
          element: ElementTribe.Fire,
          mask: Mask.Hau,
          name: 'x',
          stage: MatoranStage.Diminished,
          tags: [MatoranTag.Custom],
        });
      });

      expect(ok).toBe(false);
    });

    test('returns false when custom id is not in customCharacters', () => {
      const { result } = renderHook(() =>
        useCharactersState(
          [{ exp: 0, id: 'custom_0' }],
          [],
          [],
          mockProtodermis,
          mockSetProtodermis
        )
      );

      let ok = true;
      act(() => {
        ok = result.current.updateCustomCharacter('custom_0', {
          colors: customBase.colors,
          element: ElementTribe.Fire,
          mask: Mask.Hau,
          name: 'x',
          stage: MatoranStage.Diminished,
          tags: [MatoranTag.Custom],
        });
      });

      expect(ok).toBe(false);
    });
  });
});
