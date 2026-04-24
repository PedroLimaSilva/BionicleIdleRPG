import { buildMataKit2001WithPalette } from './mataKitShared2001Attach';
import { KOPAKA_MATA_KIT_PALETTE } from './kopakaMataKitPalette';
import type { KitSocketAttachment } from '../../../types/KitParts';

export const KOPAKA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> =
  buildMataKit2001WithPalette(KOPAKA_MATA_KIT_PALETTE);
