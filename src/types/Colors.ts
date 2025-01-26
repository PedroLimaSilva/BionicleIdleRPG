type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export const enum LegoColors {
  DarkTurquoise = '#008F9B',
  Red = '#C91A09',
  Lime = '#BBE90B',
  Yellow = '#F2CD37', //yellow
  White = '#FFFFFF',
  LightGray = '#9BA19D',
  Blue = '#0055BF',
  MediumBlue = '#5A93DB',
  DarkOrange = '#A95500',
  Tan = '#E4CD9E',
  TransMediumBlue = '#CFE2F7',
  TransNeonYellow = '#DAB000',
  TransGreen = '#84B68D',
  TransNeonOrange = '#FF800D',
  TransNeonGreen = '#F8F184',
  TransNeonRed = '#FF0040',
}
