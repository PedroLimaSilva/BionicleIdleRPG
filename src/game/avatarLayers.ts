import { Mask, MatoranStage } from '../types/Matoran';
import { getGreatMaskVariant } from './greatMasks';

/**
 * Grayscale head sculpts in `public/avatar/`. Each entry names the eye/brain layer and the
 * head layer that `MatoranAvatar` tints and stacks under the Kanohi.
 */
const HEAD_LAYERS = {
  /** 2001 Matoran head (Diminished / Rebuilt). */
  mc: { brain: 'McBrain', face: 'McFace' },
  /** 2004 Metru head, shared by Metru Matoran and the Toa Metru rigs. */
  metru: { brain: 'MetruBrain', face: 'MetruFace' },
  /** Toa Mata / Nuva / Turaga head. */
  standard: { brain: 'Brain', face: 'Face' },
} as const;

export type AvatarLayerNames = {
  /** File name (no extension) under `public/avatar/`. */
  brain: string;
  /** File name (no extension) under `public/avatar/`. */
  face: string;
  /** File name (no extension) under `public/avatar/Kanohi/`. */
  mask: Mask;
};

/**
 * Resolve the three composited avatar layers for a character. The head sculpt follows the
 * stage, and Toa Metru wear the Great sculpt of their Kanohi so the 2D avatar matches what
 * `useGreatMask` attaches to the 3D rig.
 */
export function getAvatarLayerNames(stage: MatoranStage, mask: Mask): AvatarLayerNames {
  switch (stage) {
    case MatoranStage.Diminished:
    case MatoranStage.Rebuilt:
      return { ...HEAD_LAYERS.mc, mask };
    case MatoranStage.Metru:
      return { ...HEAD_LAYERS.metru, mask };
    case MatoranStage.ToaMetru:
      return { ...HEAD_LAYERS.metru, mask: getGreatMaskVariant(mask) };
    default:
      return { ...HEAD_LAYERS.standard, mask };
  }
}
