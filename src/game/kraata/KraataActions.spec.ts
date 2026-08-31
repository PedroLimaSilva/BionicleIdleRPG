import { KraataPower } from '../../types/Kraata';
import { RahkshiArmor } from '../../types/Rahkshi';
import {
  ACTIVE_RAHKSHI_KRAATA_STAGE,
  getRahkshiPowerCoverage,
  isRahkshiPowerCovered,
  KRAATA_POWER_COUNT,
} from './KraataActions';

function makeArmor(overrides: Partial<RahkshiArmor> & Pick<RahkshiArmor, 'power'>): RahkshiArmor {
  return {
    id: `rahkshi-${overrides.power}`,
    status: 'ready',
    ...overrides,
  };
}

describe('rahkshi power coverage', () => {
  test('counts 42 kraata powers total', () => {
    expect(KRAATA_POWER_COUNT).toBe(42);
  });

  test('isRahkshiPowerCovered requires ready armor and stage 5+ kraata', () => {
    expect(
      isRahkshiPowerCovered(
        makeArmor({
          kraata: { power: KraataPower.Accuracy, stage: ACTIVE_RAHKSHI_KRAATA_STAGE },
          power: KraataPower.Accuracy,
        })
      )
    ).toBe(true);

    expect(
      isRahkshiPowerCovered(
        makeArmor({
          kraata: { power: KraataPower.Accuracy, stage: ACTIVE_RAHKSHI_KRAATA_STAGE - 1 },
          power: KraataPower.Accuracy,
        })
      )
    ).toBe(false);

    expect(
      isRahkshiPowerCovered(
        makeArmor({
          endsAt: Date.now() + 60_000,
          power: KraataPower.Accuracy,
          status: 'preparing',
        })
      )
    ).toBe(false);

    expect(isRahkshiPowerCovered(makeArmor({ power: KraataPower.Accuracy }))).toBe(false);
  });

  test('getRahkshiPowerCoverage counts unique covered powers only', () => {
    const rahkshi: RahkshiArmor[] = [
      makeArmor({
        kraata: { power: KraataPower.Accuracy, stage: 5 },
        power: KraataPower.Accuracy,
      }),
      makeArmor({
        kraata: { power: KraataPower.Anger, stage: 6 },
        power: KraataPower.Anger,
      }),
      makeArmor({
        kraata: { power: KraataPower.ChainLightning, stage: 4 },
        power: KraataPower.ChainLightning,
      }),
      makeArmor({ endsAt: Date.now() + 60_000, power: KraataPower.Chameleon, status: 'preparing' }),
      makeArmor({ power: KraataPower.Confusion }),
    ];

    expect(getRahkshiPowerCoverage(rahkshi)).toEqual({ covered: 2, total: 42 });
  });
});
