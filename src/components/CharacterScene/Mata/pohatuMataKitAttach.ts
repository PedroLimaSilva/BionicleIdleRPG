import { buildMataKit2001WithPalette } from './mataKitShared2001Attach';
import { POHATU_MATA_KIT_PALETTE } from './pohatuMataKitPalette';
import type { KitSocketAttachment } from '../../../types/KitParts';

export const POHATU_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> =
  buildMataKit2001WithPalette(POHATU_MATA_KIT_PALETTE);
