import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { useMask } from '../../../hooks/useMask';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { applyWeatheredMetalToObject } from '../WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

export const LewaMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/lewa.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.4,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useEffect(() => {
    const root = group.current;
    if (!root || !nodes) return;
    if (USE_WEATHERED_METAL) {
      applyWeatheredMetalToObject(root, {
        roughness: 0.55,
        metalness: 0.05,
        grimeDarken: 0.4,
        grimeRoughness: 0.2,
        grimeMetalnessReduce: 0.5,
        largeScale: 3.5,
        fineScale: 18.0,
        cavityStrength: 1,
        edgeColor: '#ffffff',
        edgeStrength: 0.15,
        edgeCurvatureScale: 2,
        excludeMaterialNames: ['Brain', 'GlowingEyes'],
      });
    }
  }, [nodes]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Lewa} scale={1} position={[0, 9.6, 0]} />
    </group>
  );
});
