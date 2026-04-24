import {
  getEffectiveMataMaskColor,
  getEffectiveNuvaMaskColor,
  getEffectiveMaskColor,
} from './maskColor';
import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../types/Matoran';
import { ElementTribe, Mask } from '../types/Matoran';
import { LegoColor } from '../types/Colors';
import { BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID } from './nuvaSymbols';

const MOCK_COLORS = {
  arms: LegoColor.Orange,
  body: LegoColor.Red,
  eyes: LegoColor.TransNeonRed,
  face: LegoColor.DarkGray,
  feet: LegoColor.Red,
  mask: LegoColor.Red,
};

describe('maskColor', () => {
  describe('getEffectiveMataMaskColor', () => {
    const toaMata: BaseMatoran & RecruitedCharacterData = {
      colors: MOCK_COLORS,
      element: ElementTribe.Fire,
      exp: 0,
      id: 'Toa_Tahu',
      mask: Mask.Hau,
      name: 'Toa Tahu',
      stage: MatoranStage.ToaMata,
    };

    test('returns PearlGold when gold mask quests completed', () => {
      expect(getEffectiveMataMaskColor(toaMata, ['mnog_kini_nui_arrival'])).toBe(
        LegoColor.PearlGold
      );
      expect(getEffectiveMataMaskColor(toaMata, ['mnog_gali_call'])).toBe(LegoColor.PearlGold);
    });

    test('returns base mask color when no quests completed', () => {
      expect(getEffectiveMataMaskColor(toaMata, [])).toBe(LegoColor.Red);
    });
  });

  describe('getEffectiveNuvaMaskColor', () => {
    const toaNuva: BaseMatoran & RecruitedCharacterData = {
      colors: MOCK_COLORS,
      element: ElementTribe.Fire,
      exp: 0,
      id: 'Toa_Tahu_Nuva',
      mask: Mask.HauNuva,
      name: 'Toa Tahu Nuva',
      stage: MatoranStage.ToaNuva,
    };

    test('returns LightGray when nuva symbols sequestered', () => {
      expect(getEffectiveNuvaMaskColor(toaNuva, [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID])).toBe(
        LegoColor.LightGray
      );
    });

    test('returns base mask color when symbols not sequestered', () => {
      expect(getEffectiveNuvaMaskColor(toaNuva, [])).toBe(LegoColor.Red);
    });
  });

  describe('getEffectiveMaskColor', () => {
    test('delegates to Mata for Toa Mata', () => {
      const toaMata: BaseMatoran & RecruitedCharacterData = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        exp: 0,
        id: 'Toa_Tahu',
        mask: Mask.Hau,
        name: 'Toa Tahu',
        stage: MatoranStage.ToaMata,
      };
      expect(getEffectiveMaskColor(toaMata, ['mnog_kini_nui_arrival'])).toBe(LegoColor.PearlGold);
    });

    test('delegates to Nuva for Toa Nuva', () => {
      const toaNuva: BaseMatoran & RecruitedCharacterData = {
        colors: MOCK_COLORS,
        element: ElementTribe.Fire,
        exp: 0,
        id: 'Toa_Tahu_Nuva',
        mask: Mask.HauNuva,
        name: 'Toa Tahu Nuva',
        stage: MatoranStage.ToaNuva,
      };
      expect(getEffectiveMaskColor(toaNuva, [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID])).toBe(
        LegoColor.LightGray
      );
    });
  });
});
