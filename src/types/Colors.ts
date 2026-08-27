type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export const enum LegoColor {
  Black = '#05131D',
  Blue = '#0055BF',
  Brown = '#583927',
  DarkBlue = '#0A3463',
  DarkBluishGray = '#6C6E68',
  DarkGray = '#6D6E5C',
  DarkGreen = '#184632',
  DarkOrange = '#A95500',
  DarkRed = '#720E0F',
  DarkTurquoise = '#008F9B',
  FlatDarkGold = '#B48455',
  Green = '#237841',
  LightBrown = '#7C503A',
  LightGray = '#9BA19D',
  Lime = '#BBE90B',
  MediumBlue = '#5A93DB',
  Orange = '#FE8A18',
  PearlGold = '#AA7F2E',
  Purple = '#81007B',
  Red = '#C91A09', // Trans Red
  SandBlue = '#6074A1',
  Tan = '#E4CD9E',
  TransDarkBlue = '#0020A0',
  TransGreen = '#84B68D',
  TransLightBlue = '#AEEFEC',
  TransMediumBlue = '#CFE2F7',
  TransNeonGreen = '#F8F184',
  TransNeonOrange = '#FF800D',
  TransNeonPink = '#FF69B4',
  TransNeonRed = '#FF0040',
  TransNeonYellow = '#DAB000',
  White = '#FFFFFF',
  Yellow = '#F2CD37',
}
