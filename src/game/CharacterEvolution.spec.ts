import {
  getAvailableEvolution,
  meetsEvolutionLevel,
  applyCharacterEvolution,
  EVOLUTION_LEVEL_REQUIREMENT,
  BOHROK_KAL_LEVEL_REQUIREMENT,
  AvailableEvolution,
} from './CharacterEvolution';
import { RecruitedCharacterData, MatoranStage, Mask } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

const expFor50 = expForLevel(50);
const expFor100 = expForLevel(100);

describe('CharacterEvolution', () => {
  describe('getAvailableEvolution - Toa Nuva', () => {
    test('returns null when quest is not completed', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution with correct cost for Toa Mata', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Toa_Tahu_Nuva');
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(5000);
    });

    test('returns evolution for all Toa Mata', () => {
      const toaMata = [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Pohatu',
        'Toa_Onua',
        'Toa_Kopaka',
        'Toa_Lewa',
      ];
      const expectedNuva = [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Pohatu_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
      ];

      toaMata.forEach((id, i) => {
        const char: RecruitedCharacterData = { id, exp: 100000 };
        const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
        expect(result?.evolvedId).toBe(expectedNuva[i]);
      });
    });
  });

  describe('getAvailableEvolution - Naming Day', () => {
    test('returns evolution with correct cost for Matoran ID change', () => {
      const char: RecruitedCharacterData = { id: 'Jala', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Jaller');
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(1000);
    });

    test('returns stage override with correct cost for Matoran', () => {
      const char: RecruitedCharacterData = { id: 'Kapura', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.stageOverride).toBe(MatoranStage.Rebuilt);
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(1000);
    });

    test('returns null for stage override when already applied', () => {
      const char: RecruitedCharacterData = {
        id: 'Kapura',
        exp: 100000,
        stage: MatoranStage.Rebuilt,
      };
      expect(getAvailableEvolution(char, ['bohrok_kal_naming_day'])).toBeNull();
    });

    test('returns null for characters not in any evolution map', () => {
      const char: RecruitedCharacterData = { id: 'Nuparu', exp: 100000 };
      expect(getAvailableEvolution(char, ['bohrok_evolve_toa_nuva'])).toBeNull();
    });
  });

  describe('getAvailableEvolution - Bohrok Kal', () => {
    test('returns null when naming day quest is not completed', () => {
      const char: RecruitedCharacterData = { id: 'tahnok', exp: 100000 };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution with correct cost and level for Bohrok', () => {
      const char: RecruitedCharacterData = { id: 'tahnok', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('tahnok_kal');
      expect(result!.levelRequired).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(5000);
    });

    test('returns evolution for all Bohrok types', () => {
      const types = ['tahnok', 'gahlok', 'lehvak', 'pahrak', 'nuhvok', 'kohrak'];
      types.forEach((id) => {
        const char: RecruitedCharacterData = { id, exp: 100000 };
        const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
        expect(result?.evolvedId).toBe(`${id}_kal`);
        expect(result?.levelRequired).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
        expect(result?.protodermisCost).toBe(5000);
      });
    });
  });

  describe('meetsEvolutionLevel', () => {
    const evo50: AvailableEvolution = {
      evolvedId: 'test',
      label: 'Test',
      levelRequired: EVOLUTION_LEVEL_REQUIREMENT,
      protodermisCost: 1000,
    };
    const evo100: AvailableEvolution = {
      evolvedId: 'test',
      label: 'Test',
      levelRequired: BOHROK_KAL_LEVEL_REQUIREMENT,
      protodermisCost: 5000,
    };

    test('returns false below level 50 for standard evolution', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 0 };
      expect(meetsEvolutionLevel(char, evo50)).toBe(false);
    });

    test('returns true at level 50 for standard evolution', () => {
      expect(getLevelFromExp(expFor50)).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: expFor50 };
      expect(meetsEvolutionLevel(char, evo50)).toBe(true);
    });

    test('returns false below level 100 for Bohrok Kal evolution', () => {
      const char: RecruitedCharacterData = { id: 'tahnok', exp: expFor50 };
      expect(meetsEvolutionLevel(char, evo100)).toBe(false);
    });

    test('returns true at level 100 for Bohrok Kal evolution', () => {
      expect(getLevelFromExp(expFor100)).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { id: 'tahnok', exp: expFor100 };
      expect(meetsEvolutionLevel(char, evo100)).toBe(true);
    });
  });

  describe('applyCharacterEvolution', () => {
    test('applies ID evolution', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      const evolution: AvailableEvolution = {
        evolvedId: 'Toa_Tahu_Nuva',
        label: 'Evolve',
        levelRequired: 50,
        protodermisCost: 5000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Toa_Tahu_Nuva');
      expect(result.exp).toBe(100000);
      expect(result.maskOverride).toBeUndefined();
    });

    test('applies stage override', () => {
      const char: RecruitedCharacterData = { id: 'Kapura', exp: 100000 };
      const evolution: AvailableEvolution = {
        stageOverride: MatoranStage.Rebuilt,
        label: 'Upgrade',
        levelRequired: 50,
        protodermisCost: 1000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Kapura');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
      expect(result.exp).toBe(100000);
    });

    test('clears maskOverride on ID evolution', () => {
      const char: RecruitedCharacterData = {
        id: 'Toa_Tahu',
        exp: 100000,
        maskOverride: Mask.Akaku,
      };
      const evolution: AvailableEvolution = {
        evolvedId: 'Toa_Tahu_Nuva',
        label: 'Evolve',
        levelRequired: 50,
        protodermisCost: 5000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.maskOverride).toBeUndefined();
    });

    test('applies Bohrok Kal evolution', () => {
      const char: RecruitedCharacterData = { id: 'tahnok', exp: expFor100 };
      const evolution: AvailableEvolution = {
        evolvedId: 'tahnok_kal',
        label: 'Evolve to Tahnok Kal',
        levelRequired: 100,
        protodermisCost: 5000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('tahnok_kal');
      expect(result.exp).toBe(expFor100);
    });

    test('preserves exp on evolution', () => {
      const char: RecruitedCharacterData = { id: 'Jala', exp: 50000 };
      const evolution: AvailableEvolution = {
        evolvedId: 'Jaller',
        label: 'Evolve',
        levelRequired: 50,
        protodermisCost: 1000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.exp).toBe(50000);
    });
  });
});
