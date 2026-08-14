import type { KitNodeUsageEntry } from './collectKitNodeUsage';
import {
  getKit2001NodeUsageRanking,
  getKit2003NodeUsageRanking,
  getTotalKit2001SocketReferences,
  getTotalKit2003SocketReferences,
  rankKitNodeUsage,
} from './collectKitNodeUsage';
import { KIT_2001_NODES } from './kit2001Nodes';
import { KIT_2003_NODES } from './kit2003Nodes';

export type KitUsageSnapshot = {
  kit2001: {
    ranking: KitNodeUsageEntry[];
    registered: string[];
    totalSocketReferences: number;
    uniqueNodesUsed: number;
  };
  kit2003: {
    ranking: KitNodeUsageEntry[];
    registered: string[];
    totalSocketReferences: number;
    uniqueNodesUsed: number;
  };
};

const KIT_NODE_REF_RE = /kitNodeName:\s*(?:KIT_2001_NODES\.(\w+)|KIT_2003_NODES\.(\w+)|'([^']+)')/g;
const EXPORT_ATTACHMENT_MAP_RE = /export const \w*ATTACHMENTS\w*(?:\s*:[^=]*)?\s*=\s*\{/g;

/** Attachment maps not yet wired into `KIT_*_ATTACHMENT_MAPS` usage ranking. */
export const KIT_ATTACHMENT_SCAN_EXCLUDED_FILES = ['src/game/kit/attachments/metru.ts'] as const;

function findMatchingBrace(source: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < source.length; i++) {
    const char = source[i];
    if (char === '{') depth++;
    else if (char === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Keeps only exported `*ATTACHMENTS*` object literals (skips helper functions). */
export function extractAttachmentMapSources(source: string): string {
  const parts: string[] = [];
  EXPORT_ATTACHMENT_MAP_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = EXPORT_ATTACHMENT_MAP_RE.exec(source))) {
    const openBrace = match.index + match[0].length - 1;
    const closeBrace = findMatchingBrace(source, openBrace);
    if (closeBrace !== -1) {
      parts.push(source.slice(openBrace, closeBrace + 1));
    }
  }
  return parts.join('\n');
}

function stripLineComments(source: string): string {
  return source
    .split('\n')
    .map((line) => {
      const commentStart = line.indexOf('//');
      return commentStart === -1 ? line : line.slice(0, commentStart);
    })
    .join('\n');
}

export function parseKitNodeRegistry(source: string): Record<string, string> {
  const registry: Record<string, string> = {};
  const entryRe = /^\s*(\w+):\s*'((?:\\'|[^'])*)',?\s*$/gm;
  let match: RegExpExecArray | null;
  while ((match = entryRe.exec(source))) {
    registry[match[1]] = match[2].replace(/\\'/g, "'");
  }
  return registry;
}

function resolveGlbName(
  kit2001Key: string | undefined,
  kit2003Key: string | undefined,
  literal: string | undefined,
  registry2001: Record<string, string>,
  registry2003: Record<string, string>
): string | null {
  if (kit2001Key) return registry2001[kit2001Key] ?? null;
  if (kit2003Key) return registry2003[kit2003Key] ?? null;
  if (literal) return literal;
  return null;
}

export function parseAttachmentKitNodeCounts(
  source: string,
  registry2001: Record<string, string>,
  registry2003: Record<string, string>
): Map<string, number> {
  const scopedSource = stripLineComments(extractAttachmentMapSources(source));
  const counts = new Map<string, number>();
  let match: RegExpExecArray | null;
  KIT_NODE_REF_RE.lastIndex = 0;
  while ((match = KIT_NODE_REF_RE.exec(scopedSource))) {
    const glbName = resolveGlbName(match[1], match[2], match[3], registry2001, registry2003);
    if (!glbName) continue;
    counts.set(glbName, (counts.get(glbName) ?? 0) + 1);
  }
  return counts;
}

export function buildKitUsageSnapshot(
  counts2001: Map<string, number>,
  counts2003: Map<string, number>,
  registry2001: Record<string, string>,
  registry2003: Record<string, string>
): KitUsageSnapshot {
  const ranking2001 = rankKitNodeUsage(counts2001, registry2001);
  const ranking2003 = rankKitNodeUsage(counts2003, registry2003);
  return {
    kit2001: {
      ranking: ranking2001,
      registered: Object.values(registry2001).sort(),
      totalSocketReferences: [...counts2001.values()].reduce((sum, n) => sum + n, 0),
      uniqueNodesUsed: counts2001.size,
    },
    kit2003: {
      ranking: ranking2003,
      registered: Object.values(registry2003).sort(),
      totalSocketReferences: [...counts2003.values()].reduce((sum, n) => sum + n, 0),
      uniqueNodesUsed: counts2003.size,
    },
  };
}

export function usageSnapshotFromWorkspace(): KitUsageSnapshot {
  const ranking2001 = getKit2001NodeUsageRanking();
  const ranking2003 = getKit2003NodeUsageRanking();
  return {
    kit2001: {
      ranking: ranking2001,
      registered: Object.values(KIT_2001_NODES).sort(),
      totalSocketReferences: getTotalKit2001SocketReferences(),
      uniqueNodesUsed: ranking2001.length,
    },
    kit2003: {
      ranking: ranking2003,
      registered: Object.values(KIT_2003_NODES).sort(),
      totalSocketReferences: getTotalKit2003SocketReferences(),
      uniqueNodesUsed: ranking2003.length,
    },
  };
}

export type KitNodeUsageDelta = {
  after: number;
  before: number;
  constantKey: string | null;
  delta: number;
  glbName: string;
};

export function diffKitNodeUsage(
  before: KitNodeUsageEntry[],
  after: KitNodeUsageEntry[]
): KitNodeUsageDelta[] {
  const beforeByName = new Map(before.map((row) => [row.glbName, row]));
  const afterByName = new Map(after.map((row) => [row.glbName, row]));
  const names = new Set([...beforeByName.keys(), ...afterByName.keys()]);
  const deltas: KitNodeUsageDelta[] = [];

  for (const glbName of names) {
    const beforeCount = beforeByName.get(glbName)?.count ?? 0;
    const afterCount = afterByName.get(glbName)?.count ?? 0;
    if (beforeCount === afterCount) continue;
    deltas.push({
      after: afterCount,
      before: beforeCount,
      constantKey:
        afterByName.get(glbName)?.constantKey ?? beforeByName.get(glbName)?.constantKey ?? null,
      delta: afterCount - beforeCount,
      glbName,
    });
  }

  return deltas.sort(
    (a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.glbName.localeCompare(b.glbName)
  );
}

function formatNodeLabel(entry: Pick<KitNodeUsageEntry, 'constantKey' | 'glbName'>): string {
  if (entry.constantKey) return `\`${entry.constantKey}\` (\`${entry.glbName}\`)`;
  return `\`${entry.glbName}\``;
}

function formatSignedCount(delta: number): string {
  if (delta === 0) return '0';
  return delta > 0 ? `+${delta}` : `${delta}`;
}

function formatUsageTable(
  title: string,
  ranking: KitNodeUsageEntry[],
  beforeRanking: KitNodeUsageEntry[] | undefined,
  rows: KitNodeUsageEntry[],
  rankOffset: number
): string[] {
  const beforeByName = new Map((beforeRanking ?? []).map((row) => [row.glbName, row.count]));
  const lines = [
    `### ${title}`,
    '',
    `| Rank | Node | Socket uses | Δ |`,
    `| ---: | --- | ---: | ---: |`,
  ];

  rows.forEach((row, index) => {
    const beforeCount = beforeByName.get(row.glbName);
    const delta =
      beforeCount === undefined
        ? beforeRanking
          ? `+${row.count}`
          : '—'
        : formatSignedCount(row.count - beforeCount);
    lines.push(`| ${rankOffset + index + 1} | ${formatNodeLabel(row)} | ${row.count} | ${delta} |`);
  });

  if (ranking.length === 0) {
    lines.push('| — | _none_ | 0 | — |');
  }

  return lines;
}

function formatMostUsedTable(
  ranking: KitNodeUsageEntry[],
  beforeRanking: KitNodeUsageEntry[] | undefined,
  topN: number
): string[] {
  return formatUsageTable('Most used nodes', ranking, beforeRanking, ranking.slice(0, topN), 0);
}

function formatLeastUsedTable(
  ranking: KitNodeUsageEntry[],
  beforeRanking: KitNodeUsageEntry[] | undefined,
  bottomN: number
): string[] {
  const rows = ranking.slice(-bottomN);
  return formatUsageTable(
    'Least used nodes',
    ranking,
    beforeRanking,
    rows,
    Math.max(0, ranking.length - rows.length)
  );
}

function formatUsageDeltaTable(deltas: KitNodeUsageDelta[]): string[] {
  if (deltas.length === 0) return ['_No socket usage count changes._'];
  const lines = ['| Node | Before | After | Δ |', '| --- | ---: | ---: | ---: |'];
  for (const row of deltas) {
    lines.push(
      `| ${formatNodeLabel(row)} | ${row.before} | ${row.after} | ${formatSignedCount(row.delta)} |`
    );
  }
  return lines;
}

function formatRegistryDelta(before: string[], after: string[]): string[] {
  const beforeSet = new Set(before);
  const afterSet = new Set(after);
  const added = after.filter((name) => !beforeSet.has(name));
  const removed = before.filter((name) => !afterSet.has(name));
  const lines: string[] = [];

  if (added.length > 0) {
    lines.push('**Newly registered:** ' + added.map((name) => `\`${name}\``).join(', '));
  }
  if (removed.length > 0) {
    lines.push('**Removed from registry:** ' + removed.map((name) => `\`${name}\``).join(', '));
  }
  if (added.length === 0 && removed.length === 0) {
    lines.push('_No registry changes._');
  }
  return lines;
}

export function buildMarkdownReport(
  after: KitUsageSnapshot,
  before: KitUsageSnapshot | null,
  options: { bottomN?: number; topN?: number } = {}
): string {
  const topN = options.topN ?? 15;
  const bottomN = options.bottomN ?? topN;
  const lines: string[] = ['## Kit node usage report', ''];

  lines.push(
    'Socket usage counts how many character rig sockets clone each kit node across all attachment maps.',
    ''
  );

  if (!before) {
    lines.push('_No merge-base snapshot available for comparison._', '');
  }

  for (const section of [
    { kitKey: 'kit2001' as const, label: 'kit_2001.glb' },
    { kitKey: 'kit2003' as const, label: 'kit_2003.glb' },
  ]) {
    const current = after[section.kitKey];
    const previous = before?.[section.kitKey];
    lines.push(`## ${section.label}`);
    lines.push('');
    lines.push(
      `**Registered nodes:** ${previous ? `${previous.registered.length} → ` : ''}\`${current.registered.length}\``,
      `**Distinct nodes used:** ${previous ? `${previous.uniqueNodesUsed} → ` : ''}\`${current.uniqueNodesUsed}\``,
      `**Total socket references:** ${previous ? `${previous.totalSocketReferences} → ` : ''}\`${current.totalSocketReferences}\``,
      ''
    );

    if (before) {
      lines.push('#### Registry');
      lines.push('');
      lines.push(...formatRegistryDelta(previous!.registered, current.registered));
      lines.push('');
    }

    lines.push(...formatMostUsedTable(current.ranking, previous?.ranking, topN));
    lines.push('');
    lines.push(...formatLeastUsedTable(current.ranking, previous?.ranking, bottomN));
    lines.push('');

    if (before) {
      const deltas = diffKitNodeUsage(previous!.ranking, current.ranking);
      lines.push('#### Usage changes');
      lines.push('');
      lines.push(...formatUsageDeltaTable(deltas));
      lines.push('');
    }
  }

  return lines.join('\n').trimEnd();
}
