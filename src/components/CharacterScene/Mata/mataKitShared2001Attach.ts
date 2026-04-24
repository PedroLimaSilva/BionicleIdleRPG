import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../types/KitParts';
import { TAHU_MATA_KIT_2001_ATTACHMENTS } from './tahuMataKitAttach';

/** Sockets shared by non-Tahu Mata (same kit pieces as Tahu; no sword / flame on other Toa). */
const OMIT_TAHU_ONLY: ReadonlySet<string> = new Set(['TahuSword', 'TahuSwordFlame']);

const MATA_SHARED_KIT_2001_BASE: Record<string, KitSocketAttachment> = Object.fromEntries(
  Object.entries(TAHU_MATA_KIT_2001_ATTACHMENTS).filter(([k]) => !OMIT_TAHU_ONLY.has(k))
) as Record<string, KitSocketAttachment>;

/**
 * Clone the shared attachment table with a per-Toa plastic / glow palette. Slot keys that exist
 * in `palette` override Tahu’s row; other slots keep Tahu’s spec (e.g. partial `{ Main: … }`).
 */
export function buildMataKit2001WithPalette(
  palette: Partial<Record<string, KitMaterialSlotEntry>>
): Record<string, KitSocketAttachment> {
  const out: Record<string, KitSocketAttachment> = {};
  for (const [socketName, row] of Object.entries(MATA_SHARED_KIT_2001_BASE)) {
    const materialColors = row.materialColors
      ? (Object.fromEntries(
          Object.entries(row.materialColors).map(([slot, spec]) => [
            slot,
            palette[slot] ?? spec,
          ])
        ) as KitSocketAttachment['materialColors'])
      : undefined;
    out[socketName] = { kitNodeName: row.kitNodeName, materialColors };
  }
  return out;
}
