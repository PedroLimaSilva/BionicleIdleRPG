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
  face: LegoColor.DarkGray,
  mask: LegoColor.Red,
  body: LegoColor.Red,
  feet: LegoColor.Red,
  arms: LegoColor.Orange,
  eyes: LegoColor.TransNeonRed,
};

describe('maskColor', () => {
  describe('getEffectiveMataMaskColor', () => {
    const toaMata: BaseMatoran & RecruitedCharacterData = {
      id: 'Toa_Tahu',
      name: 'Toa Tahu',
      element: ElementTribe.Fire,
      stage: MatoranStage.ToaMata,
      mask: Mask.Hau,
      colors: MOCK_COLORS,
      exp: 0,
    };

    test('returns user maskColorOverride when set', () => {
      const matoran = { ...toaMata, maskColorOverride: LegoColor.PearlGold };
      expect(getEffectiveMataMaskColor(matoran, ['mnog_kini_nui_arrival'])).toBe(LegoColor.PearlGold);
    });

    test('returns PearlGold when gold mask quests completed', () => {
      expect(getEffectiveMataMaskColor(toaMata, ['mnog_kini_nui_arrival'])).toBe(LegoColor.PearlGold);
      expect(getEffectiveMataMaskColor(toaMata, ['mnog_gali_call'])).toBe(LegoColor.PearlGold);
    });

    test('returns base mask color when no quests completed', () => {
      expect(getEffectiveMataMaskColor(toaMata, [])).toBe(LegoColor.Red);
    });
  });

  describe('getEffectiveNuvaMaskColor', () => {
    const toaNuva: BaseMatoran & RecruitedCharacterData = {
      id: 'Toa_Tahu_Nuva',
      name: 'Toa Tahu Nuva',
      element: ElementTribe.Fire,
      stage: MatoranStage.ToaNuva,
      mask: Mask.HauNuva,
      colors: MOCK_COLORS,
      exp: 0,
    };

    test('returns user maskColorOverride when set', () => {
      const matoran = { ...toaNuva, maskColorOverride: LegoColor.PearlGold };
      expect(getEffectiveNuvaMaskColor(matoran, [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID])).toBe(
        LegoColor.PearlGold
      );
    });

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
        id: 'Toa_Tahu',
        name: 'Toa Tahu',
        element: ElementTribe.Fire,
        stage: MatoranStage.ToaMata,
        mask: Mask.Hau,
        colors: MOCK_COLORS,
        exp: 0,
      };
      expect(getEffectiveMaskColor(toaMata, ['mnog_kini_nui_arrival'])).toBe(LegoColor.PearlGold);
    });

    test('delegates to Nuva for Toa Nuva', () => {
      const toaNuva: BaseMatoran & RecruitedCharacterData = {
        id: 'Toa_Tahu_Nuva',
        name: 'Toa Tahu Nuva',
        element: ElementTribe.Fire,
        stage: MatoranStage.ToaNuva,
        mask: Mask.HauNuva,
        colors: MOCK_COLORS,
        exp: 0,
      };
      expect(getEffectiveMaskColor(toaNuva, [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID])).toBe(
        LegoColor.LightGray
      );
    });
  });
});
