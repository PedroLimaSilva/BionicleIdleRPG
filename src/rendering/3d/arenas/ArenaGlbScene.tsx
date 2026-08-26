import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { prepareArenaGlbScene } from './arenaGlbUtils';
import type { ArenaRecolor } from './types';

interface ArenaGlbSceneProps {
  glbUrl: string;
  receiveShadow: boolean;
  recolor?: ArenaRecolor;
}

export function ArenaGlbScene({ glbUrl, receiveShadow, recolor }: ArenaGlbSceneProps) {
  const { scene } = useGLTF(glbUrl);
  const arena = useMemo(
    () => prepareArenaGlbScene(scene, { receiveShadow, recolor }),
    [receiveShadow, recolor, scene]
  );

  return <primitive object={arena} />;
}
