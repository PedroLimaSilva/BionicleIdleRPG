import type {
  KitMaterialColorSource,
  KitMaterialSlotEntry,
  KitMaterialSlotOverride,
} from '../../../types/KitParts';

/**
 * Palette keys the kit pass understands. Bake names must start with one of these
 * (`Main_MataChest_baked`, `Secondary_MataLegModShin_baked`). Mesh identity is
 * optional; Blender `.001` suffixes are ignored.
 */
export const KIT_PALETTE_SLOT_NAMES = ['main', 'secondary', 'metal', 'glow', 'face'] as const;

/** Title-case keys attachments use for palette slots (`Main`, `Secondary`, …). */
export const KIT_PALETTE_SLOT_DISPLAY: Record<(typeof KIT_PALETTE_SLOT_NAMES)[number], string> = {
  face: 'Face',
  glow: 'Glow',
  main: 'Main',
  metal: 'Metal',
  secondary: 'Secondary',
};

/**
 * Config keys allowed in `materialColors` for a kit node, derived from its GLB
 * material names and the runtime aliasing rules in `resolveKitMaterialSlotSpec`.
 */
export function deriveKitConfigSlotNames(materialNames: readonly string[]): readonly string[] {
  const slots = new Set<string>();
  const canonicals = new Set<string>();

  for (const materialName of materialNames) {
    const canonical = canonicalKitSlotName(materialName);
    canonicals.add(canonical);
    if ((KIT_PALETTE_SLOT_NAMES as readonly string[]).includes(canonical)) {
      slots.add(KIT_PALETTE_SLOT_DISPLAY[canonical as (typeof KIT_PALETTE_SLOT_NAMES)[number]]);
      continue;
    }

    const withoutIndex = materialName.replace(/\.\d+$/, '');
    slots.add(withoutIndex);
    if (withoutIndex === 'CLEAR') {
      slots.add('Clear');
    }
  }

  // Secondary-only meshes still accept `Main` (see `resolveKitMaterialSlotSpec`).
  if (canonicals.has('secondary')) {
    slots.add(KIT_PALETTE_SLOT_DISPLAY.main);
  }

  return [...slots].sort();
}

export function normalizeKitSlotName(name: string): string {
  return name.trim().toLowerCase();
}

/**
 * `Main.001` → `main`
 * `Main_baked` → `main`
 * `Main_MataChest_baked` → `main`
 * `Secondary_MataLegModShin_baked` → `secondary`
 * `MataChest_baked` stays `matachest_baked` (no slot prefix — do not guess Main)
 */
export function canonicalKitSlotName(materialName: string): string {
  const withoutIndex = normalizeKitSlotName(materialName).replace(/\.\d+$/, '');
  const withoutBaked = withoutIndex.endsWith('_baked')
    ? withoutIndex.slice(0, -'_baked'.length)
    : withoutIndex;
  const slotToken = withoutBaked.split('_')[0] ?? withoutBaked;
  if ((KIT_PALETTE_SLOT_NAMES as readonly string[]).includes(slotToken)) return slotToken;
  return withoutIndex;
}

export function isKitMaterialColorSource(x: KitMaterialSlotEntry): x is KitMaterialColorSource {
  return 'kind' in x && (x.kind === 'lego' || x.kind === 'palette' || x.kind === 'part');
}

export function normalizeKitMaterialSlotEntry(
  entry: KitMaterialSlotEntry
): KitMaterialSlotOverride {
  return isKitMaterialColorSource(entry) ? { color: entry } : entry;
}
