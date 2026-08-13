import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { PCFSoftShadowMap, SRGBColorSpace } from 'three';
import { SceneCanvasContext } from '../hooks/useSceneCanvas';
import { Perf } from 'r3f-perf';
import { shouldEnableShadows, isTestMode } from '../utils/testMode';
import { useSettings } from './useSettings';

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

/**
 * Routes that own a shared 3D scene. The set is used to decide whether to clear the scene
 * on navigation; pages NOT in this set get a cleared scene (so e.g. the Quests page doesn't
 * inherit a leftover character preview).
 *
 * Listing the prefixes here lets canvas-using pages drop the `setScene(null)` cleanup from
 * their own effects, which is what enables the same `CharacterScene` instance (and its
 * postprocessing EffectComposer) to survive the /character-create → /characters/:id
 * transition. Tearing the scene down + recreating it during that transition was racing with
 * WebGL context setup and surfaced as "Cannot read properties of null (alpha)".
 */
const CANVAS_ROUTE_PREFIXES = [
  '/recruitment',
  '/character-create',
  '/characters/',
  '/rahkshi/',
  '/battle',
];

function isCanvasRoute(pathname: string): boolean {
  return CANVAS_ROUTE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
}

export const SceneCanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState<React.ReactNode>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const { performanceMonitorEnabled } = useSettings();

  const location = useLocation();

  useEffect(() => {
    const el = document.getElementById('canvas-mount');
    if (el) {
      setTarget(el);

      // Optional: dynamically assign a route-based class
      el.className = `canvas-mount route-${location.pathname.replace(/\//g, '-')}`;

      setTimeout(() => {}, 0);
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
            {performanceMonitorEnabled && !isTestMode() && <Perf position="top-left" />}
            {scene ?? <ClearCanvas />}
          </Canvas>,
          target
        )}
    </SceneCanvasContext.Provider>
  );
};
