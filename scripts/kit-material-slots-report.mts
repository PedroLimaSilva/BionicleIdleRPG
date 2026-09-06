/**
 * Extract kit material slot inventories from GLB files and optionally rewrite registry TS.
 * Usage: yarn kit-material-slots-report [--write] [--markdown]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildKitMaterialSlotRegistry,
  formatMaterialSlotRegistryTs,
  parseKitNodeRegistry,
} from '../src/rendering/3d/kit/nodes/extractKitMaterialSlots';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const KITS = [
  {
    constName: 'KIT_2001_MATERIAL_SLOTS',
    glbPath: 'public/kit_2001.glb',
    nodesConst: 'KIT_2001_NODES',
    nodesPath: 'src/rendering/3d/kit/nodes/kit2001Nodes.ts',
    outPath: 'src/rendering/3d/kit/nodes/kit2001MaterialSlots.ts',
    typeName: 'Kit2001MaterialSlotMap',
  },
  {
    constName: 'KIT_2003_MATERIAL_SLOTS',
    glbPath: 'public/kit_2003.glb',
    nodesConst: 'KIT_2003_NODES',
    nodesPath: 'src/rendering/3d/kit/nodes/kit2003Nodes.ts',
    outPath: 'src/rendering/3d/kit/nodes/kit2003MaterialSlots.ts',
    typeName: 'Kit2003MaterialSlotMap',
  },
  {
    constName: 'KIT_2004_MATERIAL_SLOTS',
    glbPath: 'public/kit_2004.glb',
    nodesConst: 'KIT_2004_NODES',
    nodesPath: 'src/rendering/3d/kit/nodes/kit2004Nodes.ts',
    outPath: 'src/rendering/3d/kit/nodes/kit2004MaterialSlots.ts',
    typeName: 'Kit2004MaterialSlotMap',
  },
] as const;

export function buildKitMaterialSlotReports(repoRootPath = repoRoot) {
  return KITS.map((kit) => {
    const registry = parseKitNodeRegistry(readFileSync(join(repoRootPath, kit.nodesPath), 'utf8'));
    const slots = buildKitMaterialSlotRegistry(registry, join(repoRootPath, kit.glbPath));
    const unresolved = Object.entries(slots)
      .filter(([, values]) => values.length === 0)
      .map(([key]) => key);
    return { ...kit, registry, slots, unresolved };
  });
}

function buildMarkdown(reports: ReturnType<typeof buildKitMaterialSlotReports>): string {
  const lines = ['## Kit material slot inventory', ''];
  for (const report of reports) {
    lines.push(`### ${report.constName}`);
    lines.push('');
    lines.push(`- Registered nodes: ${Object.keys(report.registry).length}`);
    lines.push(`- Unresolved (no GLB mesh): ${report.unresolved.length}`);
    if (report.unresolved.length > 0) {
      lines.push(`- Missing: ${report.unresolved.join(', ')}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}

const write = process.argv.includes('--write');
const markdown = process.argv.includes('--markdown');
const reports = buildKitMaterialSlotReports();

if (write) {
  for (const report of reports) {
    writeFileSync(
      join(repoRoot, report.outPath),
      `${formatMaterialSlotRegistryTs(report.constName, report.nodesConst, report.typeName, report.slots)}\n`
    );
  }
}

const output = markdown ? buildMarkdown(reports) : buildMarkdown(reports);
console.log(output);

if (reports.some((report) => report.unresolved.length > 0)) {
  process.exit(write ? 0 : 1);
}
