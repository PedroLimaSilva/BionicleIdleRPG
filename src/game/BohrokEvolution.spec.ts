import {
  canEvolveBohrokToKal,
  evolveBohrokToKal,
  BOHROK_KAL_LEVEL,
} from './BohrokEvolution';
import { getLevelFromExp } from './Levelling';
import { RecruitedCharacterData } from '../types/Matoran';

const expFor100 = 98503; // expForLevel(100)

describe('BohrokEvolution', () => {
  describe('canEvolveBohrokToKal', () => {
    test('returns false when not a Bohrok', () => {
      const matoran: RecruitedCharacterData = { id: 'Jala', exp: 100000 };
      expect(canEvolveBohrokToKal(matoran)).toBe(false);
    });

    test('returns false when Bohrok below level 100', () => {
      const matoran: RecruitedCharacterData = { id: 'tahnok', exp: 1000 };
      expect(canEvolveBohrokToKal(matoran)).toBe(false);
    });

    test('returns true when Bohrok at level 100', () => {
      expect(getLevelFromExp(expFor100)).toBe(BOHROK_KAL_LEVEL);
      const matoran: RecruitedCharacterData = { id: 'tahnok', exp: expFor100 };
      expect(canEvolveBohrokToKal(matoran)).toBe(true);
    });

    test('returns false for Bohrok Kal (already evolved)', () => {
      const matoran: RecruitedCharacterData = { id: 'tahnok_kal', exp: 100000 };
      expect(canEvolveBohrokToKal(matoran)).toBe(false);
    });
  });

  describe('evolveBohrokToKal', () => {
    test('evolves Bohrok to Bohrok Kal', () => {
      const matoran: RecruitedCharacterData = { id: 'tahnok', exp: expFor100 };
      const result = evolveBohrokToKal(matoran);

      expect(result.id).toBe('tahnok_kal');
      expect(result.exp).toBe(expFor100);
    });

    test('evolves all Bohrok types to Kal', () => {
      const types = ['tahnok', 'gahlok', 'lehvak', 'pahrak', 'nuhvok', 'kohrak'] as const;

      types.forEach((id) => {
        const matoran: RecruitedCharacterData = { id, exp: expFor100 };
        const result = evolveBohrokToKal(matoran);
        expect(result.id).toBe(`${id}_kal`);
      });
    });

    test('returns Bohrok Kal unchanged when passed unknown id', () => {
      const matoran: RecruitedCharacterData = { id: 'tahnok_kal', exp: 100000 };
      expect(evolveBohrokToKal(matoran)).toEqual(matoran);
    });
  });
});
