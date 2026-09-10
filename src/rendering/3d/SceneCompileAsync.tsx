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

export type SceneCompileAsyncProps = {
  /**
   * Identity of the scene contents (character session, battle wave). Changing
   * this pauses the frame loop until {@link ready} and `compileAsync` finish.
   */
  compileKey: string;
  /** False while kit clones / combatants are still attaching. */
  ready: boolean;
};

/**
 * First draw of a new character (or battle lineup) compiles TSL → WGSL → GPU
 * pipelines on the main thread. Pause rAF until Three's `compileAsync` has
 * yielded through that work so the UI stays responsive.
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
    if (skip) return undefined;
    setFrameloop('never');
    return () => {
      setFrameloop(activeLoop);
    };
  }, [activeLoop, compileKey, setFrameloop, skip]);

  useEffect(() => {
    if (skip || !ready) return undefined;

    let cancelled = false;
    const renderer = gl as CompileAsyncRenderer;
    const resume = () => {
      if (cancelled) return;
      setFrameloop(activeLoop);
      invalidate();
    };

    const compile = renderer.compileAsync;
    if (typeof compile !== 'function') {
      resume();
      return undefined;
    }

    void compile
      .call(renderer, scene, camera)
      .catch((error: unknown) => {
        console.warn('[SceneCompileAsync] compileAsync failed', error);
      })
      .finally(resume);

    return () => {
      cancelled = true;
    };
  }, [activeLoop, camera, compileKey, gl, invalidate, ready, scene, setFrameloop, skip]);

  return null;
}
