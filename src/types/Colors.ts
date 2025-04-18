type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export const enum LegoColor {
  Black = '#05131D',
  Brown = '#583927',
  Green = '#237841',
  DarkTurquoise = '#008F9B',
  Red = '#C91A09',
  Lime = '#BBE90B',
  Yellow = '#F2CD37', //yellow
  White = '#FFFFFF',
  LightGray = '#9BA19D',
  Blue = '#0055BF',
  MediumBlue = '#5A93DB',
  Orange = '#FE8A18',
  DarkGray = '#6D6E5C',
  DarkOrange = '#A95500',
  SandBlue = '#6074A1',
  PearlGold = '#AA7F2E',
  Purple = '#81007B',
  Tan = '#E4CD9E',
  TransDarkBlue = '#0020A0',
  TransMediumBlue = '#CFE2F7',
  TransNeonYellow = '#DAB000',
  TransGreen = '#84B68D',
  TransNeonOrange = '#FF800D',
  TransNeonGreen = '#F8F184',
  TransNeonRed = '#FF0040',
}
