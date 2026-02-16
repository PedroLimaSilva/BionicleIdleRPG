import { createContext, useContext } from 'react';

interface SceneCanvasContextProps {
  setScene: (node: React.ReactNode) => void;
  scene: React.ReactNode;
  sceneReady: boolean;
  setSceneReady: (ready: boolean) => void;
}

export const SceneCanvasContext = createContext<SceneCanvasContextProps | null>(null);

export const useSceneCanvas = () => {
  const ctx = useContext(SceneCanvasContext);
  if (!ctx) throw new Error('useSceneCanvas must be used within SceneCanvasProvider');
  return ctx;
};
