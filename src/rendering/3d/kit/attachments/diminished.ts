import type { Kit2001SocketAttachment } from '../nodes/kit2001Nodes';
import { KIT_2001_NODES } from '../nodes/kit2001Nodes';
import {
  MATORAN_KIT_PALETTE_ARMS,
  MATORAN_KIT_PALETTE_BODY,
  MATORAN_KIT_PALETTE_FACE,
  MATORAN_KIT_PALETTE_FEET,
} from '../palettes/matoranKitPlayerPalette';

/**
 * Diminished Matoran (2001 kit): keys match socket `nodes` on matoran_master.glb.
 */
export const DIMINISHED_KIT_2001_ATTACHMENTS: Record<string, Kit2001SocketAttachment> = {
  FootL: { kitNodeName: KIT_2001_NODES.MatoranFoot, materialColors: MATORAN_KIT_PALETTE_FEET },
  FootR: { kitNodeName: KIT_2001_NODES.MatoranFoot, materialColors: MATORAN_KIT_PALETTE_FEET },
  Head: { kitNodeName: KIT_2001_NODES.McToranFace, materialColors: MATORAN_KIT_PALETTE_FACE },
  McArmL: { kitNodeName: KIT_2001_NODES.McArmL, materialColors: MATORAN_KIT_PALETTE_ARMS },
  McArmR: { kitNodeName: KIT_2001_NODES.McArmR, materialColors: MATORAN_KIT_PALETTE_ARMS },
  McTorso: { kitNodeName: KIT_2001_NODES.McTorso, materialColors: MATORAN_KIT_PALETTE_BODY },
};
