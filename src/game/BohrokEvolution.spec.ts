import { evolveBohrokToKalIfReady } from './BohrokEvolution';
import { getLevelFromExp } from './Levelling';
import { RecruitedCharacterData } from '../types/Matoran';

describe('BohrokEvolution', () => {
  test('returns matoran unchanged when not a Bohrok', () => {
    const matoran: RecruitedCharacterData = { id: 'Jala', exp: 100000 };
    expect(evolveBohrokToKalIfReady(matoran)).toEqual(matoran);
  });

  test('returns matoran unchanged when Bohrok below level 100', () => {
    const matoran: RecruitedCharacterData = { id: 'tahnok', exp: 1000 };
    expect(evolveBohrokToKalIfReady(matoran)).toEqual(matoran);
  });

  test('evolves Bohrok to Bohrok Kal at level 100', () => {
    const expFor100 = 98503; // expForLevel(100)
    expect(getLevelFromExp(expFor100)).toBe(100);

    const matoran: RecruitedCharacterData = { id: 'tahnok', exp: expFor100 };
    const result = evolveBohrokToKalIfReady(matoran);

    expect(result.id).toBe('tahnok_kal');
    expect(result.exp).toBe(expFor100);
  });

  test('evolves all Bohrok types to Kal', () => {
    const expFor100 = 98503;
    const types = ['tahnok', 'gahlok', 'lehvak', 'pahrak', 'nuhvok', 'kohrak'] as const;

    types.forEach((id) => {
      const matoran: RecruitedCharacterData = { id, exp: expFor100 };
      const result = evolveBohrokToKalIfReady(matoran);
      expect(result.id).toBe(`${id}_kal`);
    });
  });

  test('returns Bohrok Kal unchanged (no double evolution)', () => {
    const matoran: RecruitedCharacterData = { id: 'tahnok_kal', exp: 100000 };
    expect(evolveBohrokToKalIfReady(matoran)).toEqual(matoran);
  });
});
