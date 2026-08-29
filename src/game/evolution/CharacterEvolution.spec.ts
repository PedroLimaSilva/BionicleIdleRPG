import {
  getAvailableEvolution,
  meetsEvolutionLevel,
  applyCharacterEvolution,
  EVOLUTION_LEVEL_REQUIREMENT,
  BOHROK_KAL_LEVEL_REQUIREMENT,
  METRU_TOA_METRU_LEVEL_REQUIREMENT,
  METRU_TOA_METRU_COST,
  AvailableEvolution,
} from './CharacterEvolution';
import { METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID } from '../../data/quests/metru_nui';
import { RecruitedCharacterData, MatoranStage, Mask } from '../../types/Matoran';
import { getLevelFromExp } from '../characters/Levelling';
import {
  CUSTOM_METRU_COST,
  CUSTOM_METRU_LEVEL_REQUIREMENT,
  CUSTOM_TOA_COST,
  CUSTOM_TOA_LEVEL_REQUIREMENT,
} from './CharacterEvolution';

function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

const expFor40 = expForLevel(40);
const expFor100 = expForLevel(100);
const expFor27 = expForLevel(27);
const expFor28 = expForLevel(28);

const expFor60 = expForLevel(60);

describe('CharacterEvolution', () => {
  describe('getAvailableEvolution - custom characters', () => {
    test('Rebuilt → Metru requires Great Temple quest', () => {
      const char: RecruitedCharacterData = {
        exp: expFor40,
        id: 'custom_0',
        stage: MatoranStage.Rebuilt,
      };
      expect(getAvailableEvolution(char, [])).toBeNull();
      const result = getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID]);
      expect(result).not.toBeNull();
      expect(result!.stageOverride).toBe(MatoranStage.Metru);
      expect(result!.levelRequired).toBe(CUSTOM_METRU_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(CUSTOM_METRU_COST);
    });

    test('Metru → Toa requires Great Temple quest', () => {
      const char: RecruitedCharacterData = {
        exp: expFor27,
        id: 'custom_0',
        stage: MatoranStage.Metru,
      };
      expect(getAvailableEvolution(char, [])).toBeNull();
      const result = getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID]);
      expect(result).not.toBeNull();
      expect(result!.stageOverride).toBe(MatoranStage.ToaMata);
      expect(result!.levelRequired).toBe(CUSTOM_TOA_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(CUSTOM_TOA_COST);
    });

    test('does not skip Metru step by evolving Rebuilt directly to Toa', () => {
      const char: RecruitedCharacterData = {
        exp: expFor60,
        id: 'custom_0',
        stage: MatoranStage.Rebuilt,
      };
      const result = getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID]);
      expect(result?.stageOverride).toBe(MatoranStage.Metru);
    });
  });

  describe('getAvailableEvolution - Toa Nuva', () => {
    test('returns null when quest is not completed', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Toa_Tahu' };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution with correct cost for Toa Mata', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Toa_Tahu' };
      const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Toa_Tahu_Nuva');
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(5000);
    });

    test('returns evolution for all Toa Mata', () => {
      const toaMata = ['Toa_Tahu', 'Toa_Gali', 'Toa_Pohatu', 'Toa_Onua', 'Toa_Kopaka', 'Toa_Lewa'];
      const expectedNuva = [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Pohatu_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
      ];

      toaMata.forEach((id, i) => {
        const char: RecruitedCharacterData = { exp: 100000, id };
        const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
        expect(result?.evolvedId).toBe(expectedNuva[i]);
      });
    });
  });

  describe('getAvailableEvolution - Naming Day', () => {
    test('returns evolution with correct cost for Matoran ID change', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Jala' };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Jaller');
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(1000);
    });

    test('returns stage override with correct cost for Matoran', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Kapura' };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.stageOverride).toBe(MatoranStage.Rebuilt);
      expect(result!.levelRequired).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(1000);
    });

    test('returns null for stage override when already applied', () => {
      const char: RecruitedCharacterData = {
        exp: 100000,
        id: 'Kapura',
        stage: MatoranStage.Rebuilt,
      };
      expect(getAvailableEvolution(char, ['bohrok_kal_naming_day'])).toBeNull();
    });

    test('returns null for characters not in any evolution map', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Nuparu' };
      expect(getAvailableEvolution(char, ['bohrok_evolve_toa_nuva'])).toBeNull();
    });
  });

  describe('getAvailableEvolution - Bohrok Kal', () => {
    test('returns null when naming day quest is not completed', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'tahnok' };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution with correct cost and level for Bohrok', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'tahnok' };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('tahnok_kal');
      expect(result!.levelRequired).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(5000);
    });

    test('returns evolution for all Bohrok types', () => {
      const types = ['tahnok', 'gahlok', 'lehvak', 'pahrak', 'nuhvok', 'kohrak'];
      types.forEach((id) => {
        const char: RecruitedCharacterData = { exp: 100000, id };
        const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
        expect(result?.evolvedId).toBe(`${id}_kal`);
        expect(result?.levelRequired).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
        expect(result?.protodermisCost).toBe(5000);
      });
    });
  });

  describe('getAvailableEvolution - Metru Matoran to Toa Metru', () => {
    test('returns null when Great Temple quest is not completed', () => {
      const char: RecruitedCharacterData = { exp: expFor28, id: 'Vakama' };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution with correct cost for Metru Toa candidate', () => {
      const char: RecruitedCharacterData = { exp: expFor28, id: 'Vakama' };
      const result = getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID]);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Toa_Vakama');
      expect(result!.levelRequired).toBe(METRU_TOA_METRU_LEVEL_REQUIREMENT);
      expect(result!.protodermisCost).toBe(METRU_TOA_METRU_COST);
      expect(result!.label).toBe('Evolve to Toa Vakama');
    });

    test('returns evolution for all Metru Toa candidates', () => {
      const candidates = [
        ['Matau', 'Toa_Matau'],
        ['Nokama', 'Toa_Nokama'],
        ['Nuju', 'Toa_Nuju'],
        ['Onewa', 'Toa_Onewa'],
        ['Vakama', 'Toa_Vakama'],
        ['Whenua', 'Toa_Whenua'],
      ] as const;

      candidates.forEach(([fromId, toId]) => {
        const char: RecruitedCharacterData = { exp: expFor28, id: fromId };
        const result = getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID]);
        expect(result?.evolvedId).toBe(toId);
      });
    });

    test('returns null for Great Disk matoran', () => {
      const char: RecruitedCharacterData = { exp: expFor28, id: 'Ahkmou' };
      expect(getAvailableEvolution(char, [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID])).toBeNull();
    });
  });

  describe('meetsEvolutionLevel', () => {
    const evo40: AvailableEvolution = {
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

    test('returns false below level 40 for standard evolution', () => {
      const char: RecruitedCharacterData = { exp: 0, id: 'Toa_Tahu' };
      expect(meetsEvolutionLevel(char, evo40)).toBe(false);
    });

    test('returns true at level 40 for standard evolution', () => {
      expect(getLevelFromExp(expFor40)).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { exp: expFor40, id: 'Toa_Tahu' };
      expect(meetsEvolutionLevel(char, evo40)).toBe(true);
    });

    test('returns true at level 27 for Metru Toa Metru evolution', () => {
      expect(getLevelFromExp(expFor27)).toBe(METRU_TOA_METRU_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { exp: expFor27, id: 'Vakama' };
      const evo: AvailableEvolution = {
        evolvedId: 'Toa_Vakama',
        label: 'Evolve to Toa Vakama',
        levelRequired: METRU_TOA_METRU_LEVEL_REQUIREMENT,
        protodermisCost: METRU_TOA_METRU_COST,
      };
      expect(meetsEvolutionLevel(char, evo)).toBe(true);
    });

    test('returns false below level 100 for Bohrok Kal evolution', () => {
      const char: RecruitedCharacterData = { exp: expFor40, id: 'tahnok' };
      expect(meetsEvolutionLevel(char, evo100)).toBe(false);
    });

    test('returns true at level 100 for Bohrok Kal evolution', () => {
      expect(getLevelFromExp(expFor100)).toBe(BOHROK_KAL_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { exp: expFor100, id: 'tahnok' };
      expect(meetsEvolutionLevel(char, evo100)).toBe(true);
    });
  });

  describe('applyCharacterEvolution', () => {
    test('applies ID evolution', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Toa_Tahu' };
      const evolution: AvailableEvolution = {
        evolvedId: 'Toa_Tahu_Nuva',
        label: 'Evolve',
        levelRequired: 40,
        protodermisCost: 5000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Toa_Tahu_Nuva');
      expect(result.exp).toBe(100000);
      expect(result.maskOverride).toBeUndefined();
    });

    test('applies stage override', () => {
      const char: RecruitedCharacterData = { exp: 100000, id: 'Kapura' };
      const evolution: AvailableEvolution = {
        label: 'Upgrade',
        levelRequired: 40,
        protodermisCost: 1000,
        stageOverride: MatoranStage.Rebuilt,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Kapura');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
      expect(result.exp).toBe(100000);
    });

    test('clears maskOverride on ID evolution', () => {
      const char: RecruitedCharacterData = {
        exp: 100000,
        id: 'Toa_Tahu',
        maskOverride: Mask.Akaku,
      };
      const evolution: AvailableEvolution = {
        evolvedId: 'Toa_Tahu_Nuva',
        label: 'Evolve',
        levelRequired: 40,
        protodermisCost: 5000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.maskOverride).toBeUndefined();
    });

    test('applies Bohrok Kal evolution', () => {
      const char: RecruitedCharacterData = { exp: expFor100, id: 'tahnok' };
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

    test('applies Metru Toa Metru evolution', () => {
      const char: RecruitedCharacterData = { exp: expFor28, id: 'Nokama' };
      const evolution: AvailableEvolution = {
        evolvedId: 'Toa_Nokama',
        label: 'Evolve to Toa Nokama',
        levelRequired: METRU_TOA_METRU_LEVEL_REQUIREMENT,
        protodermisCost: METRU_TOA_METRU_COST,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Toa_Nokama');
      expect(result.stage).toBe(MatoranStage.ToaMetru);
      expect(result.exp).toBe(expFor28);
    });

    test('preserves exp on evolution', () => {
      const char: RecruitedCharacterData = { exp: 50000, id: 'Jala' };
      const evolution: AvailableEvolution = {
        evolvedId: 'Jaller',
        label: 'Evolve',
        levelRequired: 40,
        protodermisCost: 1000,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.exp).toBe(50000);
    });

    test('sets default custom Mata model when custom evolves to Toa Mata', () => {
      const char: RecruitedCharacterData = {
        exp: 100000,
        id: 'custom_0',
        stage: MatoranStage.Rebuilt,
      };
      const evolution: AvailableEvolution = {
        label: 'Evolve',
        levelRequired: 60,
        protodermisCost: 3000,
        stageOverride: MatoranStage.ToaMata,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.stage).toBe(MatoranStage.ToaMata);
      expect(result.customMataModelId).toBe('Toa_Tahu');
    });

    test('does not replace an existing custom Mata model when evolving to Toa Mata', () => {
      const char: RecruitedCharacterData = {
        customMataModelId: 'Toa_Gali',
        exp: 100000,
        id: 'custom_0',
        stage: MatoranStage.Rebuilt,
      };
      const evolution: AvailableEvolution = {
        label: 'Evolve',
        levelRequired: 60,
        protodermisCost: 3000,
        stageOverride: MatoranStage.ToaMata,
      };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.customMataModelId).toBe('Toa_Gali');
    });
  });
});
