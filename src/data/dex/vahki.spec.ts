import { LegoColor } from '../../types/Colors';
import { MatoranStage } from '../../types/Matoran';
import { COMBATANT_DEX, ENCOUNTERS } from '../combat';
import {
  getBuyableCharacters,
  getCharactersUnlockedByQuest,
} from '../../game/recruitment/Recruitment';
import { METRU_VAKAMA_DUME_QUEST_ID } from '../quests/metru_nui';
import { CHARACTER_DEX } from './index';
import { TOA_DEX } from './toa';

const VAHKI_HIVES = ['bordakh', 'nuurakh', 'vorzakh', 'zadakh', 'rorzakh', 'keerakh'] as const;

/** Water / Fire / Air / Stone / Earth / Ice — same pairing as the Toa Metru. */
const VAHKI_TOA_METRU = {
  bordakh: 'Toa_Nokama',
  keerakh: 'Toa_Nuju',
  nuurakh: 'Toa_Vakama',
  rorzakh: 'Toa_Whenua',
  vorzakh: 'Toa_Matau',
  zadakh: 'Toa_Onewa',
} as const;

/** LEGO x1190 eye / visor color per hive (8614–8619). */
const VAHKI_EYE_COLORS = {
  bordakh: LegoColor.TransNeonOrange,
  keerakh: LegoColor.TransLightBlue,
  nuurakh: LegoColor.TransGreen,
  rorzakh: LegoColor.TransYellow,
  vorzakh: LegoColor.Red,
  zadakh: LegoColor.TransDarkBlue,
} as const;

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

  test('main and secondary match the Toa Metru tribal color; glow and eyes use hive visor colors', () => {
    for (const [hiveId, toaId] of Object.entries(VAHKI_TOA_METRU)) {
      const hive = CHARACTER_DEX[hiveId];
      const toa = TOA_DEX[toaId];
      const tribal = toa.colors.body.main;
      const eyes = VAHKI_EYE_COLORS[hiveId as keyof typeof VAHKI_EYE_COLORS];

      expect(hive.colors.body.main).toBe(tribal);
      expect(hive.colors.body.secondary).toBe(tribal);
      expect(hive.colors.arms.main).toBe(tribal);
      expect(hive.colors.arms.secondary).toBe(tribal);
      expect(hive.colors.legs?.main).toBe(tribal);
      expect(hive.colors.legs?.secondary).toBe(tribal);
      expect(hive.colors.weapon?.main).toBe(tribal);
      expect(hive.colors.weapon?.secondary).toBe(tribal);
      expect(hive.colors.mask).toBe(tribal);

      expect(hive.colors.eyes).toBe(eyes);
      expect(hive.colors.body.glow).toBe(eyes);
      expect(hive.colors.weapon?.glow).toBe(eyes);
    }
  });
});
