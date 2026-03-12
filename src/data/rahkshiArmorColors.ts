/**
 * Rahkshi armor and joint colors from BIONICLE lore (BIONICLEsector01 wiki).
 * Source: https://biosector01.com/wiki/Kraata_Powers
 *
 * Each section states "Rahkshi of (power) are (armor color)/(joint color)".
 * For single-color Rahkshi, only one color is listed (armor and joints match).
 * For multi-colored: first = armor (head, spine armor, shoulders),
 * second = joints (hands, knees, feet).
 */

import { KraataPower } from '../types/Kraata';

/** LEGO color names (as on wiki) to hex. Extends palette for Rahkshi-specific colors. */
const LEGO_COLOR_HEX: Record<string, string> = {
  Black: '#05131D',
  White: '#FFFFFF',
  Blue: '#0055BF',
  'Bright Blue': '#0055BF',
  'Medium Blue': '#5A93DB',
  'Light Blue': '#5A93DB',
  Red: '#C91A09',
  'Bright Red': '#C91A09',
  Green: '#237841',
  'Dark Green': '#1B5E20',
  Yellow: '#F2CD37',
  'Bright Yellow': '#F2CD37',
  Orange: '#FE8A18',
  'Bright Orange': '#FE8A18',
  Purple: '#81007B',
  'Light Purple': '#A5499B',
  Brown: '#583927',
  Tan: '#E4CD9E',
  Grey: '#6D6E5C',
  Gray: '#6D6E5C',
  Gold: '#D4AF37',
  'Reddish Gold': '#AA7F2E',
  Silver: '#9BA19D',
  Aquamarine: '#00A3B5',
  Magenta: '#C91A9B',
  Maroon: '#722F37',
};

function hex(name: string): string {
  const value = LEGO_COLOR_HEX[name];
  if (!value) throw new Error(`Unknown Rahkshi LEGO color: ${name}`);
  return value;
}

export interface RahkshiArmorColors {
  /** Armor color (head, spine armor, shoulders). */
  armor: string;
  /** Joint color (hands, knees, feet). Same as armor when Rahkshi is single-colored. */
  joint: string;
}

/**
 * Rahkshi power → armor and joint colors.
 * Single-color Rahkshi have armor === joint.
 */
export const RAHKSHI_ARMOR_COLORS: Partial<Record<KraataPower, RahkshiArmorColors>> = {
  [KraataPower.Accuracy]: { armor: hex('Blue'), joint: hex('Purple') },
  [KraataPower.Adaptation]: { armor: hex('Black'), joint: hex('Purple') },
  [KraataPower.Anger]: { armor: hex('White'), joint: hex('White') },
  [KraataPower.ChainLightning]: { armor: hex('Silver'), joint: hex('Silver') },
  [KraataPower.Chameleon]: { armor: hex('Red'), joint: hex('Gold') },
  [KraataPower.Confusion]: { armor: hex('Gray'), joint: hex('Green') },
  [KraataPower.Cyclone]: { armor: hex('Black'), joint: hex('White') },
  [KraataPower.Darkness]: { armor: hex('Black'), joint: hex('Red') },
  [KraataPower.DensityControl]: { armor: hex('Black'), joint: hex('Green') },
  [KraataPower.Disintegration]: { armor: hex('Blue'), joint: hex('Blue') },
  [KraataPower.Dodge]: { armor: hex('Red'), joint: hex('Silver') },
  [KraataPower.Elasticity]: { armor: hex('Tan'), joint: hex('Tan') },
  [KraataPower.Electricity]: { armor: hex('Blue'), joint: hex('White') },
  [KraataPower.Fear]: { armor: hex('Red'), joint: hex('Red') },
  [KraataPower.FireResistance]: { armor: hex('Aquamarine'), joint: hex('Aquamarine') },
  [KraataPower.Fragmentation]: { armor: hex('Brown'), joint: hex('Brown') },
  [KraataPower.Gravity]: { armor: hex('Blue'), joint: hex('Silver') },
  [KraataPower.HeatVision]: { armor: hex('Yellow'), joint: hex('Yellow') },
  [KraataPower.Hunger]: { armor: hex('Black'), joint: hex('Black') },
  [KraataPower.IceResistance]: { armor: hex('Red'), joint: hex('Yellow') },
  [KraataPower.Illusion]: { armor: hex('Tan'), joint: hex('Blue') },
  [KraataPower.InsectControl]: { armor: hex('Orange'), joint: hex('Orange') },
  [KraataPower.Invulnerability]: { armor: hex('Gray'), joint: hex('Gray') },
  [KraataPower.LaserVision]: { armor: hex('Red'), joint: hex('Orange') },
  [KraataPower.Magnetism]: { armor: hex('Black'), joint: hex('Gold') },
  [KraataPower.MindReading]: { armor: hex('Light Purple'), joint: hex('Light Purple') },
  [KraataPower.PlantControl]: { armor: hex('Green'), joint: hex('Brown') },
  [KraataPower.Plasma]: { armor: hex('Tan'), joint: hex('Red') },
  [KraataPower.Poison]: { armor: hex('Green'), joint: hex('Green') },
  [KraataPower.PowerScream]: { armor: hex('Purple'), joint: hex('Purple') },
  [KraataPower.QuickHealing]: { armor: hex('Black'), joint: hex('Brown') },
  [KraataPower.RahiControl]: { armor: hex('Magenta'), joint: hex('Magenta') },
  [KraataPower.Shapeshifting]: { armor: hex('Blue'), joint: hex('Gold') },
  [KraataPower.Shattering]: { armor: hex('Brown'), joint: hex('Brown') },
  [KraataPower.Silence]: { armor: hex('Gray'), joint: hex('Black') },
  [KraataPower.Sleep]: { armor: hex('Maroon'), joint: hex('Maroon') },
  [KraataPower.Slowness]: { armor: hex('Blue'), joint: hex('Yellow') },
  [KraataPower.Sonics]: { armor: hex('Yellow'), joint: hex('Green') },
  [KraataPower.StasisField]: { armor: hex('Blue'), joint: hex('Black') },
  [KraataPower.Teleportation]: { armor: hex('Blue'), joint: hex('Green') },
  [KraataPower.Vacuum]: { armor: hex('Orange'), joint: hex('Black') },
  [KraataPower.WeatherControl]: { armor: hex('Gold'), joint: hex('Gold') },
};

/** Fallback when power has no defined Rahkshi armor colors. */
const FALLBACK: RahkshiArmorColors = {
  armor: hex('Tan'),
  joint: hex('Gold'),
};

export function getRahkshiArmorColors(power: KraataPower): RahkshiArmorColors {
  return RAHKSHI_ARMOR_COLORS[power] ?? FALLBACK;
}
