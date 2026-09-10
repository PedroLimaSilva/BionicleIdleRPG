import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { Camera, Scene } from 'three';
import { isTestMode } from '../../utils/testMode';
import { isWebGLBackend } from './webgpuRenderer';

type CompileAsyncRenderer = {
  compileAsync?: (scene: Scene, camera: Camera) => Promise<unknown>;
};

/**
 * After kit clones land, run Three's yielding `compileAsync` so TSL → WGSL →
 * GPU pipelines are built off the rAF hot path. WebGPU only: the WebGL
 * fallback's compileAsync can stall the drawing buffer on this path.
 *
 * Compute shaders cannot do this work — see `docs/3D_PERFORMANCE.md`.
 */
export function SceneCompileAsync({ compileKey, ready }: { compileKey: string; ready: boolean }) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (isTestMode() || !ready) return undefined;
    if (isWebGLBackend(gl)) return undefined;

    const renderer = gl as CompileAsyncRenderer;
    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') return undefined;

    void compile.call(renderer, scene, camera).catch((error: unknown) => {
      console.warn('[SceneCompileAsync] compileAsync failed', error);
    });

    return undefined;
  }, [camera, compileKey, gl, ready, scene]);

  return null;
}
