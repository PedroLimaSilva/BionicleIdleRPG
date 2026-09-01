/**
 * Sidecar bevel atlases for kit GLBs.
 *
 * Convention: `public/kit_2001.glb` → `public/kit_2001_bevel.webp` (PNG fallback).
 * Packed non-color: R = convex edge wear, G = concave cavity / AO. Not an albedo.
 *
 * Slot colors / emission / roughness / metalness stay on the weathered material;
 * this map is geometric and shared by every weathered slot on meshes that have UVs.
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

/** Candidate URLs for a kit GLB's bevel atlas (webp first, then png). */
export function kitBevelMapCandidates(kitUrl: string): string[] {
  const path = kitUrl.split('?')[0];
  if (!/\.glb$/i.test(path)) return [];
  const base = path.replace(/\.glb$/i, '');
  return [`${base}_bevel.webp`, `${base}_bevel.png`];
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

/**
 * Loads the bevel atlas for `kitUrl` if the sidecar exists. Missing files are
 * not an error — weathered metal keeps its procedural / screen-space fallback.
 * Successful loads are cached for the lifetime of the page.
 */
export function loadKitBevelMap(kitUrl: string): Promise<Texture | undefined> {
  const cacheKey = kitUrl.split('?')[0];
  const cached = loadCache.get(cacheKey);
  if (cached) return cached;

  const pending = (async () => {
    if (typeof fetch !== 'function') return undefined;
    for (const url of kitBevelMapCandidates(kitUrl)) {
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
  })();

  loadCache.set(cacheKey, pending);
  return pending;
}

/** Test helper: drop a cached load (does not dispose GPU textures). */
export function clearKitBevelMapCache(): void {
  loadCache.clear();
}
