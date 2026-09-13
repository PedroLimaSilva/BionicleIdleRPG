import { useEffect, useLayoutEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import type { Camera, Object3D, Scene } from 'three';
import { isTestMode } from '../../utils/testMode';
import { isWebGLBackend } from './webgpuRenderer';

type CompileAsyncRenderer = {
  compileAsync?: (object: Object3D, camera: Camera, targetScene?: Scene | null) => Promise<unknown>;
};

/**
 * After kit clones land, run Three's yielding `compileAsync` so TSL → WGSL →
 * GPU pipelines are built off the rAF hot path. WebGPU only: the WebGL
 * fallback's compileAsync can stall the drawing buffer on this path.
 *
 * Compute shaders cannot do this work — see `docs/3D_PERFORMANCE.md`.
 *
 * Three's projector skips `visible === false` subtrees, so a hidden rig must be
 * compiled via `compileAsync(root, camera, scene)` with the root briefly shown
 * while the R3F frameloop is paused. Otherwise the first painted frame sync-
 * compiles leftover (usually skinned) pipelines inside `loop()`.
 */
export function SceneCompileAsync({
  compileKey,
  compileRootRef,
  hideUntilCompiled = false,
  ready,
}: {
  compileKey: string;
  compileRootRef?: { current: Object3D | null };
  hideUntilCompiled?: boolean;
  ready: boolean;
}) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const invalidate = useThree((state) => state.invalidate);
  const setFrameloop = useThree((state) => state.setFrameloop);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  const skipHide = isTestMode() || !hideUntilCompiled;

  useLayoutEffect(() => {
    if (skipHide) return undefined;
    const root = compileRootRef?.current;
    if (!root) return undefined;
    root.visible = revealedKey === compileKey;
    return undefined;
  }, [compileKey, compileRootRef, revealedKey, skipHide, ready]);

  useEffect(() => {
    if (isTestMode()) {
      if (ready) setRevealedKey(compileKey);
      return undefined;
    }
    if (!ready) return undefined;
    if (isWebGLBackend(gl)) {
      setRevealedKey(compileKey);
      return undefined;
    }

    const renderer = gl as CompileAsyncRenderer;
    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') {
      setRevealedKey(compileKey);
      return undefined;
    }

    const root = compileRootRef?.current ?? null;
    const compileOffstage = hideUntilCompiled && root !== null;
    let cancelled = false;

    setFrameloop('never');
    if (compileOffstage) {
      root.visible = true;
    }

    const compilePromise = compileOffstage
      ? compile.call(renderer, root, camera, scene)
      : compile.call(renderer, scene, camera);

    void compilePromise
      .catch((error: unknown) => {
        console.warn('[SceneCompileAsync] compileAsync failed', error);
      })
      .finally(() => {
        if (cancelled) return;
        setRevealedKey(compileKey);
        setFrameloop('always');
        invalidate();
      });

    return () => {
      cancelled = true;
      setFrameloop('always');
    };
  }, [
    camera,
    compileKey,
    compileRootRef,
    gl,
    hideUntilCompiled,
    invalidate,
    ready,
    scene,
    setFrameloop,
  ]);

  return null;
}
