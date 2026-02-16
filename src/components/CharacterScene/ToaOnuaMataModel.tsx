import { useEffect, useRef } from 'react';
import { Group } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../../utils/testMode';
import { useMask } from '../../hooks/useMask';

export function ToaOnuaMataModel({ matoran }: { matoran: RecruitedCharacterData & BaseMatoran }) {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/onua.glb');

  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Set mixer timeScale based on test mode
    mixer.timeScale = getAnimationTimeScale();

    const idle = actions['Idle'];
    if (!idle) return;

    idle.reset().play();

    // In test mode, force animation to frame 0 and pause
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions, mixer]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const maskColor = matoran.maskColorOverride || matoran.colors.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, maskColor, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Onua} scale={1} position={[0, 9.6, 0]} />
    </group>
  );
}
