import type { KitSocketAttachment } from '../../../types/KitParts';
import {
  BOHROK_KIT_2001_ATTACHMENTS,
  BOHROK_FACEPLATE_KIT_2003_ATTACHMENTS,
  BOHROK_KIT_2003_ATTACHMENTS,
} from '../attachments/bohrok';
import { DIMINISHED_KIT_2001_ATTACHMENTS } from '../attachments/diminished';
import { REBUILT_KIT_2001_ATTACHMENTS, REBUILT_KIT_2003_ATTACHMENTS } from '../attachments/rebuilt';
import { GALI_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/gali';
import { KOPAKA_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/kopaka';
import { LEWA_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/lewa';
import { ONUA_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/onua';
import { POHATU_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/pohatu';
import { TAHU_MATA_KIT_2001_ATTACHMENTS } from '../attachments/Toa Mata/tahu';
import {
  LHIKAN_KIT_2001_ATTACHMENTS,
  LHIKAN_KIT_2003_ATTACHMENTS,
  LHIKAN_KIT_2004_ATTACHMENTS,
} from '../attachments/Toa Metru/lhikan';
import {
  GALI_NUVA_KIT_2001_ATTACHMENTS,
  GALI_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/gali';
import {
  KOPAKA_NUVA_KIT_2001_ATTACHMENTS,
  KOPAKA_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/kopaka';
import {
  LEWA_NUVA_KIT_2001_ATTACHMENTS,
  LEWA_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/lewa';
import {
  ONUA_NUVA_KIT_2001_ATTACHMENTS,
  ONUA_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/onua';
import {
  POHATU_NUVA_KIT_2001_ATTACHMENTS,
  POHATU_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/pohatu';
import {
  TAHU_NUVA_KIT_2001_ATTACHMENTS,
  TAHU_NUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/tahu';
import {
  TAKANUVA_KIT_2001_ATTACHMENTS,
  TAKANUVA_KIT_2003_ATTACHMENTS,
} from '../attachments/Toa Nuva/takanuva';
import {
  METRU_KIT_2004_ATTACHMENTS,
  METRU_KIT_2004_DISK_LAUNCHER_ATTACHMENTS,
} from '../attachments/metru';
import { KIT_2001_NODES, type Kit2001NodeName } from './kit2001Nodes';
import { KIT_2003_NODES, type Kit2003NodeName } from './kit2003Nodes';
import { KIT_2004_NODES, type Kit2004NodeName } from './kit2004Nodes';

/** Kit nodes registered but intentionally not referenced by any attachment map yet. */
export const KIT_2001_NODE_EXEMPT: readonly Kit2001NodeName[] = [];

/** Kit nodes registered but intentionally not referenced by any attachment map yet. */
export const KIT_2003_NODE_EXEMPT: readonly Kit2003NodeName[] = [];

/** Kit nodes registered but intentionally not referenced by any attachment map yet. */
export const KIT_2004_NODE_EXEMPT: readonly Kit2004NodeName[] = [];

function collectUsedNodes(maps: Record<string, KitSocketAttachment<string>>[]): Set<string> {
  const used = new Set<string>();
  for (const map of maps) {
    for (const row of Object.values(map)) {
      used.add(row.kitNodeName);
    }
  }
  return used;
}

/** Counts how many sockets clone each kit node across the given attachment maps. */
export function countKitNodeReferences(
  maps: readonly Record<string, KitSocketAttachment<string>>[]
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const map of maps) {
    for (const row of Object.values(map)) {
      const name = row.kitNodeName;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return counts;
}

export type KitNodeUsageEntry = {
  /** Registry constant key when known (e.g. `Socket` for `KIT_2001_NODES.Socket`). */
  constantKey: string | null;
  count: number;
  glbName: string;
};

function invertRegistry(registry: Record<string, string>): Map<string, string> {
  const byGlbName = new Map<string, string>();
  for (const [key, glbName] of Object.entries(registry)) {
    byGlbName.set(glbName, key);
  }
  return byGlbName;
}

export function rankKitNodeUsage(
  counts: Map<string, number>,
  registry: Record<string, string>
): KitNodeUsageEntry[] {
  const keysByGlbName = invertRegistry(registry);
  return [...counts.entries()]
    .map(([glbName, count]) => ({
      constantKey: keysByGlbName.get(glbName) ?? null,
      count,
      glbName,
    }))
    .sort((a, b) => b.count - a.count || a.glbName.localeCompare(b.glbName));
}

export function getKit2001NodeUsageRanking(): KitNodeUsageEntry[] {
  return rankKitNodeUsage(countKitNodeReferences(KIT_2001_ATTACHMENT_MAPS), KIT_2001_NODES);
}

export function getKit2003NodeUsageRanking(): KitNodeUsageEntry[] {
  return rankKitNodeUsage(countKitNodeReferences(KIT_2003_ATTACHMENT_MAPS), KIT_2003_NODES);
}

export function getTotalKit2001SocketReferences(): number {
  return [...countKitNodeReferences(KIT_2001_ATTACHMENT_MAPS).values()].reduce(
    (sum, count) => sum + count,
    0
  );
}

export function getTotalKit2003SocketReferences(): number {
  return [...countKitNodeReferences(KIT_2003_ATTACHMENT_MAPS).values()].reduce(
    (sum, count) => sum + count,
    0
  );
}

export const KIT_2001_ATTACHMENT_MAPS = [
  BOHROK_KIT_2001_ATTACHMENTS,
  DIMINISHED_KIT_2001_ATTACHMENTS,
  REBUILT_KIT_2001_ATTACHMENTS,
  GALI_MATA_KIT_2001_ATTACHMENTS,
  KOPAKA_MATA_KIT_2001_ATTACHMENTS,
  LEWA_MATA_KIT_2001_ATTACHMENTS,
  ONUA_MATA_KIT_2001_ATTACHMENTS,
  POHATU_MATA_KIT_2001_ATTACHMENTS,
  TAHU_MATA_KIT_2001_ATTACHMENTS,
  GALI_NUVA_KIT_2001_ATTACHMENTS,
  KOPAKA_NUVA_KIT_2001_ATTACHMENTS,
  LEWA_NUVA_KIT_2001_ATTACHMENTS,
  ONUA_NUVA_KIT_2001_ATTACHMENTS,
  POHATU_NUVA_KIT_2001_ATTACHMENTS,
  TAHU_NUVA_KIT_2001_ATTACHMENTS,
  TAKANUVA_KIT_2001_ATTACHMENTS,
  LHIKAN_KIT_2001_ATTACHMENTS,
] as const;

export const KIT_2003_ATTACHMENT_MAPS = [
  BOHROK_KIT_2003_ATTACHMENTS,
  BOHROK_FACEPLATE_KIT_2003_ATTACHMENTS,
  REBUILT_KIT_2003_ATTACHMENTS,
  GALI_NUVA_KIT_2003_ATTACHMENTS,
  KOPAKA_NUVA_KIT_2003_ATTACHMENTS,
  LEWA_NUVA_KIT_2003_ATTACHMENTS,
  ONUA_NUVA_KIT_2003_ATTACHMENTS,
  POHATU_NUVA_KIT_2003_ATTACHMENTS,
  TAHU_NUVA_KIT_2003_ATTACHMENTS,
  TAKANUVA_KIT_2003_ATTACHMENTS,
  LHIKAN_KIT_2003_ATTACHMENTS,
] as const;

export const KIT_2004_ATTACHMENT_MAPS = [
  LHIKAN_KIT_2004_ATTACHMENTS,
  METRU_KIT_2004_ATTACHMENTS,
  METRU_KIT_2004_DISK_LAUNCHER_ATTACHMENTS,
] as const;

export function getUsedKit2001NodeNames(): Set<Kit2001NodeName> {
  return collectUsedNodes([...KIT_2001_ATTACHMENT_MAPS]) as Set<Kit2001NodeName>;
}

export function getUsedKit2003NodeNames(): Set<Kit2003NodeName> {
  return collectUsedNodes([...KIT_2003_ATTACHMENT_MAPS]) as Set<Kit2003NodeName>;
}

export function getUnusedKit2001NodeNames(): Kit2001NodeName[] {
  const used = getUsedKit2001NodeNames();
  const exempt = new Set<string>(KIT_2001_NODE_EXEMPT);
  return Object.values(KIT_2001_NODES).filter((name) => !used.has(name) && !exempt.has(name));
}

export function getUnusedKit2003NodeNames(): Kit2003NodeName[] {
  const used = getUsedKit2003NodeNames();
  const exempt = new Set<string>(KIT_2003_NODE_EXEMPT);
  return Object.values(KIT_2003_NODES).filter((name) => !used.has(name) && !exempt.has(name));
}

export function getUsedKit2004NodeNames(): Set<Kit2004NodeName> {
  return collectUsedNodes([...KIT_2004_ATTACHMENT_MAPS]) as Set<Kit2004NodeName>;
}

export function getUnusedKit2004NodeNames(): Kit2004NodeName[] {
  const used = getUsedKit2004NodeNames();
  const exempt = new Set<string>(KIT_2004_NODE_EXEMPT);
  return Object.values(KIT_2004_NODES).filter((name) => !used.has(name) && !exempt.has(name));
}
