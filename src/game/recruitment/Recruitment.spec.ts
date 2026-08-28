import { getBuyableCharacters, getCharactersUnlockedByQuest } from './Recruitment';
import { METRU_NUI_SAGA_BEGIN_QUEST_ID } from '../../data/quests/metru_nui';

describe('Recruitment', () => {
  describe('Kapura dual unlock', () => {
    test('is buyable after the MNOG meeting quest', () => {
      expect(getBuyableCharacters(['mnog_takua_meets_kapura'], [])).toEqual([
        { cost: 750, id: 'Kapura' },
      ]);
    });

    test('is buyable after Tales of the Lost City', () => {
      expect(getBuyableCharacters([METRU_NUI_SAGA_BEGIN_QUEST_ID], [])).toEqual(
        expect.arrayContaining([{ cost: 750, id: 'Kapura' }])
      );
    });

    test('appears in unlock lists for both quests', () => {
      const kapura = { cost: 750, id: 'Kapura' };
      expect(getCharactersUnlockedByQuest('mnog_takua_meets_kapura')).toContainEqual(kapura);
      expect(getCharactersUnlockedByQuest(METRU_NUI_SAGA_BEGIN_QUEST_ID)).toContainEqual(kapura);
    });
  });
});
