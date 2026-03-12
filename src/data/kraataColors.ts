/**
 * Kraata head and tail colors from BIONICLE lore (BIONICLEsector01 wiki).
 * Pattern: "Kraata of X are Color1/Color2, while" → head = Color1, tail = Color2.
 * CompositedImage uses [tail, tail, head] for [Base, Tail, Head] layers.
 */

import { KraataPower } from '../types/Kraata';

/** LEGO color names (as on wiki) to hex. Uses existing LEGO palette and close equivalents. */
const LEGO_COLOR_HEX: Record<string, string> = {
  Black: '#05131D',
  White: '#FFFFFF',
  Blue: '#0055BF',
  'Bright Blue': '#0055BF',
  'Medium Blue': '#5A93DB',
  Red: '#C91A09',
  'Bright Red': '#C91A09',
  Green: '#237841',
  'Dark Green': '#1B5E20',
  Yellow: '#F2CD37',
  'Bright Yellow': '#F2CD37',
  Orange: '#FE8A18',
  'Bright Orange': '#FE8A18',
  'Bright Yellowish Green': '#BBE90B',
  Lime: '#BBE90B',
  Purple: '#81007B',
  Brown: '#583927',
  Tan: '#E4CD9E',
  'Brick Yellow': '#D7C599',
  'Sand Blue': '#6074A1',
  'Sand Blue Metallic': '#6074A1',
  'Sand Yellow Metallic': '#C2A375',
  'Light Grey Metallic': '#9BA19D',
  'Light Gray Metallic': '#9BA19D',
  'Dark Grey Metallic': '#6D6E5C',
  'Dark Gray Metallic': '#6D6E5C',
  Grey: '#6D6E5C',
  Gray: '#6D6E5C',
  'Reddish Gold': '#AA7F2E',
  'Lemon Metallic': '#D4AF37',
  'Pearl Gold': '#AA7F2E',
};

function hex(name: string): string {
  const value = LEGO_COLOR_HEX[name];
  if (!value) throw new Error(`Unknown kraata LEGO color: ${name}`);
  return value;
}

export interface KraataColors {
  /** Head color (first color in "Color1/Color2"). */
  head: string;
  /** Tail color (second color in "Color1/Color2"). */
  tail: string;
}

/**
 * Colors for CompositedImage: [Base, Tail, Head] → first two layers use tail, third uses head.
 * So pass [tail, tail, head].
 */
export function getKraataCompositedColors(power: KraataPower): [string, string, string] {
  const c = KRAATA_SPECIES_COLORS[power];
  if (!c) return [hex('Sand Yellow Metallic'), hex('Sand Yellow Metallic'), hex('Lemon Metallic')];
  return [c.tail, c.head, c.tail];
}

/** Kraata species → head/tail colors (wiki: first = head, second = tail). */
export const KRAATA_SPECIES_COLORS: Partial<Record<KraataPower, KraataColors>> = {
  [KraataPower.Accuracy]: { head: hex('Bright Red'), tail: hex('Bright Blue') },
  [KraataPower.Adaptation]: { head: hex('Bright Yellow'), tail: hex('Reddish Gold') },
  [KraataPower.Anger]: { head: hex('Light Grey Metallic'), tail: hex('White') },
  [KraataPower.ChainLightning]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Lemon Metallic'),
  },
  [KraataPower.Chameleon]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Bright Yellow'),
  },
  [KraataPower.Confusion]: { head: hex('Black'), tail: hex('Reddish Gold') },
  [KraataPower.Cyclone]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Light Grey Metallic'),
  },
  [KraataPower.Darkness]: { head: hex('Reddish Gold'), tail: hex('Bright Yellow') },
  [KraataPower.DensityControl]: {
    head: hex('Dark Green'),
    tail: hex('Lemon Metallic'),
  },
  [KraataPower.Disintegration]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Medium Blue'),
  },
  [KraataPower.Dodge]: {
    head: hex('Bright Yellow'),
    tail: hex('Sand Yellow Metallic'),
  },
  [KraataPower.Elasticity]: {
    head: hex('Bright Yellowish Green'),
    tail: hex('Bright Yellow'),
  },
  [KraataPower.Electricity]: { head: hex('Bright Blue'), tail: hex('Bright Red') },
  [KraataPower.Fear]: { head: hex('Reddish Gold'), tail: hex('Bright Red') },
  [KraataPower.FireResistance]: { head: hex('Black'), tail: hex('Bright Red') },
  [KraataPower.Fragmentation]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Brick Yellow'),
  },
  [KraataPower.Gravity]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Lemon Metallic'),
  },
  [KraataPower.HeatVision]: { head: hex('Black'), tail: hex('Bright Orange') },
  [KraataPower.Hunger]: { head: hex('Dark Grey Metallic'), tail: hex('Grey') },
  [KraataPower.IceResistance]: {
    head: hex('Brick Yellow'),
    tail: hex('Dark Green'),
  },
  [KraataPower.Illusion]: { head: hex('Dark Green'), tail: hex('Brick Yellow') },
  [KraataPower.InsectControl]: { head: hex('Bright Yellow'), tail: hex('Black') },
  [KraataPower.Invulnerability]: {
    head: hex('Black'),
    tail: hex('Sand Yellow Metallic'),
  },
  [KraataPower.LaserVision]: {
    head: hex('Lemon Metallic'),
    tail: hex('Dark Green'),
  },
  [KraataPower.Magnetism]: { head: hex('Bright Orange'), tail: hex('Black') },
  [KraataPower.MindReading]: {
    head: hex('Bright Red'),
    tail: hex('Lemon Metallic'),
  },
  [KraataPower.PlantControl]: { head: hex('Reddish Gold'), tail: hex('Black') },
  [KraataPower.Plasma]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [KraataPower.Poison]: {
    head: hex('Lemon Metallic'),
    tail: hex('Bright Yellowish Green'),
  },
  [KraataPower.PowerScream]: { head: hex('Bright Red'), tail: hex('Black') },
  [KraataPower.QuickHealing]: {
    head: hex('Lemon Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [KraataPower.RahiControl]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Black'),
  },
  [KraataPower.Shapeshifting]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Bright Yellowish Green'),
  },
  [KraataPower.Shattering]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Brick Yellow'),
  },
  [KraataPower.Silence]: {
    head: hex('Bright Yellowish Green'),
    tail: hex('Dark Grey Metallic'),
  },
  [KraataPower.Sleep]: {
    head: hex('Reddish Gold'),
    tail: hex('Sand Yellow Metallic'),
  },
  [KraataPower.Slowness]: {
    head: hex('Light Grey Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [KraataPower.Sonics]: { head: hex('Black'), tail: hex('Bright Yellow') },
  [KraataPower.StasisField]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Dark Grey Metallic'),
  },
  [KraataPower.Teleportation]: {
    head: hex('Lemon Metallic'),
    tail: hex('Bright Red'),
  },
  [KraataPower.Vacuum]: {
    head: hex('Bright Yellow'),
    tail: hex('Bright Yellowish Green'),
  },
  [KraataPower.WeatherControl]: {
    head: hex('Lemon Metallic'),
    tail: hex('Dark Grey Metallic'),
  },
};
