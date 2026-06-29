import { Environment } from '@react-three/drei';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export interface ArenaHdriProps {
  files: string;
  path: string;
  intensity: number;
}

function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).environmentIntensity = value;
  }, [scene, value]);
  return null;
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
      <Environment files={files} path={path} />
      <EnvironmentIntensity value={intensity} />
      <ClearSceneBackground />
    </>
  );
}
