import {
  getAvailableEvolution,
  meetsEvolutionLevel,
  applyCharacterEvolution,
  EVOLUTION_LEVEL_REQUIREMENT,
} from './CharacterEvolution';
import { RecruitedCharacterData, MatoranStage, Mask } from '../types/Matoran';
import { getLevelFromExp } from './Levelling';

function expForLevel(level: number): number {
  return Math.floor(100 * Math.pow(level - 1, 1.5));
}

const expFor50 = expForLevel(50);

describe('CharacterEvolution', () => {
  describe('getAvailableEvolution', () => {
    test('returns null when quest is not completed', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      expect(getAvailableEvolution(char, [])).toBeNull();
    });

    test('returns evolution for Toa Mata after bohrok_evolve_toa_nuva quest', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Toa_Tahu_Nuva');
      expect(result!.questId).toBe('bohrok_evolve_toa_nuva');
    });

    test('returns evolution for all Toa Mata', () => {
      const toaMata = ['Toa_Tahu', 'Toa_Gali', 'Toa_Pohatu', 'Toa_Onua', 'Toa_Kopaka', 'Toa_Lewa'];
      const expectedNuva = ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Pohatu_Nuva', 'Toa_Onua_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva'];

      toaMata.forEach((id, i) => {
        const char: RecruitedCharacterData = { id, exp: 100000 };
        const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
        expect(result?.evolvedId).toBe(expectedNuva[i]);
      });
    });

    test('returns evolution for Matoran naming day (Jala -> Jaller)', () => {
      const char: RecruitedCharacterData = { id: 'Jala', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.evolvedId).toBe('Jaller');
    });

    test('returns stage override for Matoran naming day (Kapura -> Rebuilt)', () => {
      const char: RecruitedCharacterData = { id: 'Kapura', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).not.toBeNull();
      expect(result!.stageOverride).toBe(MatoranStage.Rebuilt);
    });

    test('returns null for stage override when already applied', () => {
      const char: RecruitedCharacterData = { id: 'Kapura', exp: 100000, stage: MatoranStage.Rebuilt };
      const result = getAvailableEvolution(char, ['bohrok_kal_naming_day']);
      expect(result).toBeNull();
    });

    test('returns null for characters not in any evolution map', () => {
      const char: RecruitedCharacterData = { id: 'Nuparu', exp: 100000 };
      const result = getAvailableEvolution(char, ['bohrok_evolve_toa_nuva']);
      expect(result).toBeNull();
    });
  });

  describe('meetsEvolutionLevel', () => {
    test('returns false below level 50', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 0 };
      expect(meetsEvolutionLevel(char)).toBe(false);
    });

    test('returns true at level 50', () => {
      expect(getLevelFromExp(expFor50)).toBe(EVOLUTION_LEVEL_REQUIREMENT);
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: expFor50 };
      expect(meetsEvolutionLevel(char)).toBe(true);
    });

    test('returns true above level 50', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      expect(meetsEvolutionLevel(char)).toBe(true);
    });
  });

  describe('applyCharacterEvolution', () => {
    test('applies ID evolution', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000 };
      const evolution = { questId: 'test', evolvedId: 'Toa_Tahu_Nuva', label: 'Evolve' };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Toa_Tahu_Nuva');
      expect(result.exp).toBe(100000);
      expect(result.maskOverride).toBeUndefined();
    });

    test('applies stage override', () => {
      const char: RecruitedCharacterData = { id: 'Kapura', exp: 100000 };
      const evolution = { questId: 'test', stageOverride: MatoranStage.Rebuilt, label: 'Upgrade' };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.id).toBe('Kapura');
      expect(result.stage).toBe(MatoranStage.Rebuilt);
      expect(result.exp).toBe(100000);
    });

    test('clears maskOverride on ID evolution', () => {
      const char: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 100000, maskOverride: Mask.Akaku };
      const evolution = { questId: 'test', evolvedId: 'Toa_Tahu_Nuva', label: 'Evolve' };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.maskOverride).toBeUndefined();
    });

    test('preserves exp on evolution', () => {
      const char: RecruitedCharacterData = { id: 'Jala', exp: 50000 };
      const evolution = { questId: 'test', evolvedId: 'Jaller', label: 'Evolve' };
      const result = applyCharacterEvolution(char, evolution);
      expect(result.exp).toBe(50000);
    });
  });
});
