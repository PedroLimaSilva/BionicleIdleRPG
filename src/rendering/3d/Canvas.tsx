import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { useBlocker, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { PCFSoftShadowMap, SRGBColorSpace } from 'three';
import { SceneCanvasContext } from './hooks/useSceneCanvas';
import { Perf } from 'r3f-perf';
import { shouldEnableShadows, isTestMode } from '../../utils/testMode';
import { useSettings } from '../../context/useSettings';
import { isCanvasRoute, shouldFadeCanvasOnExit } from './canvasRoutes';
import { MOTION_DURATION } from '../../motion/transitions';

const CANVAS_EXIT_FADE_MS = MOTION_DURATION.base * 1000;

/** Clears the WebGL buffer when there is no scene. Prevents stale content from showing if the canvas is revealed. */
function ClearCanvas() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.clear(true, true, true);
  }, [gl]);
  return null;
}

/** Set sRGB output once for the whole app so postprocessing and materials look correct. */
function SetSRGBColorSpace() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    gl.outputColorSpace = SRGBColorSpace;
  }, [gl]);
  return null;
}

/** Lets Playwright request a painted frame after a serial model hop. */
function TestModeInvalidateBridge() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!isTestMode()) return;
    const w = window as Window & { __R3F_INVALIDATE__?: () => void };
    w.__R3F_INVALIDATE__ = invalidate;
    return () => {
      delete w.__R3F_INVALIDATE__;
    };
  }, [invalidate]);
  return null;
}

/** Sync shadow map enabled state with the setting. */
function ShadowMapConfig() {
  const gl = useThree((s) => s.gl);
  const { shadowsEnabled } = useSettings();
  const shadowMapsOn = shadowsEnabled && shouldEnableShadows();
  useEffect(() => {
    gl.shadowMap.enabled = shadowMapsOn;
    gl.shadowMap.type = PCFSoftShadowMap;
    gl.shadowMap.needsUpdate = true;
  }, [gl, shadowMapsOn]);
  return null;
}

function useCanvasExitBlocker(setScene: (node: React.ReactNode) => void) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const skipFade = shouldReduceMotion || isTestMode();
  const exitInProgressRef = useRef(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    shouldFadeCanvasOnExit(currentLocation.pathname, nextLocation.pathname)
  );

  useEffect(() => {
    if (blocker.state !== 'blocked' || exitInProgressRef.current) return;

    const el = document.getElementById('canvas-mount');

    exitInProgressRef.current = true;

    if (!el || skipFade) {
      exitInProgressRef.current = false;
      setScene(null);
      blocker.proceed?.();
      return;
    }

    let completed = false;

    const complete = () => {
      if (completed) return;
      completed = true;
      window.clearTimeout(fallbackTimer);
      el.removeEventListener('transitionend', onTransitionEnd);
      exitInProgressRef.current = false;
      setScene(null);
      blocker.proceed?.();
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === el && event.propertyName === 'opacity') {
        complete();
      }
    };

    const fallbackTimer = window.setTimeout(complete, CANVAS_EXIT_FADE_MS + 50);

    el.addEventListener('transitionend', onTransitionEnd);
    requestAnimationFrame(() => {
      el.classList.add('canvas-mount--exiting');
    });

    return () => {
      completed = true;
      window.clearTimeout(fallbackTimer);
      el.removeEventListener('transitionend', onTransitionEnd);
    };
  }, [blocker, setScene, skipFade]);
}

export const SceneCanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState<React.ReactNode>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const { performanceMonitorEnabled } = useSettings();

  const location = useLocation();

  useCanvasExitBlocker(setScene);

  useEffect(() => {
    const el = document.getElementById('canvas-mount');
    if (el) {
      setTarget(el);

      el.className = `canvas-mount route-${location.pathname.replace(/\//g, '-')}`;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isCanvasRoute(location.pathname)) {
      setScene(null);
    }
  }, [location.pathname]);

  return (
    <SceneCanvasContext.Provider value={{ scene, setScene }}>
      {children}
      {target &&
        createPortal(
          <Canvas
            className="shared-canvas"
            frameloop={isTestMode() ? 'demand' : 'always'}
            gl={{ antialias: true }}
            orthographic
            shadows
          >
            <SetSRGBColorSpace />
            <ShadowMapConfig />
            <TestModeInvalidateBridge />
            {performanceMonitorEnabled && !isTestMode() && <Perf position="top-left" />}
            {scene ?? <ClearCanvas />}
          </Canvas>,
          target
        )}
    </SceneCanvasContext.Provider>
  );
};
