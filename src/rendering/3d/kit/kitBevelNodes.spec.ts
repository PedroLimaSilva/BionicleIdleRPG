import {
  declaredKitBevelNodeNames,
  filterDeclaredKitBevelNodes,
  KIT_2001_BEVEL_NODES,
  KIT_2001_BEVEL_SKIP_CONNECTORS,
  KIT_2003_BEVEL_NODES,
  KIT_2004_BEVEL_NODES,
  kitNodeHasDeclaredBevelMap,
} from './kitBevelNodes';
import { KIT_2001_NODES, type Kit2001NodeName } from './nodes/kit2001Nodes';
import { KIT_2003_NODES } from './nodes/kit2003Nodes';
import { KIT_2004_NODES } from './nodes/kit2004Nodes';

describe('kit bevel allowlists', () => {
  test('every listed 2001 node is a registered kit constant', () => {
    const registered = new Set<string>(Object.values(KIT_2001_NODES));
    for (const name of Object.keys(KIT_2001_BEVEL_NODES)) {
      expect(registered.has(name)).toBe(true);
      expect(KIT_2001_BEVEL_NODES[name as keyof typeof KIT_2001_BEVEL_NODES]).toBe(true);
    }
  });

  test('every listed 2003 node is a registered kit constant', () => {
    const registered = new Set<string>(Object.values(KIT_2003_NODES));
    for (const name of Object.keys(KIT_2003_BEVEL_NODES)) {
      expect(registered.has(name)).toBe(true);
    }
  });

  test('every listed 2004 node is a registered kit constant', () => {
    const registered = new Set<string>(Object.values(KIT_2004_NODES));
    for (const name of Object.keys(KIT_2004_BEVEL_NODES)) {
      expect(registered.has(name)).toBe(true);
    }
  });

  test('low-detail 2001 connectors are not on the bevel allowlist', () => {
    for (const name of KIT_2001_BEVEL_SKIP_CONNECTORS) {
      expect(KIT_2001_BEVEL_NODES[name]).toBeUndefined();
    }
  });

  test('membership is a record key lookup', () => {
    expect(KIT_2001_BEVEL_NODES[KIT_2001_NODES.Axle2L]).toBeUndefined();
    expect(kitNodeHasDeclaredBevelMap('kit_2001', KIT_2001_NODES.Axle2L)).toBe(false);
    expect(kitNodeHasDeclaredBevelMap('unknown_kit', 'MataChest')).toBe(false);
  });

  test('filter keeps unique declared names and drops the rest', () => {
    const mixed = [
      KIT_2001_NODES.Axle2L,
      KIT_2001_NODES.MataChest,
      KIT_2001_NODES.MataChest,
      KIT_2001_NODES.MataFoot,
    ];
    const filtered = filterDeclaredKitBevelNodes('kit_2001', mixed);
    expect(filtered.every((name) => KIT_2001_BEVEL_NODES[name as Kit2001NodeName] === true)).toBe(
      true
    );
    expect(filtered).toEqual([...new Set(filtered)]);
    expect(filtered.includes(KIT_2001_NODES.Axle2L)).toBe(false);
  });

  test('declared names match the record keys', () => {
    expect(declaredKitBevelNodeNames('kit_2001').sort()).toEqual(
      Object.keys(KIT_2001_BEVEL_NODES).sort()
    );
  });
});
