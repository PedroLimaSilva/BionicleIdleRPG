import { MatoranStage } from '../../types/Matoran';
import { COMBATANT_DEX, ENCOUNTERS } from '../combat';
import {
  getBuyableCharacters,
  getCharactersUnlockedByQuest,
} from '../../game/recruitment/Recruitment';
import { METRU_VAKAMA_DUME_QUEST_ID } from '../quests/metru_nui';
import { CHARACTER_DEX } from './index';

const VAHKI_HIVES = ['bordakh', 'nuurakh', 'vorzakh', 'zadakh', 'rorzakh', 'keerakh'] as const;

describe('Vahki opponents', () => {
  test('each hive has a Vahki-stage dex entry and a vahki combat template', () => {
    for (const id of VAHKI_HIVES) {
      expect(CHARACTER_DEX[id]?.stage).toBe(MatoranStage.Vahki);
      expect(COMBATANT_DEX[id]?.model).toBe('vahki');
      expect(COMBATANT_DEX[id]?.id).toBe(id);
    }
  });

  test('Bordakh Patrol and Six Hives spawn only registered hives', () => {
    const patrol = ENCOUNTERS.find((encounter) => encounter.id === 'bordakh-1');
    const sixHives = ENCOUNTERS.find((encounter) => encounter.id === 'vahki_six_hives');
    expect(patrol?.headliner).toBe('bordakh');
    expect(sixHives?.headliner).toBe('vahki_squad');
    expect(COMBATANT_DEX.vahki_squad?.model).toBe('vahki');

    const spawned = [patrol, sixHives].flatMap(
      (encounter) => encounter?.waves.flatMap((wave) => wave.map((slot) => slot.id)) ?? []
    );
    for (const id of spawned) {
      expect(VAHKI_HIVES).toContain(id);
    }
    expect(new Set(sixHives?.waves.flatMap((wave) => wave.map((slot) => slot.id)))).toEqual(
      new Set(VAHKI_HIVES)
    );
  });

  test('all six hives become buyable after The Turaga’s Visit', () => {
    const expected = VAHKI_HIVES.map((id) => ({ cost: 500, id }));
    expect(getCharactersUnlockedByQuest(METRU_VAKAMA_DUME_QUEST_ID)).toEqual(expected);
    expect(getBuyableCharacters([METRU_VAKAMA_DUME_QUEST_ID], [])).toEqual(expected);
    expect(getBuyableCharacters([METRU_VAKAMA_DUME_QUEST_ID], [{ exp: 0, id: 'bordakh' }])).toEqual(
      expected.filter((entry) => entry.id !== 'bordakh')
    );
  });
});
