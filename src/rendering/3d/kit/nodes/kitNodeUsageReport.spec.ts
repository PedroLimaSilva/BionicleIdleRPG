import {
  buildMarkdownReport,
  diffKitNodeUsage,
  extractAttachmentMapSources,
  parseAttachmentKitNodeCounts,
  parseKitNodeRegistry,
  usageSnapshotFromWorkspace,
} from './kitNodeUsageReport';

describe('kit-node-usage report', () => {
  test('parseKitNodeRegistry reads GLB names from registry source', () => {
    const registry = parseKitNodeRegistry(`
      export const KIT_2001_NODES = {
        McArmL: 'McArm.L',
        Socket: 'Socket',
      } as const;
    `);
    expect(registry).toEqual({ McArmL: 'McArm.L', Socket: 'Socket' });
  });

  test('parseAttachmentKitNodeCounts supports constants and legacy string literals', () => {
    const registry2001 = { Axle3L: 'Axle3L', Socket: 'Socket' };
    const registry2003 = { BohrokArm: 'BohrokArm' };
    const source = `
      export const EXAMPLE_KIT_2001_ATTACHMENTS = {
        FootL: { kitNodeName: KIT_2001_NODES.Socket },
        Legacy: { kitNodeName: 'Axle3L' },
        Arm: { kitNodeName: KIT_2003_NODES.BohrokArm },
      };
    `;
    const counts = parseAttachmentKitNodeCounts(source, registry2001, registry2003);
    expect(counts.get('Socket')).toBe(1);
    expect(counts.get('Axle3L')).toBe(1);
    expect(counts.get('BohrokArm')).toBe(1);
  });

  test('parseAttachmentKitNodeCounts ignores comments and helper functions', () => {
    const registry2001 = { Axle3L: 'Axle3L', Socket: 'Socket' };
    const registry2003 = { FacePlate: 'Face_Plate' };
    const source = `
      export const EXAMPLE_KIT_2001_ATTACHMENTS = {
        FootL: { kitNodeName: KIT_2001_NODES.Socket },
        // Axle3LN: { kitNodeName: KIT_2001_NODES.Axle3L },
      };
      export function buildExampleKit2003Attachments() {
        return {
          Face_Plate_1: { kitNodeName: KIT_2003_NODES.FacePlate },
        };
      }
      export const EXAMPLE_KIT_2003_ATTACHMENTS = {
        Face_Plate_1: { kitNodeName: KIT_2003_NODES.FacePlate },
      };
    `;
    const counts = parseAttachmentKitNodeCounts(source, registry2001, registry2003);
    expect(counts.get('Socket')).toBe(1);
    expect(counts.get('Axle3L')).toBeUndefined();
    expect(counts.get('Face_Plate')).toBe(1);
  });

  test('extractAttachmentMapSources keeps exported attachment maps only', () => {
    const extracted = extractAttachmentMapSources(`
      export const BOHROK_KIT_2003_ATTACHMENTS = {
        Arm: { kitNodeName: KIT_2003_NODES.BohrokArm },
      };
      export function buildBohrokKit2003Attachments() {
        return { Face_Plate_1: { kitNodeName: KIT_2003_NODES.FacePlate } };
      }
    `);
    expect(extracted).toContain('BohrokArm');
    expect(extracted).not.toContain('Face_Plate');
  });

  test('diffKitNodeUsage surfaces count changes sorted by magnitude', () => {
    const deltas = diffKitNodeUsage(
      [{ constantKey: 'Socket', count: 10, glbName: 'Socket' }],
      [
        { constantKey: 'Socket', count: 12, glbName: 'Socket' },
        { constantKey: 'GearM', count: 3, glbName: 'GearM' },
      ]
    );
    expect(deltas).toEqual([
      expect.objectContaining({ delta: 3, glbName: 'GearM' }),
      expect.objectContaining({ delta: 2, glbName: 'Socket' }),
    ]);
  });

  test('buildMarkdownReport includes most and least used tables', () => {
    const snapshot = usageSnapshotFromWorkspace();
    const report = buildMarkdownReport(snapshot, null, { topN: 5 });
    expect(report).toContain('## Kit node usage report');
    expect(report).toContain('### Most used nodes');
    expect(report).toContain('### Least used nodes');
    expect(report).toContain('kit_2001.glb');
    expect(report).toContain('kit_2003.glb');
    expect(snapshot.kit2001.ranking.length).toBeGreaterThan(0);

    const leastUsedRow = snapshot.kit2001.ranking.at(-1);
    if (leastUsedRow) {
      expect(report).toContain(formatNodeLabelForTest(leastUsedRow));
    }
  });
});

function formatNodeLabelForTest(entry: { constantKey: string | null; glbName: string }): string {
  if (entry.constantKey) return `\`${entry.constantKey}\` (\`${entry.glbName}\`)`;
  return `\`${entry.glbName}\``;
}
