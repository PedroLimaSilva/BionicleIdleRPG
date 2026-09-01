/**
 * Baked bevel maps for kit parts that are explicitly listed in
 * `KIT_*_BEVEL_NODES`.
 *
 *   public/kit_2001.glb + MataChest (when listed)
 *     → public/kit_2001/MataChest_bevel.webp   (or .png)
 *
 * Unlisted parts are not fetched. Names match `KIT_*_NODES` / `row.kitNodeName`
 * (`MataChest`), not inner mesh names. Packed non-color: R = convex edge wear,
 * G = concave cavity. Not an albedo.
 *
 * Slot colors / emission / roughness / metalness stay on the weathered material.
 * The map is geometric and shared by every weathered slot on that part's meshes
 * that have UVs.
 */

import {
  ClampToEdgeWrapping,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  Texture,
  TextureLoader,
} from 'three';
import {
  declaredKitBevelNodeNames,
  filterDeclaredKitBevelNodes,
  kitNodeHasDeclaredBevelMap,
} from '../kit/kitBevelNodes';

const loadCache = new Map<string, Promise<Texture | undefined>>();

function kitGlbBase(kitUrl: string): string | undefined {
  const path = kitUrl.split('?')[0];
  if (!/\.glb$/i.test(path)) return undefined;
  return path.replace(/\.glb$/i, '');
}

export function kitGlbStem(kitUrl: string): string | undefined {
  const base = kitGlbBase(kitUrl);
  if (!base) return undefined;
  const slash = Math.max(base.lastIndexOf('/'), base.lastIndexOf('\\'));
  return slash >= 0 ? base.slice(slash + 1) : base;
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

function kitPartBevelUrls(base: string, node: string): string[] {
  return [`${base}/${node}_bevel.webp`, `${base}/${node}_bevel.png`];
}

/**
 * Candidate URLs for a declared part bevel map (webp first, then png).
 * Empty when the kit URL is not a GLB, the node name is unsafe, or the node
 * is not on that kit's bevel allowlist.
 */
export function kitBevelMapCandidates(kitUrl: string, kitNodeName: string): string[] {
  const base = kitGlbBase(kitUrl);
  const stem = kitGlbStem(kitUrl);
  if (!base || !stem) return [];
  const node = sanitizeKitBevelNodeName(kitNodeName);
  if (!node || !kitNodeHasDeclaredBevelMap(stem, node)) return [];
  return kitPartBevelUrls(base, node);
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

/**
 * Loads the bevel map for one declared kit node. Undeclared names and missing
 * files are not an error — weathered metal keeps its procedural / screen-space
 * fallback. Successful loads are cached for the lifetime of the page.
 */
export function loadKitBevelMap(kitUrl: string, kitNodeName: string): Promise<Texture | undefined> {
  const candidates = kitBevelMapCandidates(kitUrl, kitNodeName);
  if (candidates.length === 0) return Promise.resolve(undefined);

  const base = kitGlbBase(kitUrl);
  const node = sanitizeKitBevelNodeName(kitNodeName);
  if (!base || !node) return Promise.resolve(undefined);

  const partKey = kitPartCacheKey(base, node);
  const cached = loadCache.get(partKey);
  if (cached) return cached;

  const pending = loadTextureFromCandidates(candidates);
  loadCache.set(partKey, pending);
  return pending;
}

/**
 * Load maps for declared nodes. When `kitNodeNames` is omitted, loads every
 * node on that kit's allowlist (preload). Attached names are intersected with
 * the allowlist so axles never hit the network.
 */
export async function loadKitBevelMapsForNodes(
  kitUrl: string,
  kitNodeNames?: readonly string[]
): Promise<ReadonlyMap<string, Texture | undefined>> {
  const stem = kitGlbStem(kitUrl);
  if (!stem) return new Map();

  const unique = kitNodeNames
    ? filterDeclaredKitBevelNodes(stem, kitNodeNames)
    : declaredKitBevelNodeNames(stem);

  const entries = await Promise.all(
    unique.map(async (name) => [name, await loadKitBevelMap(kitUrl, name)] as const)
  );
  return new Map(entries);
}

/** Test helper: drop a cached load (does not dispose GPU textures). */
export function clearKitBevelMapCache(): void {
  loadCache.clear();
}
