import type { KitMaterialSlotEntry, KitSocketAttachment } from '../../../../types/KitParts';
import { KIT_2001_MATERIAL_SLOTS, type Kit2001MaterialSlotMap } from './kit2001MaterialSlots';
import { KIT_2001_NODES, type Kit2001NodeName } from './kit2001Nodes';
import { KIT_2003_MATERIAL_SLOTS, type Kit2003MaterialSlotMap } from './kit2003MaterialSlots';
import { KIT_2003_NODES, type Kit2003NodeName } from './kit2003Nodes';
import { KIT_2004_MATERIAL_SLOTS, type Kit2004MaterialSlotMap } from './kit2004MaterialSlots';
import { KIT_2004_NODES, type Kit2004NodeName } from './kit2004Nodes';

export type Kit2001MaterialSlotFor<TKey extends keyof typeof KIT_2001_NODES> =
  Kit2001MaterialSlotMap[TKey][number];

export type Kit2003MaterialSlotFor<TKey extends keyof typeof KIT_2003_NODES> =
  Kit2003MaterialSlotMap[TKey][number];

export type Kit2004MaterialSlotFor<TKey extends keyof typeof KIT_2004_NODES> =
  Kit2004MaterialSlotMap[TKey][number];

export type Kit2001MaterialSlotName = Kit2001MaterialSlotFor<keyof typeof KIT_2001_NODES>;
export type Kit2003MaterialSlotName = Kit2003MaterialSlotFor<keyof typeof KIT_2003_NODES>;
export type Kit2004MaterialSlotName = Kit2004MaterialSlotFor<keyof typeof KIT_2004_NODES>;
export type KitMaterialSlotName =
  | Kit2001MaterialSlotName
  | Kit2003MaterialSlotName
  | Kit2004MaterialSlotName
  | KitMaterialSlotLegacyAlias;

/** Legacy attachment keys kept for backward-compatible palette spreads. */
export const KIT_MATERIAL_SLOT_LEGACY_ALIASES = ['Nuju Eyes', 'Solid_Black.002'] as const;

export type KitMaterialSlotLegacyAlias = (typeof KIT_MATERIAL_SLOT_LEGACY_ALIASES)[number];

export function isKnownKitMaterialSlotName(name: string): name is KitMaterialSlotName {
  if ((KIT_MATERIAL_SLOT_LEGACY_ALIASES as readonly string[]).includes(name)) return true;
  return (
    Object.values(KIT_2001_MATERIAL_SLOTS).some((slots) =>
      (slots as readonly string[]).includes(name)
    ) ||
    Object.values(KIT_2003_MATERIAL_SLOTS).some((slots) =>
      (slots as readonly string[]).includes(name)
    ) ||
    Object.values(KIT_2004_MATERIAL_SLOTS).some((slots) =>
      (slots as readonly string[]).includes(name)
    )
  );
}

export type Kit2001SocketAttachment = KitSocketAttachment<Kit2001NodeName, Kit2001MaterialSlotName>;

export type Kit2003SocketAttachment = KitSocketAttachment<Kit2003NodeName, Kit2003MaterialSlotName>;

export type Kit2004SocketAttachment = KitSocketAttachment<Kit2004NodeName, Kit2004MaterialSlotName>;

/** Per-node strict attachment row (inline configs / new sockets). */
export type Kit2001SocketAttachmentFor<TKey extends keyof typeof KIT_2001_NODES> =
  KitSocketAttachment<(typeof KIT_2001_NODES)[TKey], Kit2001MaterialSlotFor<TKey>>;

export type Kit2003SocketAttachmentFor<TKey extends keyof typeof KIT_2003_NODES> =
  KitSocketAttachment<(typeof KIT_2003_NODES)[TKey], Kit2003MaterialSlotFor<TKey>>;

export type Kit2004SocketAttachmentFor<TKey extends keyof typeof KIT_2004_NODES> =
  KitSocketAttachment<(typeof KIT_2004_NODES)[TKey], Kit2004MaterialSlotFor<TKey>>;

export type KitMaterialColorsFor<
  TKit extends '2001' | '2003' | '2004',
  TKey extends TKit extends '2001'
    ? keyof typeof KIT_2001_NODES
    : TKit extends '2003'
      ? keyof typeof KIT_2003_NODES
      : keyof typeof KIT_2004_NODES,
> = Partial<
  Record<
    TKit extends '2001'
      ? Kit2001MaterialSlotFor<TKey & keyof typeof KIT_2001_NODES>
      : TKit extends '2003'
        ? Kit2003MaterialSlotFor<TKey & keyof typeof KIT_2003_NODES>
        : Kit2004MaterialSlotFor<TKey & keyof typeof KIT_2004_NODES>,
    KitMaterialSlotEntry
  >
