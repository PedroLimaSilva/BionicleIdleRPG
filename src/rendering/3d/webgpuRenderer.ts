import { WebGPURenderer } from 'three/webgpu';
import { isTestMode } from '../../utils/testMode';
import { canvasMsaaForDevice } from './canvasPixelRatio';
import { installTintSafeNodeLibrary } from './tsl/tintSafe';
import { installTopologyCacheKeyPatch } from './tsl/installTopologyCacheKeyPatch';

type WebGPURendererOptions = ConstructorParameters<typeof WebGPURenderer>[0];

/**
 * Same missing-value rule as R3F `calculateDpr`: a window that does not report
 * `devicePixelRatio` is treated as 2×. No window (unit tests) stays at 1×.
 */
export function readDevicePixelRatio(): number {
  if (typeof window === 'undefined') return 1;
  const dpr = window.devicePixelRatio;
  return dpr == null ? 2 : dpr;
}

function createRenderer(
  canvas: HTMLCanvasElement,
  forceWebGL: boolean,
  antialias: boolean
): WebGPURenderer {
  return new WebGPURenderer({
    alpha: true,
    antialias,
    canvas,
    forceWebGL,
    // The canvas context stays non-MSAA: Three composites through an sRGB
    // target and reads `renderer.samples` for that target. 4 at 1×, 0 above.
    samples: antialias ? 4 : 0,
  } as WebGPURendererOptions);
}

function shouldInstallTintSafePatch(forceWebGL: boolean, renderer: WebGPURenderer): boolean {
  return !forceWebGL && !isWebGLBackend(renderer);
}

/**
 * R3F Canvas `gl` factory: WebGPURenderer with automatic WebGL 2 fallback.
 * Playwright snapshots force the WebGL backend so pixels stay deterministic.
 * Desktop Chrome in Playwright is 1×, so MSAA stays on and those snapshots do
 * not move. Above 1× this factory skips MSAA; R3F then clamps the buffer with
 * `CANVAS_DPR` (`[1, 1.5]`).
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
  /**
   * Display pixel ratio used to choose MSAA. Omit to read `window`.
   * Antialias cannot change after the context exists, so a later monitor
   * or zoom change updates resolution via R3F `dpr` and leaves MSAA as decided here.
   */
  devicePixelRatio?: number;
}): Promise<WebGPURenderer> {
  const forceWebGL = isTestMode();
  const antialias = canvasMsaaForDevice(props.devicePixelRatio ?? readDevicePixelRatio());
  const renderer = createRenderer(props.canvas, forceWebGL, antialias);
  try {
    await renderer.init();
    if (shouldInstallTintSafePatch(forceWebGL, renderer)) {
      installTintSafeNodeLibrary();
      installTopologyCacheKeyPatch();
    }
    return renderer;
  } catch (error: unknown) {
    if (forceWebGL) throw error;
    console.warn('[webgpuRenderer] WebGPU init failed, retrying with WebGL 2', error);
    const fallback = createRenderer(props.canvas, true, antialias);
    await fallback.init();
    return fallback;
  }
}

export function isWebGLBackend(gl: unknown): boolean {
  const backend = (gl as { backend?: { isWebGLBackend?: boolean } }).backend;
  if (backend) return !!backend.isWebGLBackend;
  return typeof (gl as { getContext?: unknown }).getContext === 'function';
}
