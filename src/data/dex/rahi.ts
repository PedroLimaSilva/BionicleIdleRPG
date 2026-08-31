import { LegoColor } from '../../types/Colors';
import { ElementTribe, Mask, MatoranColors, MatoranStage } from '../../types/Matoran';

/** Minimal dex colors for element-themed card chrome; rahi have no 2D avatar yet. */
function rahiColors(body: LegoColor, accent: LegoColor): MatoranColors {
  const colored = { main: body, secondary: accent };
  return {
    arms: colored,
    body: colored,
    eyes: accent,
    face: body,
    feet: colored,
    legs: colored,
    mask: body,
  };
}

export const RAHI_DEX = {
  muaka: {
    colors: rahiColors(LegoColor.SandBlue, LegoColor.Tan),
    element: ElementTribe.Ice,
    id: 'muaka',
    mask: Mask.Pakari,
    name: 'Muaka',
    stage: MatoranStage.Rahi,
  },
  nui_jaga: {
    colors: rahiColors(LegoColor.Tan, LegoColor.Orange),
    element: ElementTribe.Stone,
    id: 'nui_jaga',
    mask: Mask.Pakari,
    name: 'Nui-Jaga',
    stage: MatoranStage.Rahi,
  },
  nui_rama: {
    colors: rahiColors(LegoColor.DarkGray, LegoColor.Orange),
    element: ElementTribe.Air,
    id: 'nui_rama',
    mask: Mask.Pakari,
    name: 'Nui-Rama',
    stage: MatoranStage.Rahi,
  },
};
