import { MatoranJob } from '../types/Jobs';
import { RecruitedCharacterData } from '../types/Matoran';
import { tickRecruitedCharactersJobExp } from './jobUtils';

const jobMatoran = (assignedAt: number, id = 'Jala'): RecruitedCharacterData => ({
  assignment: {
    assignedAt,
    expRatePerSecond: 1,
    job: MatoranJob.CharcoalMaker,
  },
  exp: 0,
  id,
});

const idleMatoran = (id: string): RecruitedCharacterData => ({
  exp: 0,
  id,
});

describe('tickRecruitedCharactersJobExp', () => {
  test('skips idle characters without creating new object references', () => {
    const idle = idleMatoran('Hahli');
    const working = jobMatoran(0);
    const roster = [idle, working];

    const { protodermisGain, updated } = tickRecruitedCharactersJobExp(roster, 10_000);

    expect(updated[0]).toBe(idle);
    expect(updated[1].exp).toBe(10);
    expect(protodermisGain).toBe(1);
  });

  test('returns zero protodermis when no characters are assigned', () => {
    const roster = [idleMatoran('Hahli'), idleMatoran('Macku')];

    const { protodermisGain, updated } = tickRecruitedCharactersJobExp(roster, 5000);

    expect(updated).toEqual(roster);
    expect(protodermisGain).toBe(0);
  });
});
