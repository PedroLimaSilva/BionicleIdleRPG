/**
 * Kraata head and tail colors from BIONICLE lore (BIONICLEsector01 wiki).
 * Pattern: "Kraata of X are Color1/Color2, while" → head = Color1, tail = Color2.
 * CompositedImage uses [tail, tail, head] for [Base, Tail, Head] layers.
 */

import { GameItemId } from './loot';

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
export function getKraataCompositedColors(id: GameItemId): [string, string, string] {
  const c = KRAATA_SPECIES_COLORS[id];
  if (!c) return [hex('Sand Yellow Metallic'), hex('Sand Yellow Metallic'), hex('Lemon Metallic')];
  return [c.head, c.head, c.tail];
}

/** Kraata species → head/tail colors (wiki: first = head, second = tail). */
export const KRAATA_SPECIES_COLORS: Partial<Record<GameItemId, KraataColors>> = {
  [GameItemId.KraataAccuracy]: { head: hex('Bright Red'), tail: hex('Bright Blue') },
  [GameItemId.KraataAdaptation]: { head: hex('Bright Yellow'), tail: hex('Reddish Gold') },
  [GameItemId.KraataAnger]: { head: hex('Light Grey Metallic'), tail: hex('White') },
  [GameItemId.KraataChainLightning]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Lemon Metallic'),
  },
  [GameItemId.KraataChameleon]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Bright Yellow'),
  },
  [GameItemId.KraataConfusion]: { head: hex('Black'), tail: hex('Reddish Gold') },
  [GameItemId.KraataCyclone]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Light Grey Metallic'),
  },
  [GameItemId.KraataDarkness]: { head: hex('Reddish Gold'), tail: hex('Bright Yellow') },
  [GameItemId.KraataDensityControl]: {
    head: hex('Dark Green'),
    tail: hex('Lemon Metallic'),
  },
  [GameItemId.KraataDisintegration]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Medium Blue'),
  },
  [GameItemId.KraataDodge]: {
    head: hex('Bright Yellow'),
    tail: hex('Sand Yellow Metallic'),
  },
  [GameItemId.KraataElasticity]: {
    head: hex('Bright Yellowish Green'),
    tail: hex('Bright Yellow'),
  },
  [GameItemId.KraataElectricity]: { head: hex('Bright Blue'), tail: hex('Bright Red') },
  [GameItemId.KraataFear]: { head: hex('Reddish Gold'), tail: hex('Bright Red') },
  [GameItemId.KraataFireResistance]: { head: hex('Black'), tail: hex('Bright Red') },
  [GameItemId.KraataFragmentation]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Brick Yellow'),
  },
  [GameItemId.KraataGravity]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Lemon Metallic'),
  },
  [GameItemId.KraataHeatVision]: { head: hex('Black'), tail: hex('Bright Orange') },
  [GameItemId.KraataHunger]: { head: hex('Dark Grey Metallic'), tail: hex('Grey') },
  [GameItemId.KraataIceResistance]: {
    head: hex('Brick Yellow'),
    tail: hex('Dark Green'),
  },
  [GameItemId.KraataIllusion]: { head: hex('Dark Green'), tail: hex('Brick Yellow') },
  [GameItemId.KraataInsectControl]: { head: hex('Bright Yellow'), tail: hex('Black') },
  [GameItemId.KraataInvulnerability]: {
    head: hex('Black'),
    tail: hex('Sand Yellow Metallic'),
  },
  [GameItemId.KraataLaserVision]: {
    head: hex('Lemon Metallic'),
    tail: hex('Dark Green'),
  },
  [GameItemId.KraataMagnetism]: { head: hex('Bright Orange'), tail: hex('Black') },
  [GameItemId.KraataMindReading]: {
    head: hex('Bright Red'),
    tail: hex('Lemon Metallic'),
  },
  [GameItemId.KraataPlantControl]: { head: hex('Reddish Gold'), tail: hex('Black') },
  [GameItemId.KraataPlasma]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [GameItemId.KraataPoison]: {
    head: hex('Lemon Metallic'),
    tail: hex('Bright Yellowish Green'),
  },
  [GameItemId.KraataPowerScream]: { head: hex('Bright Red'), tail: hex('Black') },
  [GameItemId.KraataQuickHealing]: {
    head: hex('Lemon Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [GameItemId.KraataRahiControl]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Black'),
  },
  [GameItemId.KraataShapeshifting]: {
    head: hex('Dark Grey Metallic'),
    tail: hex('Bright Yellowish Green'),
  },
  [GameItemId.KraataShattering]: {
    head: hex('Sand Yellow Metallic'),
    tail: hex('Brick Yellow'),
  },
  [GameItemId.KraataSilence]: {
    head: hex('Bright Yellowish Green'),
    tail: hex('Dark Grey Metallic'),
  },
  [GameItemId.KraataSleep]: {
    head: hex('Reddish Gold'),
    tail: hex('Sand Yellow Metallic'),
  },
  [GameItemId.KraataSlowness]: {
    head: hex('Light Grey Metallic'),
    tail: hex('Sand Blue Metallic'),
  },
  [GameItemId.KraataSonics]: { head: hex('Black'), tail: hex('Bright Yellow') },
  [GameItemId.KraataStasisField]: {
    head: hex('Sand Blue Metallic'),
    tail: hex('Dark Grey Metallic'),
  },
  [GameItemId.KraataTeleportation]: {
    head: hex('Lemon Metallic'),
    tail: hex('Bright Red'),
  },
  [GameItemId.KraataVacuum]: {
    head: hex('Bright Yellow'),
    tail: hex('Bright Yellowish Green'),
  },
  [GameItemId.KraataWeatherControl]: {
    head: hex('Lemon Metallic'),
    tail: hex('Dark Grey Metallic'),
  },
};
