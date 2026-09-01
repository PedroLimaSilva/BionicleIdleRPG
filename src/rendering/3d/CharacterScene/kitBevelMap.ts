/**
 * Baked bevel maps for kit parts.
 *
 * Detailed pieces get their own files (texel density is not uniform — MataChest
 * needs more than Axle2L). Lookup is part-level first, then an optional kit atlas:
 *
 *   public/kit_2001.glb
 *     → public/kit_2001/MataChest_bevel.webp   (or .png)
 *     → public/kit_2001_bevel.webp             (leftover kit atlas, or .png)
 *
 * Names match `KIT_*_NODES` / `row.kitNodeName` (`MataChest`, `Axle2L`), not inner
 * mesh names like `Part-32554_dot_dat.002`. Packed non-color: R = convex edge wear,
 * G = concave cavity. Not an albedo.
 *
 * Slot colors / emission / roughness / metalness stay on the weathered material.
 * The map is geometric and shared by every weathered slot on that part's meshes
 * that have UVs. Missing files are not an error — axles can omit bakes.
 */

import {
  ClampToEdgeWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  Texture,
  TextureLoader,
} from 'three';

const loadCache = new Map<string, Promise<Texture | undefined>>();

function kitGlbBase(kitUrl: string): string | undefined {
  const path = kitUrl.split('?')[0];
  if (!/\.glb$/i.test(path)) return undefined;
  return path.replace(/\.glb$/i, '');
}

function kitAtlasCacheKey(base: string): string {
  return `${base}::atlas`;
}

function kitPartCacheKey(base: string, node: string): string {
  return `${base}::part::${node}`;
}

/** Safe filename stem from a kit node name. Rejects path separators / traversal. */
export function sanitizeKitBevelNodeName(kitNodeName: string): string | undefined {
  const trimmed = kitNodeName.trim();
  if (!trimmed) return undefined;
  if (/[\\/]/.test(trimmed) || trimmed.includes('..')) return undefined;
  const safe = trimmed.replace(/[^A-Za-z0-9._-]/g, '_');
  if (!safe || safe === '.' || safe === '..') return undefined;
  return safe;
}

function kitAtlasCandidates(base: string): string[] {
  return [`${base}_bevel.webp`, `${base}_bevel.png`];
}

function kitPartCandidates(base: string, node: string): string[] {
  return [`${base}/${node}_bevel.webp`, `${base}/${node}_bevel.png`];
}

/**
 * Candidate URLs for a kit bevel map (webp first, then png).
 * With `kitNodeName`: part file, then leftover kit atlas.
 * Without: kit atlas only (preload).
 */
export function kitBevelMapCandidates(kitUrl: string, kitNodeName?: string): string[] {
  const base = kitGlbBase(kitUrl);
  if (!base) return [];
  const atlas = kitAtlasCandidates(base);
  if (kitNodeName === undefined) return atlas;
  const node = sanitizeKitBevelNodeName(kitNodeName);
  if (!node) return atlas;
  return [...kitPartCandidates(base, node), ...atlas];
}

export function configureBevelMapTexture(texture: Texture): Texture {
  texture.colorSpace = NoColorSpace;
  texture.flipY = true;
  texture.generateMipmaps = true;
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.needsUpdate = true;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  return texture;
}

function loadTextureFromObjectUrl(objectUrl: string): Promise<Texture> {
  return new Promise((resolve, reject) => {
    const loader = new TextureLoader();
    loader.load(objectUrl, resolve, undefined, reject);
  });
}

async function loadTextureFromCandidates(candidates: string[]): Promise<Texture | undefined> {
  if (typeof fetch !== 'function') return undefined;
  for (const url of candidates) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const blob = await res.blob();
      if (blob.size === 0) continue;
      const objectUrl = URL.createObjectURL(blob);
      try {
        const texture = await loadTextureFromObjectUrl(objectUrl);
        texture.name = url;
        return configureBevelMapTexture(texture);
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch {
      // Try the next candidate (or give up).
    }
  }
  return undefined;
}

function cachedLoad(cacheKey: string, candidates: string[]): Promise<Texture | undefined> {
  const cached = loadCache.get(cacheKey);
  if (cached) return cached;
  const pending = loadTextureFromCandidates(candidates);
  loadCache.set(cacheKey, pending);
  return pending;
}

function loadKitAtlas(base: string): Promise<Texture | undefined> {
  return cachedLoad(kitAtlasCacheKey(base), kitAtlasCandidates(base));
}

/**
 * Loads the bevel map for one kit node (or the leftover kit atlas when
 * `kitNodeName` is omitted). Missing files are not an error — weathered metal
 * keeps its procedural / screen-space fallback. Successful loads are cached
 * for the lifetime of the page. Several parts falling back to the kit atlas
 * share one GPU texture.
 */
export function loadKitBevelMap(
  kitUrl: string,
  kitNodeName?: string
): Promise<Texture | undefined> {
  const base = kitGlbBase(kitUrl);
  if (!base) return Promise.resolve(undefined);

  if (kitNodeName === undefined) return loadKitAtlas(base);

  const node = sanitizeKitBevelNodeName(kitNodeName);
  if (!node) return loadKitAtlas(base);

  const partKey = kitPartCacheKey(base, node);
  const cached = loadCache.get(partKey);
  if (cached) return cached;

  const pending = (async () => {
    const part = await loadTextureFromCandidates(kitPartCandidates(base, node));
    if (part) return part;
    return loadKitAtlas(base);
  })();

  loadCache.set(partKey, pending);
  return pending;
}

/** Load maps for the unique node names on a character (one fetch plan per name). */
export async function loadKitBevelMapsForNodes(
  kitUrl: string,
  kitNodeNames: readonly string[]
): Promise<ReadonlyMap<string, Texture | undefined>> {
  const unique = [...new Set(kitNodeNames)];
  const entries = await Promise.all(
    unique.map(async (name) => [name, await loadKitBevelMap(kitUrl, name)] as const)
  );
  return new Map(entries);
}

/** Test helper: drop a cached load (does not dispose GPU textures). */
export function clearKitBevelMapCache(): void {
  loadCache.clear();
}
