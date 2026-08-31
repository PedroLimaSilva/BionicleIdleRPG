import { KraataPower } from '../../types/Kraata';
import type { RahkshiArmor } from '../../types/Rahkshi';
import { getAdjacentRahkshiIds, getSortedRahkshiArmor } from './rahkshiEntries';

const armor = (id: string, power: KraataPower): RahkshiArmor => ({
  id,
  power,
  status: 'ready',
});

describe('rahkshi detail entries', () => {
  test('sorts armor by power name', () => {
    const sorted = getSortedRahkshiArmor([
      armor('c', KraataPower.Disintegration),
      armor('a', KraataPower.Accuracy),
      armor('b', KraataPower.ChainLightning),
    ]);
    expect(sorted.map((entry) => entry.id)).toEqual(['a', 'b', 'c']);
  });

  test('adjacent ids wrap around sorted armor', () => {
    const rahkshi = [
      armor('accuracy', KraataPower.Accuracy),
      armor('chain', KraataPower.ChainLightning),
      armor('disintegration', KraataPower.Disintegration),
    ];

    expect(getAdjacentRahkshiIds(rahkshi, 'accuracy')).toEqual({
      nextId: 'chain',
      prevId: 'disintegration',
    });
    expect(getAdjacentRahkshiIds(rahkshi, 'disintegration')).toEqual({
      nextId: 'accuracy',
      prevId: 'chain',
    });
  });

  test('returns null for a single armor or unknown id', () => {
    const rahkshi = [armor('only', KraataPower.Accuracy)];
    expect(getAdjacentRahkshiIds(rahkshi, 'only')).toBeNull();
    expect(getAdjacentRahkshiIds(rahkshi, 'missing')).toBeNull();
  });
});
