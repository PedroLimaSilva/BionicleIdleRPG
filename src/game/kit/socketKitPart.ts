import { KIT_2001_NODES, type Kit2001NodeName } from './nodes/kit2001Nodes';
import { KIT_2003_NODES, type Kit2003NodeName } from './nodes/kit2003Nodes';
import { KIT_2004_NODES, type Kit2004NodeName } from './nodes/kit2004Nodes';
import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../types/KitParts';

/**
 * Three.js `PropertyBinding.sanitizeNodeName`: spaces → `_`, then strip
 * reserved track-binding characters `[].:/`.
 * `AxleMod2L.ArmUpper.L` → `AxleMod2LArmUpperL`.
 */
export function sanitizeKitSocketName(name: string): string {
  return name.replace(/\s/g, '_').replace(/[[\].:/]/g, '');
}

/** Collapse Blender / kit punctuation so `Lhikan Sword` matches `LhikanSword`. */
export function compactKitName(name: string): string {
  return name.replace(/[_\s.]/g, '');
}

export type KitYear = '2001' | '2003' | '2004';

export type KitPartMatch = {
  kit: KitYear;
  kitNodeName: string;
};

export type KitPartCatalogEntry = KitPartMatch;

/**
 * All registered kit GLB node names, tagged by year.
 * Longest compact prefix wins so `SocketDouble1L` beats `Socket`.
 */
export const KIT_PART_CATALOG: readonly KitPartCatalogEntry[] = [
  ...Object.values(KIT_2001_NODES).map((kitNodeName) => ({
    kit: '2001' as const,
    kitNodeName,
  })),
  ...Object.values(KIT_2003_NODES).map((kitNodeName) => ({
    kit: '2003' as const,
    kitNodeName,
  })),
  ...Object.values(KIT_2004_NODES).map((kitNodeName) => ({
    kit: '2004' as const,
    kitNodeName,
  })),
];

type PrefixCandidate = { compact: string; entry: KitPartCatalogEntry };

function buildCandidates(
  catalog: readonly KitPartCatalogEntry[],
  aliases: Readonly<Record<string, string>>
): PrefixCandidate[] {
  const byKitName = new Map(catalog.map((entry) => [entry.kitNodeName, entry]));
  const candidates: PrefixCandidate[] = catalog.map((entry) => ({
    compact: compactKitName(entry.kitNodeName),
    entry,
  }));

  for (const [alias, target] of Object.entries(aliases)) {
    const entry = byKitName.get(target);
    if (entry) {
      candidates.push({ compact: compactKitName(alias), entry });
    }
  }

  return candidates;
}

/**
 * Resolve a socket to a kit part.
 *
 * Blender names are `{KitPart}(.{qualifier})*` — the token before the first
 * `.` is the kit part (`AxleMod2L.ArmUpper.L` → `AxleMod2L`). Qualifiers are
 * optional (`MetruBrain`).
 *
 * Runtime `Object3D.name` values have the dots stripped; those fall back to
 * the longest compact prefix against registered kit nodes (and aliases).
 */
export function kitPartFromSocketName(
  socketName: string,
  aliases: Readonly<Record<string, string>> = {},
  catalog: readonly KitPartCatalogEntry[] = KIT_PART_CATALOG
): KitPartMatch | undefined {
  const candidates = buildCandidates(catalog, aliases);
  const dot = socketName.indexOf('.');
  if (dot !== -1) {
    const prefix = compactKitName(socketName.slice(0, dot));
    const exact = candidates
      .filter((row) => row.compact === prefix)
      .sort((a, b) => b.compact.length - a.compact.length)[0];
    if (exact) return exact.entry;
  }

  const needle = compactKitName(socketName.replace(/_\d+$/, ''));
  let best: KitPartMatch | undefined;
  let bestLen = 0;
  for (const row of candidates) {
    if (row.compact.length > bestLen && needle.startsWith(row.compact)) {
      best = row.entry;
      bestLen = row.compact.length;
    }
  }
  return best;
}

export type KitAttachmentsByYear = {
  kit2001: Record<string, KitSocketAttachment<Kit2001NodeName>>;
  kit2003: Record<string, KitSocketAttachment<Kit2003NodeName>>;
  kit2004: Record<string, KitSocketAttachment<Kit2004NodeName>>;
};

/**
 * Build per-kit attachment maps from socket names using {@link kitPartFromSocketName}.
 * Keys are Three.js runtime names so `useKitAttachments` can look them up.
 */
export function buildKitAttachmentsFromSocketNames(
  socketNames: readonly string[],
  options: {
    aliases?: Readonly<Record<string, string>>;
    catalog?: readonly KitPartCatalogEntry[];
    materialColorsFor: (
      kitNodeName: string
    ) => Partial<Record<string, KitMaterialSlotEntry>> | undefined;
  }
): KitAttachmentsByYear {
  const aliases = options.aliases ?? {};
  const catalog = options.catalog ?? KIT_PART_CATALOG;
  const kit2001: Record<string, KitSocketAttachment<Kit2001NodeName>> = {};
  const kit2003: Record<string, KitSocketAttachment<Kit2003NodeName>> = {};
  const kit2004: Record<string, KitSocketAttachment<Kit2004NodeName>> = {};

  for (const socketName of socketNames) {
    const match = kitPartFromSocketName(socketName, aliases, catalog);
    if (!match) continue;

    const key = sanitizeKitSocketName(socketName);
    const row = {
      kitNodeName: match.kitNodeName,
      materialColors: options.materialColorsFor(match.kitNodeName),
    };

    if (match.kit === '2001') {
      kit2001[key] = row as KitSocketAttachment<Kit2001NodeName>;
    } else if (match.kit === '2003') {
      kit2003[key] = row as KitSocketAttachment<Kit2003NodeName>;
    } else {
      kit2004[key] = row as KitSocketAttachment<Kit2004NodeName>;
    }
  }

  return { kit2001, kit2003, kit2004 };
}
