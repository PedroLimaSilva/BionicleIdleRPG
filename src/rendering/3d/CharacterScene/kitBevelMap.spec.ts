import { Texture } from 'three';
import { clearKitBevelMapCache, kitBevelMapCandidates, loadKitBevelMap } from './kitBevelMap';

describe('kitBevelMapCandidates', () => {
  test('maps a kit GLB URL to webp then png sidecars', () => {
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001.glb')).toEqual([
      '/BionicleIdleRPG/kit_2001_bevel.webp',
      '/BionicleIdleRPG/kit_2001_bevel.png',
    ]);
  });

  test('strips query strings and ignores non-GLB URLs', () => {
    expect(kitBevelMapCandidates('https://example.test/kit_2003.glb?v=2')).toEqual([
      'https://example.test/kit_2003_bevel.webp',
      'https://example.test/kit_2003_bevel.png',
    ]);
    expect(kitBevelMapCandidates('/BionicleIdleRPG/kit_2001_bevel.webp')).toEqual([]);
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

  test('reuses the in-flight promise for the same kit URL', () => {
    globalThis.fetch = jest.fn().mockReturnValue(new Promise(() => undefined));
    const first = loadKitBevelMap('/kit_2004.glb');
    const second = loadKitBevelMap('/kit_2004.glb?cache=1');
    expect(second).toBe(first);
  });

  test('is a no-op without fetch (unit tests)', async () => {
    // @ts-expect-error simulate non-browser
    delete globalThis.fetch;
    await expect(loadKitBevelMap('/kit_2001.glb')).resolves.toBeUndefined();
    expect(Texture).toBeDefined();
  });
});
