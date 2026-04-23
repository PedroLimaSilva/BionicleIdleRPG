import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { useMask } from '../../../hooks/useMask';
import { useKitAttachments } from '../../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../../game/kit/kit2001';
import { GALI_MATA_KIT_2001_ATTACHMENTS } from './galiMataKitAttach';
import { useBumpCharacterBloomRecollection } from '../selectiveBloom';

export const GaliMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const bumpBloomRecollection = useBumpCharacterBloomRecollection();
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/gali.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.6,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useKitAttachments({
    characterNodes: nodes as Record<string, Object3D | undefined>,
    kitUrl: KIT_2001_GLB_PATH,
    attachments: GALI_MATA_KIT_2001_ATTACHMENTS,
    colors: matoran.colors,
    onAttached: () => bumpBloomRecollection?.(),
  });

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Gali} position={[0, 0, -0.4]} />
    </group>
  );
});
