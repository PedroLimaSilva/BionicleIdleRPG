import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { prepareArenaGlbScene } from './arenaGlbUtils';

interface ArenaGlbSceneProps {
  glbUrl: string;
  receiveShadow: boolean;
}

export function ArenaGlbScene({ glbUrl, receiveShadow }: ArenaGlbSceneProps) {
  const { scene } = useGLTF(glbUrl);
  const arena = useMemo(
    () => prepareArenaGlbScene(scene, { receiveShadow }),
    [receiveShadow, scene]
  );

  return <primitive object={arena} />;
}
