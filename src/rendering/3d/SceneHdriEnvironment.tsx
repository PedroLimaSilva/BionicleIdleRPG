import { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EquirectangularReflectionMapping, type Mesh, type Scene, type Texture } from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { PMREMGenerator } from 'three/webgpu';

import { isWebGLBackend } from './webgpuRenderer';

type HdriRenderer = ConstructorParameters<typeof PMREMGenerator>[0] & {
  init?: () => Promise<unknown>;
};

type CachedPmrem = { texture: Texture | null };

const hdrByUrl = new Map<string, Promise<Texture>>();
const pmremByRenderer = new WeakMap<object, Map<string, CachedPmrem>>();
const pendingPmrem = new WeakMap<object, Map<string, Promise<Texture | null>>>();
const generators = new WeakMap<object, InstanceType<typeof PMREMGenerator>>();

function loadHdr(url: string): Promise<Texture> {
  let pending = hdrByUrl.get(url);
  if (!pending) {
    pending = new HDRLoader().loadAsync(url).then((texture) => {
      texture.mapping = EquirectangularReflectionMapping;
      return texture;
    });
    hdrByUrl.set(url, pending);
  }
  return pending;
}

function getGenerator(renderer: HdriRenderer): InstanceType<typeof PMREMGenerator> {
  let generator = generators.get(renderer);
  if (!generator) {
    generator = new PMREMGenerator(renderer);
    generators.set(renderer, generator);
  }
  return generator;
}

function getCachedPmrem(renderer: object, url: string): CachedPmrem | undefined {
  return pmremByRenderer.get(renderer)?.get(url);
}

function setCachedPmrem(renderer: object, url: string, entry: CachedPmrem): void {
  let byUrl = pmremByRenderer.get(renderer);
  if (!byUrl) {
    byUrl = new Map();
    pmremByRenderer.set(renderer, byUrl);
  }
  byUrl.set(url, entry);
}

async function bakePmrem(renderer: HdriRenderer, url: string): Promise<Texture | null> {
  try {
    if (typeof renderer.init === 'function') {
      await renderer.init();
    }
    const hdr = await loadHdr(url);
    // WebGL 2: TSL EnvironmentNode's pmremTexture() bake during pass() often
    // leaves an empty default texture (black metals). Bake CubeUV up front.
    // WebGPU: that same fromEquirectangular() bake has been a Chrome/Metal
    // device-loss source; assign the equirect and let EnvironmentNode PMREM it.
    if (!isWebGLBackend(renderer)) {
      setCachedPmrem(renderer, url, { texture: hdr });
      return hdr;
    }
    const renderTarget = getGenerator(renderer).fromEquirectangular(hdr);
    const texture = renderTarget.texture;
    setCachedPmrem(renderer, url, { texture });
    return texture;
  } catch (error: unknown) {
    console.error('[SceneHdriEnvironment] Failed to bake HDRI', url, error);
    setCachedPmrem(renderer, url, { texture: null });
    return null;
  }
}

function getPmremPromise(renderer: HdriRenderer, url: string): Promise<Texture | null> {
  const cached = getCachedPmrem(renderer, url);
  if (cached) return Promise.resolve(cached.texture);

  let byUrl = pendingPmrem.get(renderer);
  if (!byUrl) {
    byUrl = new Map();
    pendingPmrem.set(renderer, byUrl);
  }
  let pending = byUrl.get(url);
  if (!pending) {
    pending = bakePmrem(renderer, url);
    byUrl.set(url, pending);
  }
  return pending;
}

/** Suspends until the CubeUV PMREM for this renderer+URL is baked (or bake fails). */
function readPmrem(renderer: HdriRenderer, url: string): Texture | null {
  const cached = getCachedPmrem(renderer, url);
  if (cached) return cached.texture;
  throw getPmremPromise(renderer, url);
}

function markMaterialsNeedEnvironment(scene: Scene): void {
  scene.traverse((object) => {
    const mesh = object as Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (material) material.needsUpdate = true;
    }
  });
}

/**
 * Loads an HDR equirect onto `scene.environment`.
 *
 * On the WebGL 2 backend, bakes a CubeUV PMREM up front — drei's `<Environment>`
 * assigned the raw RGBE map and the TSL `EnvironmentNode` bake during `pass()`
 * left metals reflecting black. On WebGPU the node path can PMREM the equirect
 * itself; calling `PMREMGenerator.fromEquirectangular` up front has lost the
 * GPU device on Chrome/macOS (blank canvas + validation errors).
 */
export function SceneHdriEnvironment({
  files,
  intensity,
  path,
}: {
  files: string;
  intensity: number;
  path: string;
}) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  const url = `${path}${files}`;
  const renderer = gl as unknown as HdriRenderer;
  const texture = readPmrem(renderer, url);

  useLayoutEffect(() => {
    const envScene = scene as Scene & { environmentIntensity: number };
    envScene.environmentIntensity = intensity;
    if (!texture) return;
    envScene.environment = texture;
    markMaterialsNeedEnvironment(scene);
    invalidate();
    return () => {
      if (envScene.environment === texture) envScene.environment = null;
    };
  }, [intensity, invalidate, scene, texture]);

  return null;
}
