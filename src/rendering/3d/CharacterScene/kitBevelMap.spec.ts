import { Texture } from 'three';
import { KIT_2001_NODES } from '../kit/nodes/kit2001Nodes';
import {
  clearKitBevelMapCache,
  kitBevelMapCandidates,
  kitGlbStem,
  loadKitBevelMap,
  loadKitBevelMapsForNodes,
  sanitizeKitBevelNodeName,
} from './kitBevelMap';
import { KIT_2001_BEVEL_NODES } from '../kit/kitBevelNodes';

describe('sanitizeKitBevelNodeName', () => {
  test('keeps catalog node names', () => {
    expect(sanitizeKitBevelNodeName('MataChest')).toBe('MataChest');
    expect(sanitizeKitBevelNodeName('Axle2L')).toBe('Axle2L');
  });

  test('rejects path separators and traversal', () => {
    expect(sanitizeKitBevelNodeName('../MataChest')).toBeUndefined();
    expect(sanitizeKitBevelNodeName('kit/MataChest')).toBeUndefined();
    expect(sanitizeKitBevelNodeName('MataChest\\x')).toBeUndefined();
    expect(sanitizeKitBevelNodeName('')).toBeUndefined();
  });
});

describe('kitGlbStem', () => {
  test('strips the path down to the kit filename stem', () => {
    expect(kitGlbStem('/BionicleIdleRPG/kit_2001.glb')).toBe('kit_2001');
    expect(kitGlbStem('https://example.test/kit_2003.glb?v=2')).toBe('kit_2003');
    expect(kitGlbStem('/BionicleIdleRPG/kit_2001_bevel.webp')).toBeUndefined();
  });
});

describe('kitBevelMapCandidates', () => {
  test('undeclared parts (including axles) have no candidate URLs', () => {
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb', KIT_2001_NODES.Axle2L)).toEqual(
      []
    );
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb', '../x')).toEqual([]);
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001_bevel.webp', 'MataChest')).toEqual([]);
  });

  test('allowlisted nodes resolve to part sidecar URLs', () => {
    const nodes = Object.keys(KIT_2001_BEVEL_NODES);
    expect(
      nodes.map((node) => kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb', node))
    ).toEqual(
      nodes.map((node) => [
        `/BionicleIdleRPG/kit_2001/${node}_bevel.webp`,
        `/BionicleIdleRPG/kit_2001/${node}_bevel.png`,
      ])
    );
  });
});

describe('loadKitBevelMap', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    clearKitBevelMapCache();
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      // @ts-expect-error restore missing fetch in node
      delete globalThis.fetch;
    }
  });

  test('does not fetch undeclared parts', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    await expect(loadKitBevelMap('/kit_2001.glb', KIT_2001_NODES.Axle2L)).resolves.toBeUndefined();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  test('reuses the in-flight promise for the same declared part', () => {
    const node = Object.keys(KIT_2001_BEVEL_NODES)[0];
    if (!node) return;
    globalThis.fetch = jest.fn().mockReturnValue(new Promise(() => undefined));
    const first = loadKitBevelMap('/kit_2001.glb', node);
    const second = loadKitBevelMap('/kit_2001.glb?v=2', node);
    expect(second).toBe(first);
  });

  test('is a no-op without fetch (unit tests)', async () => {
    // @ts-expect-error simulate non-browser
    delete globalThis.fetch;
    await expect(
      loadKitBevelMap('/kit_2001.glb', KIT_2001_NODES.MataChest)
    ).resolves.toBeUndefined();
    expect(Texture).toBeDefined();
  });
});

describe('loadKitBevelMapsForNodes', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    clearKitBevelMapCache();
    if (originalFetch) {
      globalThis.fetch = originalFetch;
    } else {
      // @ts-expect-error restore missing fetch in node
      delete globalThis.fetch;
    }
  });

  test('does not fetch attached parts that are off the allowlist', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    const maps = await loadKitBevelMapsForNodes('/kit_2001.glb', [
      KIT_2001_NODES.MataChest,
      KIT_2001_NODES.Axle2L,
      KIT_2001_NODES.MataChest,
    ]);
    expect(maps.has(KIT_2001_NODES.Axle2L)).toBe(false);
    for (const name of maps.keys()) {
      expect(KIT_2001_BEVEL_NODES[name as keyof typeof KIT_2001_BEVEL_NODES]).toBe(true);
    }
    if (Object.keys(KIT_2001_BEVEL_NODES).length === 0) {
      expect(maps.size).toBe(0);
      expect(globalThis.fetch).not.toHaveBeenCalled();
    }
  });

  test('preload with no name list only loads the allowlist', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    const maps = await loadKitBevelMapsForNodes('/kit_2001.glb');
    expect([...maps.keys()].sort()).toEqual(Object.keys(KIT_2001_BEVEL_NODES).sort());
    if (Object.keys(KIT_2001_BEVEL_NODES).length === 0) {
      expect(globalThis.fetch).not.toHaveBeenCalled();
    }
  });
});
