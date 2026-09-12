import {
  ClampToEdgeWrapping,
  DataTexture,
  NearestFilter,
  NoColorSpace,
  RGBAFormat,
  UnsignedByteType,
} from 'three';

function makeSwatch(r: number, g: number, b: number, a = 255): DataTexture {
  const texture = new DataTexture(new Uint8Array([r, g, b, a]), 1, 1, RGBAFormat, UnsignedByteType);
  texture.colorSpace = NoColorSpace;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/** Black 1×1 seed so bake-present TSL compiles without `texture(null)`. */
export const DUMMY_DISCOLORATION_MAP = makeSwatch(0, 0, 0);

/** Flat normal 1×1 for the authored-normal weathered topology warmup. */
export const DUMMY_NORMAL_MAP = makeSwatch(128, 128, 255);

export function isDummyDiscolorationMap(texture: unknown): boolean {
  return texture === DUMMY_DISCOLORATION_MAP;
}
