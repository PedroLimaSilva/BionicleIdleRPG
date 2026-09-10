import { useEffect, useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { Camera, Scene } from 'three';
import { isTestMode } from '../../utils/testMode';

type CompileAsyncRenderer = {
  compileAsync?: (scene: Scene, camera: Camera) => Promise<unknown>;
};

function activeCanvasFrameLoop(): 'always' | 'demand' {
  return isTestMode() ? 'demand' : 'always';
}

/** Resume drawing even if `compileAsync` never settles (WebGL fallback quirks). */
export const SCENE_COMPILE_WATCHDOG_MS = 4000;

export type SceneCompileAsyncProps = {
  /**
   * Identity of the scene contents (character session, battle wave). Changing
   * this restarts warmup after kits / combatants report {@link ready}.
   */
  compileKey: string;
  /** False while kit clones / combatants are still attaching. */
  ready: boolean;
};

/**
 * First draw of a new character (or battle lineup) compiles TSL → WGSL → GPU
 * pipelines on the main thread. After kits attach, pause rAF until Three's
 * `compileAsync` has yielded through that work so the UI stays responsive.
 *
 * Do not pause before the first layout: R3F sizes the canvas on those frames.
 *
 * Compute shaders cannot do this: they do not parse GLBs, clone kit graphs, or
 * compile graphics pipelines. See `docs/3D_PERFORMANCE.md`.
 */
export function SceneCompileAsync({ compileKey, ready }: SceneCompileAsyncProps) {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);
  const scene = useThree((state) => state.scene);
  const setFrameloop = useThree((state) => state.setFrameloop);
  const skip = isTestMode();
  const activeLoop = activeCanvasFrameLoop();

  useLayoutEffect(() => {
    if (skip || !ready) return undefined;
    setFrameloop('never');
    return () => {
      setFrameloop(activeLoop);
    };
  }, [activeLoop, compileKey, ready, setFrameloop, skip]);

  useEffect(() => {
    if (skip || !ready) return undefined;

    let cancelled = false;
    let resumed = false;
    const resume = () => {
      if (cancelled || resumed) return;
      resumed = true;
      setFrameloop(activeLoop);
      invalidate();
    };
    const watchdog = window.setTimeout(resume, SCENE_COMPILE_WATCHDOG_MS);

    const renderer = gl as CompileAsyncRenderer;
    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') {
      window.clearTimeout(watchdog);
      resume();
      return undefined;
    }

    void compile
      .call(renderer, scene, camera)
      .catch((error: unknown) => {
        console.warn('[SceneCompileAsync] compileAsync failed', error);
      })
      .finally(() => {
        window.clearTimeout(watchdog);
        resume();
      });

    return () => {
      cancelled = true;
      window.clearTimeout(watchdog);
    };
  }, [activeLoop, camera, compileKey, gl, invalidate, ready, scene, setFrameloop, skip]);

  return null;
}
