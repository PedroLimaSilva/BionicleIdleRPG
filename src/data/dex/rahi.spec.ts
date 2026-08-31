import { MatoranStage } from '../../types/Matoran';
import { COMBATANT_DEX } from '../combat';
import { CHARACTER_DEX } from './index';

const RAHI_IDS = ['muaka', 'nui_jaga', 'nui_rama'] as const;

describe('Rahi opponents', () => {
  test('each early-game Rahi has a dex entry and combat template', () => {
    for (const id of RAHI_IDS) {
      expect(CHARACTER_DEX[id]?.stage).toBe(MatoranStage.Rahi);
      expect(COMBATANT_DEX[id]?.id).toBe(id);
      expect(['nui_rama', 'rahi_placeholder']).toContain(COMBATANT_DEX[id]?.model);
    }
  });
});
