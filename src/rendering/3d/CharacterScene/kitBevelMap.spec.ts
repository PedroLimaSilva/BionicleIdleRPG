import { Texture } from 'three';
import {
  clearKitBevelMapCache,
  kitBevelMapCandidates,
  loadKitBevelMap,
  loadKitBevelMapsForNodes,
  sanitizeKitBevelNodeName,
} from './kitBevelMap';

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

describe('kitBevelMapCandidates', () => {
  test('maps a kit GLB URL to the leftover kit atlas', () => {
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb')).toEqual([
      '/BionicleIdleRPG/kit_2001_bevel.webp',
      '/BionicleIdleRPG/kit_2001_bevel.png',
    ]);
  });

  test('puts the part file before the leftover kit atlas', () => {
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb', 'MataChest')).toEqual([
      '/BionicleIdleRPG/kit_2001/MataChest_bevel.webp',
      '/BionicleIdleRPG/kit_2001/MataChest_bevel.png',
      '/BionicleIdleRPG/kit_2001_bevel.webp',
      '/BionicleIdleRPG/kit_2001_bevel.png',
    ]);
  });

  test('strips query strings and ignores non-GLB URLs', () => {
    expect(kitBevelMapCandidates('https://example.test/kit_2003.glb?v=2', 'Axle2L')).toEqual([
      'https://example.test/kit_2003/Axle2L_bevel.webp',
      'https://example.test/kit_2003/Axle2L_bevel.png',
      'https://example.test/kit_2003_bevel.webp',
      'https://example.test/kit_2003_bevel.png',
    ]);
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001_bevel.webp')).toEqual([]);
  });

  test('unsafe node names skip the part path and keep the kit atlas', () => {
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb', '../x')).toEqual([
      '/BionicleIdleRPG/kit_2001_bevel.webp',
      '/BionicleIdleRPG/kit_2001_bevel.png',
    ]);
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

  test('returns undefined when no sidecar exists', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    await expect(loadKitBevelMap('/kit_2001.glb')).resolves.toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  test('tries the part file before the leftover kit atlas', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    await expect(loadKitBevelMap('/kit_2001.glb', 'MataChest')).resolves.toBeUndefined();
    expect(globalThis.fetch).toHaveBeenCalledTimes(4);
    expect(globalThis.fetch).toHaveBeenNthCalledWith(1, '/kit_2001/MataChest_bevel.webp');
    expect(globalThis.fetch).toHaveBeenNthCalledWith(2, '/kit_2001/MataChest_bevel.png');
    expect(globalThis.fetch).toHaveBeenNthCalledWith(3, '/kit_2001_bevel.webp');
    expect(globalThis.fetch).toHaveBeenNthCalledWith(4, '/kit_2001_bevel.png');
  });

  test('reuses the in-flight promise for the same kit URL', () => {
    globalThis.fetch = jest.fn().mockReturnValue(new Promise(() => undefined));
    const first = loadKitBevelMap('/kit_2004.glb');
    const second = loadKitBevelMap('/kit_2004.glb?cache=1');
    expect(second).toBe(first);
  });

  test('reuses the in-flight promise for the same part', () => {
    globalThis.fetch = jest.fn().mockReturnValue(new Promise(() => undefined));
    const first = loadKitBevelMap('/kit_2001.glb', 'MataChest');
    const second = loadKitBevelMap('/kit_2001.glb?v=2', 'MataChest');
    expect(second).toBe(first);
  });

  test('shares one leftover atlas fetch across parts that miss their own file', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    await Promise.all([
      loadKitBevelMap('/kit_2001.glb', 'Axle2L'),
      loadKitBevelMap('/kit_2001.glb', 'Axle3L'),
    ]);
    const urls = (globalThis.fetch as jest.Mock).mock.calls.map((call) => call[0] as string);
    expect(urls.filter((url) => url.includes('Axle2L')).length).toBe(2);
    expect(urls.filter((url) => url.includes('Axle3L')).length).toBe(2);
    expect(urls.filter((url) => url === '/kit_2001_bevel.webp').length).toBe(1);
    expect(urls.filter((url) => url === '/kit_2001_bevel.png').length).toBe(1);
  });

  test('is a no-op without fetch (unit tests)', async () => {
    // @ts-expect-error simulate non-browser
    delete globalThis.fetch;
    await expect(loadKitBevelMap('/kit_2001.glb')).resolves.toBeUndefined();
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

  test('dedupes node names and returns a map keyed by kitNodeName', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({ blob: async () => new Blob(), ok: false });
    const maps = await loadKitBevelMapsForNodes('/kit_2001.glb', [
      'MataChest',
      'Axle2L',
      'MataChest',
    ]);
    expect([...maps.keys()].sort()).toEqual(['Axle2L', 'MataChest']);
    expect(maps.get('MataChest')).toBeUndefined();
    expect(maps.get('Axle2L')).toBeUndefined();
  });
});
