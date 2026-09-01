import type { Kit2001NodeName } from './nodes/kit2001Nodes';
import { KIT_2001_NODES } from './nodes/kit2001Nodes';
import type { Kit2003NodeName } from './nodes/kit2003Nodes';
import type { Kit2004NodeName } from './nodes/kit2004Nodes';

/** Opt-in bevel map: `true` means `public/{kitStem}/{node}_bevel.webp` exists. */
export type KitBevelNodeAllowlist<T extends string> = Partial<Record<T, true>>;

/**
 * Kit nodes with a baked bevel map at `public/{kitStem}/{node}_bevel.webp`.
 *
 * This record is the opt-in. Lookup is `KIT_2001_BEVEL_NODES[node] === true`.
 * Unlisted parts are never fetched and keep procedural / screen-space
 * weathering — use that for axles, pins, bushings, and other low-detail
 * connectors that are not worth a high-fidelity bake.
 *
 * Add a node when its bake lands, e.g. `MataChest: true`.
 */
export const KIT_2001_BEVEL_NODES: KitBevelNodeAllowlist<Kit2001NodeName> = {};

export const KIT_2003_BEVEL_NODES: KitBevelNodeAllowlist<Kit2003NodeName> = {};

export const KIT_2004_BEVEL_NODES: KitBevelNodeAllowlist<Kit2004NodeName> = {};

const EMPTY_ALLOWLIST: KitBevelNodeAllowlist<string> = {};

const BEVEL_NODES_BY_STEM: Record<string, KitBevelNodeAllowlist<string>> = {
  kit_2001: KIT_2001_BEVEL_NODES,
  kit_2003: KIT_2003_BEVEL_NODES,
  kit_2004: KIT_2004_BEVEL_NODES,
};

/** Low-detail 2001 connectors that should stay off the bevel allowlist. */
export const KIT_2001_BEVEL_SKIP_CONNECTORS: readonly Kit2001NodeName[] = [
  KIT_2001_NODES.Axle2L,
  KIT_2001_NODES.Axle3L,
  KIT_2001_NODES.Axle6L,
  KIT_2001_NODES.AxlePin,
  KIT_2001_NODES.Pin2L,
];

export function declaredKitBevelNodesForStem(stem: string): KitBevelNodeAllowlist<string> {
  return BEVEL_NODES_BY_STEM[stem] ?? EMPTY_ALLOWLIST;
}

export function declaredKitBevelNodeNames(stem: string): string[] {
  return Object.keys(declaredKitBevelNodesForStem(stem));
}

export function kitNodeHasDeclaredBevelMap(stem: string, kitNodeName: string): boolean {
  return declaredKitBevelNodesForStem(stem)[kitNodeName] === true;
}

export function filterDeclaredKitBevelNodes(
  stem: string,
  kitNodeNames: readonly string[]
): string[] {
  const declared = declaredKitBevelNodesForStem(stem);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const name of kitNodeNames) {
    if (declared[name] !== true || seen.has(name)) continue;
    seen.add(name);
    out.push(name);
  }
  return out;
}
