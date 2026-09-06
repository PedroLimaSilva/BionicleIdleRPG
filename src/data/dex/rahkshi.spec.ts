import { KraataPower } from '../../types/Kraata';
import { MatoranStage } from '../../types/Matoran';
import { getRahkshiArmorColors } from '../rahkshiArmorColors';
import { CHARACTER_DEX } from './index';
import { RAHKSHI_DEX } from './rahkshi';

const RAHKSHI_SPECIMENS = [KraataPower.Fragmentation, KraataPower.Chameleon] as const;

describe('Rahkshi dex specimens', () => {
  test('each specimen has a Rahkshi-stage dex entry keyed by kraata power', () => {
    for (const power of RAHKSHI_SPECIMENS) {
      expect(RAHKSHI_DEX[power]?.id).toBe(power);
      expect(CHARACTER_DEX[power]?.stage).toBe(MatoranStage.Rahkshi);
      expect(CHARACTER_DEX[power]?.name).toMatch(/^Rahkshi of /);
    }
  });

  test('armor colors match the Rahkshi appearance table', () => {
    expect(getRahkshiArmorColors(KraataPower.Fragmentation).staff).toBe('Panrahk');
    expect(getRahkshiArmorColors(KraataPower.Chameleon).staff).toBe('Turahk');
  });
});
