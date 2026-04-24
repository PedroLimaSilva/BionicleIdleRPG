import { buildMataKit2001WithPalette } from './mataKitShared2001Attach';
import { ONUA_MATA_KIT_PALETTE } from './onuaMataKitPalette';
import type { KitSocketAttachment } from '../../../types/KitParts';

export const ONUA_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> =
  buildMataKit2001WithPalette(ONUA_MATA_KIT_PALETTE);
