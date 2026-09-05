import { WebGPURenderer } from 'three/webgpu';
import { isTestMode } from '../../utils/testMode';
import { installTintSafeNodeLibrary } from './tsl/tintSafe';

type WebGPURendererOptions = ConstructorParameters<typeof WebGPURenderer>[0];

function createRenderer(canvas: HTMLCanvasElement, forceWebGL: boolean): WebGPURenderer {
  return new WebGPURenderer({
    alpha: true,
    antialias: true,
    canvas,
    forceWebGL,
  } as WebGPURendererOptions);
}

function shouldInstallTintSafePatch(forceWebGL: boolean, renderer: WebGPURenderer): boolean {
  return !forceWebGL && !isWebGLBackend(renderer);
}

/**
 * R3F Canvas `gl` factory: WebGPURenderer with automatic WebGL 2 fallback.
 * Playwright snapshots force the WebGL backend so pixels stay deterministic.
 *
 * Chrome on macOS has a WebGPU adapter, so this path actually runs WGSL. The
 * Cloud VM usually has `navigator.gpu` but no adapter and falls back to WebGL 2.
 *
 * The Tint SplitNode rewrite is WGSL/Metal-only. Do not install it for
 * Playwright (forced WebGL) or the WebGL fallback — that would drift goldens
 * and is unnecessary for GLSL.
 */
export async function createSceneWebGPURenderer(props: {
  canvas: HTMLCanvasElement;
}): Promise<WebGPURenderer> {
  const forceWebGL = isTestMode();
  const renderer = createRenderer(props.canvas, forceWebGL);
  try {
    await renderer.init();
    if (shouldInstallTintSafePatch(forceWebGL, renderer)) {
      installTintSafeNodeLibrary();
    }
    return renderer;
  } catch (error: unknown) {
    if (forceWebGL) throw error;
    console.warn('[webgpuRenderer] WebGPU init failed, retrying with WebGL 2', error);
    const fallback = createRenderer(props.canvas, true);
    await fallback.init();
    return fallback;
  }
}

export function isWebGLBackend(gl: unknown): boolean {
  const backend = (gl as { backend?: { isWebGLBackend?: boolean } }).backend;
  if (backend) return !!backend.isWebGLBackend;
  return typeof (gl as { getContext?: unknown }).getContext === 'function';
}
