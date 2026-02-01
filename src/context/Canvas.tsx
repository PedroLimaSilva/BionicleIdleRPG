import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { useLocation } from 'react-router-dom';
import { SceneCanvasContext } from '../hooks/useSceneCanvas';
import { Perf } from 'r3f-perf';
import { getDebugMode } from '../services/gamePersistence';

export const SceneCanvasProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scene, setScene] = useState<React.ReactNode>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const [debugMode] = useState(getDebugMode());

  const location = useLocation();

  useEffect(() => {
    const el = document.getElementById('canvas-mount');
    if (el) {
      setTarget(el);

      // Optional: dynamically assign a route-based class
      el.className = `canvas-mount route-${location.pathname.replace(
        /\//g,
        '-'
      )}`;

      setTimeout(() => {}, 0);
    }
  }, [location.pathname]);

  return (
    <SceneCanvasContext.Provider value={{ setScene, scene }}>
      {children}
      {target &&
        createPortal(
          <Canvas className='shared-canvas' orthographic>
            {debugMode && <Perf position='top-left' />}
            {scene}
          </Canvas>,
          target
        )}
    </SceneCanvasContext.Provider>
  );
};
