import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { PCFSoftShadowMap, SRGBColorSpace } from 'three';
import { SceneCanvasContext } from '../hooks/useSceneCanvas';
import { Perf } from 'r3f-perf';
import { useSettings } from './useSettings';

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
  useEffect(() => {
    gl.shadowMap.enabled = shadowsEnabled;
    gl.shadowMap.type = PCFSoftShadowMap;
    gl.shadowMap.needsUpdate = true;
  }, [gl, shadowsEnabled]);
  return null;
}

export const SceneCanvasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scene, setScene] = useState<React.ReactNode>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const { debugMode } = useSettings();

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

  return (
    <SceneCanvasContext.Provider value={{ setScene, scene }}>
      {children}
      {target &&
        createPortal(
          <Canvas className="shared-canvas" orthographic shadows gl={{ antialias: true }}>
            <SetSRGBColorSpace />
            <ShadowMapConfig />
            {debugMode && <Perf position="top-left" />}
            {scene}
          </Canvas>,
          target
        )}
    </SceneCanvasContext.Provider>
  );
};
