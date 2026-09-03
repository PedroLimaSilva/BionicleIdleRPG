import { Color } from 'three';
import { LegoColor } from '../../../../types/Colors';
import {
  deriveDefaultDiscoloration,
  discolorationForColor,
  LEGO_COLOR_DISCOLORATION,
} from './legoColorDiscoloration';

describe('discolorationForColor', () => {
  test('red scuffs toward a faded salmon, not generic gray', () => {
    const spec = discolorationForColor(LegoColor.Red);
    expect(spec).toEqual(LEGO_COLOR_DISCOLORATION[LegoColor.Red]);
    expect(spec.color.toUpperCase()).not.toBe(LegoColor.Red);
  });

  test('gold highlights toward a brighter metal, not plastic tan', () => {
    expect(discolorationForColor(LegoColor.PearlGold)).toEqual(
      LEGO_COLOR_DISCOLORATION[LegoColor.PearlGold]
    );
    expect(discolorationForColor(LegoColor.FlatDarkGold)).toEqual(
      LEGO_COLOR_DISCOLORATION[LegoColor.FlatDarkGold]
    );
  });

  test('black scuffs gray and white yellows', () => {
    expect(discolorationForColor(LegoColor.Black).color.toUpperCase()).toBe('#6D6E5C');
    expect(discolorationForColor(LegoColor.White)).toEqual(
      LEGO_COLOR_DISCOLORATION[LegoColor.White]
    );
  });

  test('hex matching is case-insensitive', () => {
    expect(discolorationForColor('#c91a09')).toEqual(discolorationForColor(LegoColor.Red));
  });

  test('unknown hexes get a derived scuff instead of throwing', () => {
    const spec = discolorationForColor('#123456');
    expect(spec.intensity).toBeGreaterThan(0);
    expect(spec.color.startsWith('#')).toBe(true);
    expect(spec).toEqual(deriveDefaultDiscoloration('#123456'));
  });

  test('near-black custom hexes scuff toward gray', () => {
    const spec = deriveDefaultDiscoloration('#010101');
    expect(spec.color.toUpperCase()).toBe('#6D6E5C');
  });

  test('near-white custom hexes yellow', () => {
    const spec = deriveDefaultDiscoloration('#FEFEFE');
    expect(spec.color.toUpperCase()).toBe('#E4CD9E');
  });

  test('derived midtones are lighter than the source', () => {
    const source = new Color('#336699');
    const derived = new Color(deriveDefaultDiscoloration('#336699').color);
    const srcHsl = { h: 0, l: 0, s: 0 };
    const dstHsl = { h: 0, l: 0, s: 0 };
    source.getHSL(srcHsl);
    derived.getHSL(dstHsl);
    expect(dstHsl.l).toBeGreaterThan(srcHsl.l);
  });
});
