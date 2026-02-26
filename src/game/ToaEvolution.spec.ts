import {
  canEvolveToaToNuva,
  evolveToaToNuva,
  TOA_NUVA_LEVEL,
} from './ToaEvolution';
import { getLevelFromExp } from './Levelling';
import { RecruitedCharacterData } from '../types/Matoran';

const expLevel50 = 36000;

describe('ToaEvolution', () => {
  const completedWithQuest = ['bohrok_evolve_toa_nuva'];
  const completedWithoutQuest: string[] = [];

  describe('canEvolveToaToNuva', () => {
    test('returns false when Dawn of the Toa Nuva not complete', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Toa_Tahu',
        exp: expLevel50,
      };
      expect(canEvolveToaToNuva(matoran, completedWithoutQuest)).toBe(false);
    });

    test('returns false when Toa Mata below level 50', () => {
      const matoran: RecruitedCharacterData = { id: 'Toa_Tahu', exp: 1000 };
      expect(canEvolveToaToNuva(matoran, completedWithQuest)).toBe(false);
    });

    test('returns true when Toa Mata at level 50+ and quest complete', () => {
      expect(getLevelFromExp(expLevel50)).toBeGreaterThanOrEqual(TOA_NUVA_LEVEL);
      const matoran: RecruitedCharacterData = {
        id: 'Toa_Tahu',
        exp: expLevel50,
      };
      expect(canEvolveToaToNuva(matoran, completedWithQuest)).toBe(true);
    });

    test('returns false for Toa Nuva (already evolved)', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Toa_Tahu_Nuva',
        exp: expLevel50,
      };
      expect(canEvolveToaToNuva(matoran, completedWithQuest)).toBe(false);
    });

    test('returns false for non-Toa character', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Kapura',
        exp: expLevel50,
      };
      expect(canEvolveToaToNuva(matoran, completedWithQuest)).toBe(false);
    });
  });

  describe('evolveToaToNuva', () => {
    test('evolves Toa Tahu to Toa Tahu Nuva', () => {
      const matoran: RecruitedCharacterData = {
        id: 'Toa_Tahu',
        exp: expLevel50,
      };
      const result = evolveToaToNuva(matoran);
      expect(result.id).toBe('Toa_Tahu_Nuva');
      expect(result.exp).toBe(expLevel50);
    });

    test('evolves all Toa Mata to Nuva', () => {
      const toaMata = [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Pohatu',
        'Toa_Onua',
        'Toa_Kopaka',
        'Toa_Lewa',
      ] as const;
      const toaNuva = [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Pohatu_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
      ] as const;

      toaMata.forEach((id, i) => {
        const matoran: RecruitedCharacterData = { id, exp: expLevel50 };
        const result = evolveToaToNuva(matoran);
        expect(result.id).toBe(toaNuva[i]);
      });
    });
  });
});
