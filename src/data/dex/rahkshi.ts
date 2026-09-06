import { LegoColor } from '../../types/Colors';
import { KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { ElementTribe, Mask, MatoranColors, MatoranStage } from '../../types/Matoran';

/** Card chrome colors per power; no 2D Rahkshi avatar yet. */
const RAHKSHI_CARD_COLORS: Partial<Record<KraataPower, { armor: LegoColor; joint: LegoColor }>> = {
  [KraataPower.Chameleon]: { armor: LegoColor.Red, joint: LegoColor.PearlGold },
  [KraataPower.Fragmentation]: { armor: LegoColor.Brown, joint: LegoColor.Brown },
};

function rahkshiColors(armor: LegoColor, joint: LegoColor): MatoranColors {
  const colored = { main: armor, secondary: joint };
  return {
    arms: colored,
    body: colored,
    eyes: joint,
    face: armor,
    feet: colored,
    legs: colored,
    mask: armor,
  };
}

function rahkshiEntry(power: KraataPower) {
  const card = RAHKSHI_CARD_COLORS[power];
  if (!card) {
    throw new Error(`Missing Rahkshi dex card colors for ${power}`);
  }
  const powerName = KRAATA_POWER_NAMES[power];
  return {
    colors: rahkshiColors(card.armor, card.joint),
    element: ElementTribe.Shadow,
    id: power,
    mask: Mask.Pakari,
    name: `Rahkshi of ${powerName}`,
    stage: MatoranStage.Rahkshi,
  };
}

/** Rahkshi specimens in the character dex — one entry per kraata power. */
export const RAHKSHI_DEX = {
  [KraataPower.Chameleon]: rahkshiEntry(KraataPower.Chameleon),
  [KraataPower.Fragmentation]: rahkshiEntry(KraataPower.Fragmentation),
};