>;

/** Reverse lookup: runtime kit node name -> registry key. */
function invertKitNodeRegistry(
  registry: Record<string, string>
): Map<string, keyof typeof registry> {
  const map = new Map<string, keyof typeof registry>();
  for (const [key, value] of Object.entries(registry)) {
    map.set(value, key as keyof typeof registry);
  }
  return map;
}

const KIT_NODE_LOOKUP = {
  '2001': invertKitNodeRegistry(KIT_2001_NODES),
  '2003': invertKitNodeRegistry(KIT_2003_NODES),
  '2004': invertKitNodeRegistry(KIT_2004_NODES),
} as const;

const KIT_SLOT_LOOKUP = {
  '2001': KIT_2001_MATERIAL_SLOTS,
  '2003': KIT_2003_MATERIAL_SLOTS,
  '2004': KIT_2004_MATERIAL_SLOTS,
} as const;

export type KitMaterialSlotValidationIssue = {
  kit: '2001' | '2003' | '2004';
  socketName: string;
  kitNodeName: string;
  slotName: string;
  allowedSlots: readonly string[];
};

function resolveKitForNodeName(kitNodeName: string): '2001' | '2003' | '2004' | null {
  for (const kit of ['2001', '2003', '2004'] as const) {
    if (KIT_NODE_LOOKUP[kit].has(kitNodeName)) return kit;
  }
  return null;
}

export function validateAttachmentMaterialSlots(
  attachments: Record<string, KitSocketAttachment<string>>,
  kitHint?: '2001' | '2003' | '2004'
): KitMaterialSlotValidationIssue[] {
  const issues: KitMaterialSlotValidationIssue[] = [];

  for (const [socketName, row] of Object.entries(attachments)) {
    if (!row.materialColors) continue;

    const kit = kitHint ?? resolveKitForNodeName(row.kitNodeName);
    if (!kit) continue;

    const registryKey = KIT_NODE_LOOKUP[kit].get(row.kitNodeName);
    if (!registryKey) continue;

    const slotRegistry = KIT_SLOT_LOOKUP[kit] as Record<string, readonly string[]>;
    const allowedSlots = slotRegistry[registryKey] ?? [];
    const allowed = new Set<string>(allowedSlots);
    for (const slotName of Object.keys(row.materialColors)) {
      if (!allowed.has(slotName)) {
        issues.push({
          allowedSlots,
          kit,
          kitNodeName: row.kitNodeName,
          slotName,
          socketName,
        });
      }
    }
  }

  return issues;
}

export function getUnresolvedMaterialSlotNodes(
  slots: Kit2001MaterialSlotMap | Kit2003MaterialSlotMap | Kit2004MaterialSlotMap
): string[] {
  return Object.entries(slots)
    .filter(([, values]) => values.length === 0)
    .map(([key]) => key);
}

export { KIT_2001_MATERIAL_SLOTS, KIT_2003_MATERIAL_SLOTS, KIT_2004_MATERIAL_SLOTS };

/** Nodes registered without a resolvable GLB mesh (see `resolveKitGlbNodeName`). */
export const KIT_2001_MATERIAL_SLOT_EXEMPT = [
  'MataSingleArmPistonLowerR',
  'MataSingleArmPistonUpperR',
] as const satisfies readonly (keyof typeof KIT_2001_NODES)[];

export const KIT_2003_MATERIAL_SLOT_EXEMPT =
  [] as const satisfies readonly (keyof typeof KIT_2003_NODES)[];

export const KIT_2004_MATERIAL_SLOT_EXEMPT =
  [] as const satisfies readonly (keyof typeof KIT_2004_NODES)[];

export function getUnresolvedKit2001MaterialSlotNodes(): string[] {
  return getUnresolvedMaterialSlotNodes(KIT_2001_MATERIAL_SLOTS).filter(
    (key) => !(KIT_2001_MATERIAL_SLOT_EXEMPT as readonly string[]).includes(key)
  );
}

export function getUnresolvedKit2003MaterialSlotNodes(): string[] {
  return getUnresolvedMaterialSlotNodes(KIT_2003_MATERIAL_SLOTS).filter(
    (key) => !(KIT_2003_MATERIAL_SLOT_EXEMPT as readonly string[]).includes(key)
  );
}

export function getUnresolvedKit2004MaterialSlotNodes(): string[] {
  return getUnresolvedMaterialSlotNodes(KIT_2004_MATERIAL_SLOTS).filter(
    (key) => !(KIT_2004_MATERIAL_SLOT_EXEMPT as readonly string[]).includes(key)
  );
}
