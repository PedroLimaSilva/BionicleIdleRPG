/**
 * Baked grayscale discoloration lives in the glTF emissive slot (Blender Simple Bake).
 * It is *not* light: we steal `emissiveMap`, zero real emission, and mix albedo
 * toward {@link discolorationForColor} where the bake is bright.
 */

import {
  ClampToEdgeWrapping,
  Color,
  DataTexture,
  LinearFilter,
  MeshStandardMaterial,
  NoColorSpace,
  Texture,
} from 'three';
import { discolorationForColor } from '../kit/palettes/legoColorDiscoloration';

export const DISCOLORATION_MAP_USERDATA_KEY = 'bakedDiscolorationMap';
export const DISCOLORATION_UNIFORMS_KEY = 'bakedDiscolorationUniforms';

export type BakedDiscolorationUniforms = {
  discolorationMap: { value: Texture };
  uDiscolorationColor: { value: Color };
  uDiscolorationIntensity: { value: number };
  uHasDiscolorationMap: { value: number };
};

export const EMPTY_DISCOLORATION_MAP = (() => {
  const tex = new DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  tex.colorSpace = NoColorSpace;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.wrapS = ClampToEdgeWrapping;
  tex.wrapT = ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
})();

/** GLSL attribute for a glTF `texCoord` / Three.js `texture.channel` (0 → `uv`, 1 → `uv1`, …). */
export function glslUvAttributeForTextureChannel(channel: number | undefined): string {
  const c = channel ?? 0;
  return c <= 0 ? 'uv' : `uv${c}`;
}

export function getBakedDiscolorationMap(mat: unknown): Texture | null {
  const fromUserData = (mat as { userData?: Record<string, unknown> }).userData?.[
    DISCOLORATION_MAP_USERDATA_KEY
  ];
  if (fromUserData instanceof Texture) return fromUserData;
  const emissiveMap = (mat as MeshStandardMaterial).emissiveMap;
  return emissiveMap ?? null;
}

/**
 * Move `emissiveMap` onto userData so MeshStandardMaterial will not multiply it
 * into real emission (mask power / kit glow). Idempotent. Does not mutate maps
 * on glow materials.
 */
export function adoptBakedDiscolorationMap(
  mat: MeshStandardMaterial,
  opts: { isGlow?: boolean } = {}
): Texture | null {
  if (opts.isGlow) return null;
  const existing = mat.userData[DISCOLORATION_MAP_USERDATA_KEY];
  if (existing instanceof Texture) return existing;
  const map = mat.emissiveMap;
  if (!map) return null;
  map.colorSpace = NoColorSpace;
  // Bakes are atlas-packed; REPEAT shows island outlines when UVs skim edges.
  map.wrapS = ClampToEdgeWrapping;
  map.wrapT = ClampToEdgeWrapping;
  mat.userData[DISCOLORATION_MAP_USERDATA_KEY] = map;
  mat.emissiveMap = null;
  mat.emissive.set(0, 0, 0);
  mat.emissiveIntensity = 0;
  return map;
}

export function createBakedDiscolorationUniforms(
  map: Texture | null,
  colorHex: string
): BakedDiscolorationUniforms {
  const spec = discolorationForColor(colorHex);
  return {
    discolorationMap: { value: map ?? EMPTY_DISCOLORATION_MAP },
    uDiscolorationColor: { value: new Color(spec.color) },
    uDiscolorationIntensity: { value: map ? spec.intensity : 0 },
    uHasDiscolorationMap: { value: map ? 1 : 0 },
  };
}

export function applyBakedDiscolorationUniforms(
  uniforms: BakedDiscolorationUniforms,
  colorHex: string,
  map: Texture | null
): void {
  const spec = discolorationForColor(colorHex);
  uniforms.discolorationMap.value = map ?? EMPTY_DISCOLORATION_MAP;
  uniforms.uDiscolorationColor.value.set(spec.color);
  uniforms.uDiscolorationIntensity.value = map ? spec.intensity : 0;
  uniforms.uHasDiscolorationMap.value = map ? 1 : 0;
}

/**
 * Mix albedo toward the color-specific tint using a grayscale wear bake.
 * `smoothstep` crushes mid-gray floors so only true edge/highlight texels mix.
 */
export const BAKED_DISCOLORATION_FRAGMENT_GLSL = `
      float bakedDiscolorSample = clamp(texture2D(discolorationMap, vDiscolorUv).r, 0.0, 1.0);
      float bakedDiscolorAmt = uHasDiscolorationMap * smoothstep(0.2, 0.75, bakedDiscolorSample);
      diffuseColor.rgb = mix(diffuseColor.rgb, uDiscolorationColor, clamp(bakedDiscolorAmt * uDiscolorationIntensity, 0.0, 1.0));
`;
