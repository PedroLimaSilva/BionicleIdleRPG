import type { KitSocketAttachment } from '../../../types/KitParts';
import {
  MATORAN_KIT_PALETTE_ARMS,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_FACE,
  MATORAN_KIT_PALETTE_FEET,
} from '../palettes/matoranKitPlayerPalette';

/**
 * Diminished Matoran (2001 kit): keys match socket `nodes` on matoran_master.glb.
 */
export const DIMINISHED_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  FootL: { kitNodeName: 'MatoranFoot', materialColors: MATORAN_KIT_PALETTE_FEET },
  FootR: { kitNodeName: 'MatoranFoot', materialColors: MATORAN_KIT_PALETTE_FEET },
  McArmL: { kitNodeName: 'McArmL', materialColors: MATORAN_KIT_PALETTE_ARMS },
  McArmR: { kitNodeName: 'McArmR', materialColors: MATORAN_KIT_PALETTE_ARMS },
  Head: { kitNodeName: 'McToranFace', materialColors: MATORAN_KIT_PALETTE_FACE },
  McTorso: { kitNodeName: 'McTorso', materialColors: MATORAN_KIT_PALETTE_BODY },
};
