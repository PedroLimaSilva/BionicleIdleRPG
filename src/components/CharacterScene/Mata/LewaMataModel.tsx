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
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + '/Toa_Mata/lewa.glb');
  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.4,
    modelId: matoran.id,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useEffect(() => {
    const root = group.current;
    if (!root || !nodes) return;
    if (USE_WEATHERED_METAL) {
      applyWeatheredMetalToObject(root, {
        cavityStrength: 1,
        edgeColor: '#ffffff',
        edgeCurvatureScale: 2,
        edgeStrength: 0.15,
        excludeMaterialNames: ['Lewa Eyes', 'Lewa Glow', 'Trans Neon Green'],
        fineScale: 18.0,
        grimeDarken: 0.4,
        grimeMetalnessReduce: 0.5,
        grimeRoughness: 0.2,
        largeScale: 3.5,
        metalness: 0.05,
        roughness: 0.55,
      });
    }
  }, [nodes]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Lewa} scale={1} position={[0, 0, -0.4]} />
    </group>
  );
});
