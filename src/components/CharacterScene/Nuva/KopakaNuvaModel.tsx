import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Group } from 'three';
import { useArmor } from '../../../hooks/useArmor';
import { useNuvaMask } from '../../../hooks/useNuvaMask';
import { useCombatAnimations } from '../../../hooks/useCombatAnimations';
import { applyWeatheredMetalToObject } from '../WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

export const KopakaNuvaModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran & { maskPowerActive?: boolean };
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'Toa_Nuva/kopaka.glb');

  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.5,
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
        excludeMaterialNames: ['Brain', 'Glowing Eyes', 'SOLID-SILVER', 'Nuva Armour', 'Holder'],
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

  useArmor(nodes.ChestPlateHolder, 'Chest');
  useArmor(nodes.PlateHolderL, 'Shoulder');
  useArmor(nodes.PlateHolderR, 'Shoulder');

  useNuvaMask(nodes.Masks, matoran, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Kopaka} position={[0, 0, -0.4]} />
    </group>
  );
});
