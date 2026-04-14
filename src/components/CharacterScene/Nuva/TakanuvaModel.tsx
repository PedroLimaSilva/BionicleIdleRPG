import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { applyWeatheredMetalToObject } from '../WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

export const TakanuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/takanuva.glb');

  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: matoran.id,
    attackResolveAtFraction: 0.5,
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
        excludeMaterialNames: [
          'Holder.001',
          'SOLID-SILVER',
          'GlowingEyes',
          'Trans Dark Pink',
          'Gali Eyes',
        ],
      });
    }
  }, [nodes]);

  useArmor(nodes.ChestPlateHolder, 'Chest', matoran.colors.mask);
  useArmor(nodes.PlateHolderL, 'Shoulder', matoran.colors.mask);
  useArmor(nodes.PlateHolderR, 'Shoulder', matoran.colors.mask);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Takanuva} scale={1} position={[0, 0, -0.4]} />
    </group>
  );
});
