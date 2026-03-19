import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useEffect, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useNuvaMask } from '../../../hooks/useNuvaMask';
import { useIdleAnimation } from '../../../hooks/useIdleAnimation';
import { applyWeatheredMetalToObject } from '../WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

export const LewaNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ matoran }, _ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/lewa.glb');
  useIdleAnimation(animations, group);

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

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes.PlateHolderL, 'Shoulder');
  useArmor(nodes.PlateHolderR, 'Shoulder');

  useNuvaMask(nodes.Masks, matoran, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Lewa} scale={1} position={[-1.4, 0, -1.4]} />
    </group>
  );
});
