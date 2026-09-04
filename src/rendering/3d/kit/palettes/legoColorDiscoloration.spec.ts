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

  test('light colors use black tint at reduced mix instead of the default', () => {
    const blackTint = { color: LegoColor.Black, intensity: 0.75 };
    expect(Object.keys(LEGO_COLOR_DISCOLORATION).sort()).toEqual(
      [LegoColor.LightGray, LegoColor.Lime, LegoColor.Orange, LegoColor.Tan, LegoColor.White].sort()
    );
    expect(discolorationForColor(LegoColor.White)).toEqual(blackTint);
    expect(discolorationForColor(LegoColor.LightGray)).toEqual(blackTint);
    expect(discolorationForColor(LegoColor.Lime)).toEqual(blackTint);
    expect(discolorationForColor(LegoColor.Orange)).toEqual(blackTint);
    expect(discolorationForColor(LegoColor.Tan)).toEqual(blackTint);
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
