import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

import { SceneHdriEnvironment } from '../../SceneHdriEnvironment';

export interface ArenaHdriProps {
  files: string;
  path: string;
  intensity: number;
}

/** HDRI image-based lighting without a visible skybox. */
function ClearSceneBackground() {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const previousBackground = scene.background;
    scene.background = null;
    return () => {
      scene.background = previousBackground;
    };
  }, [scene]);
  return null;
}

/** Shared HDRI setup for arena atmospheres. */
export function ArenaHdriIbl({ files, intensity, path }: ArenaHdriProps) {
  return (
    <>
      <SceneHdriEnvironment files={files} intensity={intensity} path={path} />
      <ClearSceneBackground />
    </>
  );
}
