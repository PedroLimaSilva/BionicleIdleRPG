import { LegoColor } from '../../../../types/Colors';
import {
  DEFAULT_LEGO_DISCOLORATION,
  discolorationForColor,
  LEGO_COLOR_DISCOLORATION,
} from './legoColorDiscoloration';

describe('discolorationForColor', () => {
  test('most colors share protodermis light gray at the same intensity', () => {
    expect(discolorationForColor(LegoColor.Red)).toEqual(DEFAULT_LEGO_DISCOLORATION);
    expect(discolorationForColor(LegoColor.PearlGold)).toEqual(DEFAULT_LEGO_DISCOLORATION);
    expect(discolorationForColor(LegoColor.Black)).toEqual(DEFAULT_LEGO_DISCOLORATION);
    expect(DEFAULT_LEGO_DISCOLORATION.color).toBe(LegoColor.LightGray);
  });

  test('white is the only listed exception: darker gray tint at full mix', () => {
    expect(Object.keys(LEGO_COLOR_DISCOLORATION)).toEqual([LegoColor.White]);
    expect(discolorationForColor(LegoColor.White)).toEqual({
      color: LegoColor.DarkGray,
      intensity: 1,
    });
    expect(discolorationForColor(LegoColor.White).color).not.toBe(DEFAULT_LEGO_DISCOLORATION.color);
  });

  test('hex matching is case-insensitive', () => {
    expect(discolorationForColor('#c91a09')).toEqual(discolorationForColor(LegoColor.Red));
    expect(discolorationForColor('#ffffff')).toEqual(discolorationForColor(LegoColor.White));
  });

  test('unknown hexes use the same default instead of throwing', () => {
    expect(discolorationForColor('#123456')).toEqual(DEFAULT_LEGO_DISCOLORATION);
  });
});
