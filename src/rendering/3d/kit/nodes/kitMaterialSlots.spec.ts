import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  KIT_2001_ATTACHMENT_MAPS,
  KIT_2003_ATTACHMENT_MAPS,
  KIT_2004_ATTACHMENT_MAPS,
} from './collectKitNodeUsage';
import { buildKitMaterialSlotRegistry, parseKitNodeRegistry } from './extractKitMaterialSlots';
import { KIT_2001_MATERIAL_SLOTS } from './kit2001MaterialSlots';
import { KIT_2001_NODES } from './kit2001Nodes';
import { KIT_2003_MATERIAL_SLOTS } from './kit2003MaterialSlots';
import { KIT_2003_NODES } from './kit2003Nodes';
import { KIT_2004_MATERIAL_SLOTS } from './kit2004MaterialSlots';
import { KIT_2004_NODES } from './kit2004Nodes';
import {
  getUnresolvedKit2001MaterialSlotNodes,
  getUnresolvedKit2003MaterialSlotNodes,
  getUnresolvedKit2004MaterialSlotNodes,
  isKnownKitMaterialSlotName,
  validateAttachmentMaterialSlots,
  type KitMaterialSlotValidationIssue,
} from './kitMaterialSlots';
import { extractGlbNodeMaterialSlots } from './readGlbJson';
import { resolveKitGlbNodeName } from './resolveKitGlbNodeName';

const repoRoot = process.cwd();

export function validateAllAttachmentMaterialSlots(): KitMaterialSlotValidationIssue[] {
  return [
    ...KIT_2001_ATTACHMENT_MAPS.flatMap((map) => validateAttachmentMaterialSlots(map, '2001')),
    ...KIT_2003_ATTACHMENT_MAPS.flatMap((map) => validateAttachmentMaterialSlots(map, '2003')),
    ...KIT_2004_ATTACHMENT_MAPS.flatMap((map) => validateAttachmentMaterialSlots(map, '2004')),
  ];
}

describe('kit material slots', () => {
  test('every registered 2001 node resolves to GLB slots or is exempt', () => {
    expect(getUnresolvedKit2001MaterialSlotNodes()).toEqual([]);
  });

  test('every registered 2003 node resolves to GLB slots or is exempt', () => {
    expect(getUnresolvedKit2003MaterialSlotNodes()).toEqual([]);
  });

  test('every registered 2004 node resolves to GLB slots or is exempt', () => {
    expect(getUnresolvedKit2004MaterialSlotNodes()).toEqual([]);
  });

  test('material slot inventories match kit GLBs', () => {
    const kits = [
      [
        KIT_2001_NODES,
        KIT_2001_MATERIAL_SLOTS,
        'src/rendering/3d/kit/nodes/kit2001Nodes.ts',
        'public/kit_2001.glb',
      ],
      [
        KIT_2003_NODES,
        KIT_2003_MATERIAL_SLOTS,
        'src/rendering/3d/kit/nodes/kit2003Nodes.ts',
        'public/kit_2003.glb',
      ],
      [
        KIT_2004_NODES,
        KIT_2004_MATERIAL_SLOTS,
        'src/rendering/3d/kit/nodes/kit2004Nodes.ts',
        'public/kit_2004.glb',
      ],
    ] as const;

    for (const [registryConst, slotsConst, nodesPath, glbPath] of kits) {
      const registry = parseKitNodeRegistry(readFileSync(join(repoRoot, nodesPath), 'utf8'));
      const expected = buildKitMaterialSlotRegistry(registry, join(repoRoot, glbPath));
      for (const key of Object.keys(registryConst)) {
        expect(slotsConst[key as keyof typeof slotsConst]).toEqual(expected[key] ?? []);
      }
    }
  });

  test('attachment materialColors keys use known kit slot names', () => {
    const issues = validateAllAttachmentMaterialSlots().filter(
      (issue) => !isKnownKitMaterialSlotName(issue.slotName)
    );

    expect(issues).toEqual([]);
  });
});

describe('resolveKitGlbNodeName', () => {
  test('maps underscore and spaced node names', () => {
    const glbNodes = new Set(['Bohrok Body', 'Disk Launcher', 'McArm.L']);
    expect(resolveKitGlbNodeName('Bohrok_Body', glbNodes)).toBe('Bohrok Body');
    expect(resolveKitGlbNodeName('Disk_Launcher', glbNodes)).toBe('Disk Launcher');
    expect(resolveKitGlbNodeName('McArmL', glbNodes)).toBe('McArm.L');
  });
});

describe('extractGlbNodeMaterialSlots', () => {
  test('reads bake-prefixed materials from Mata chest', () => {
    const slots = extractGlbNodeMaterialSlots(join(repoRoot, 'public/kit_2001.glb'));
    expect(slots.MataChest).toContain('Main_MataChest_baked');
  });
});
