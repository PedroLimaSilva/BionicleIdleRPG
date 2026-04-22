import type {
  KitMaterialColorSource,
  KitMaterialSlotEntry,
  KitMaterialSlotOverride,
  KitSocketAttachment,
} from '../../types/KitParts';

export function isKitMaterialColorSource(x: KitMaterialSlotEntry): x is KitMaterialColorSource {
  return 'kind' in x && (x.kind === 'lego' || x.kind === 'palette');
}

export function normalizeKitMaterialSlotEntry(entry: KitMaterialSlotEntry): KitMaterialSlotOverride {
  return isKitMaterialColorSource(entry) ? { color: entry } : entry;
}

function normalizeMaterialKey(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * Material names (from kit GLB, case-insensitive) that must not receive weathered metal,
 * as declared per-socket in `materialColors` with `skipWeatheredMetal: true`.
 */
export function collectSkipWeatheredMetalMaterialKeys(
  attachments: Record<string, KitSocketAttachment>
): Set<string> {
  const keys = new Set<string>();
  for (const row of Object.values(attachments)) {
    if (!row.materialColors) continue;
    for (const [slotName, entry] of Object.entries(row.materialColors)) {
      if (!entry) continue;
      const spec = normalizeKitMaterialSlotEntry(entry);
      if (spec.skipWeatheredMetal) keys.add(normalizeMaterialKey(slotName));
    }
  }
  return keys;
}
