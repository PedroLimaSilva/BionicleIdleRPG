import { buildMataKit2001WithPalette } from './mataKitShared2001Attach';
import { LEWA_MATA_KIT_PALETTE } from './lewaMataKitPalette';
import type { KitSocketAttachment } from '../../../types/KitParts';

export const LEWA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> =
  buildMataKit2001WithPalette(LEWA_MATA_KIT_PALETTE);
