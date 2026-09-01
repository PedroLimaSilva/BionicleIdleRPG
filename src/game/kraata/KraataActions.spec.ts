import { KraataPower, MAX_KRAATA_STAGE } from '../../types/Kraata';
import { RahkshiArmor } from '../../types/Rahkshi';
import {
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

  test('isRahkshiPowerCovered requires ready armor and a fully evolved kraata', () => {
    expect(
      isRahkshiPowerCovered(
        makeArmor({
          power: KraataPower.Accuracy,
          kraata: { power: KraataPower.Accuracy, stage: MAX_KRAATA_STAGE },
        })
      )
    ).toBe(true);

    expect(
      isRahkshiPowerCovered(
        makeArmor({
          power: KraataPower.Accuracy,
          kraata: { power: KraataPower.Accuracy, stage: MAX_KRAATA_STAGE - 1 },
        })
      )
    ).toBe(false);

    expect(
      isRahkshiPowerCovered(
        makeArmor({
          power: KraataPower.Accuracy,
          kraata: { power: KraataPower.Accuracy, stage: MAX_KRAATA_STAGE + 1 },
        })
      )
    ).toBe(false);

    expect(
      isRahkshiPowerCovered(
        makeArmor({
          power: KraataPower.Accuracy,
          status: 'preparing',
          endsAt: Date.now() + 60_000,
        })
      )
    ).toBe(false);

    expect(isRahkshiPowerCovered(makeArmor({ power: KraataPower.Accuracy }))).toBe(false);
  });

  test('getRahkshiPowerCoverage counts unique covered powers only', () => {
    const rahkshi: RahkshiArmor[] = [
      makeArmor({
        power: KraataPower.Accuracy,
        kraata: { power: KraataPower.Accuracy, stage: MAX_KRAATA_STAGE },
      }),
      makeArmor({
        power: KraataPower.Anger,
        kraata: { power: KraataPower.Anger, stage: MAX_KRAATA_STAGE },
      }),
      makeArmor({
        power: KraataPower.ChainLightning,
        kraata: { power: KraataPower.ChainLightning, stage: MAX_KRAATA_STAGE - 1 },
      }),
      makeArmor({ power: KraataPower.Chameleon, status: 'preparing', endsAt: Date.now() + 60_000 }),
      makeArmor({ power: KraataPower.Confusion }),
    ];

    expect(getRahkshiPowerCoverage(rahkshi)).toEqual({ covered: 2, total: 42 });
  });
});
