import { getEffectiveStage } from './characterStage';
import { RecruitedCharacterData } from '../types/Matoran';
import { MatoranStage } from '../types/Matoran';

describe('getEffectiveStage', () => {
  test('returns base stage from MATORAN_DEX when no override', () => {
    const matoran: RecruitedCharacterData = { id: 'Kapura', exp: 0 };
    expect(getEffectiveStage(matoran)).toBe(MatoranStage.Diminished);
  });

  test('returns recruited stage override when present', () => {
    const matoran: RecruitedCharacterData = {
      id: 'Kapura',
      exp: 0,
      stage: MatoranStage.Rebuilt,
    };
    expect(getEffectiveStage(matoran)).toBe(MatoranStage.Rebuilt);
  });

  test('returns base stage for Bohrok', () => {
    const matoran: RecruitedCharacterData = { id: 'tahnok', exp: 0 };
    expect(getEffectiveStage(matoran)).toBe(MatoranStage.Bohrok);
  });

  test('returns undefined for unknown id', () => {
    const matoran: RecruitedCharacterData = {
      id: 'unknown_id',
      exp: 0,
    };
    expect(getEffectiveStage(matoran)).toBeUndefined();
  });
});
