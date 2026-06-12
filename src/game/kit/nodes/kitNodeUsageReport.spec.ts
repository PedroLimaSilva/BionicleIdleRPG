import {
  buildMarkdownReport,
  diffKitNodeUsage,
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
      FootL: { kitNodeName: KIT_2001_NODES.Socket },
      Legacy: { kitNodeName: 'Axle3L' },
      Arm: { kitNodeName: KIT_2003_NODES.BohrokArm },
    `;
    const counts = parseAttachmentKitNodeCounts(source, registry2001, registry2003);
    expect(counts.get('Socket')).toBe(1);
    expect(counts.get('Axle3L')).toBe(1);
    expect(counts.get('BohrokArm')).toBe(1);
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

  test('buildMarkdownReport includes top usage table', () => {
    const snapshot = usageSnapshotFromWorkspace();
    const report = buildMarkdownReport(snapshot, null, { topN: 5 });
    expect(report).toContain('## Kit node usage report');
    expect(report).toContain('### Most used nodes');
    expect(report).toContain('kit_2001.glb');
    expect(report).toContain('kit_2003.glb');
    expect(snapshot.kit2001.ranking.length).toBeGreaterThan(0);
  });
});
