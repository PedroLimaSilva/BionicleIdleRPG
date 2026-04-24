import type {
  KitMaterialColorSource,
  KitMaterialSlotEntry,
  KitMaterialSlotOverride,
} from '../../types/KitParts';

export function isKitMaterialColorSource(x: KitMaterialSlotEntry): x is KitMaterialColorSource {
  return 'kind' in x && (x.kind === 'lego' || x.kind === 'palette');
}

export function normalizeKitMaterialSlotEntry(entry: KitMaterialSlotEntry): KitMaterialSlotOverride {
  return isKitMaterialColorSource(entry) ? { color: entry } : entry;
}
