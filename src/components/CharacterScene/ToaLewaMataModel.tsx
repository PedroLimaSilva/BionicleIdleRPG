import { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { Group, Mesh } from 'three';
import { Color, LegoColor } from '../../types/Colors';
import {
  getAnimationTimeScale,
  setupAnimationForTestMode,
} from '../../utils/testMode';
import {
  applyWornPlasticToObject,
  getWornMaterial,
  type WornPlasticShaderMaterial,
} from './WornPlasticMaterial';

export function ToaLewaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(
    import.meta.env.BASE_URL + 'toa_lewa_mata.glb',
  );

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

  useEffect(() => {
    if (group.current) applyWornPlasticToObject(group.current);
  }, [nodes]);

  useEffect(() => {
    const maskColor = (matoran.maskColorOverride ||
      matoran.colors.mask) as Color;
    nodes.Masks.children.forEach((mask) => {
      const mesh = mask as Mesh;
      let mat = getWornMaterial(maskColor) as WornPlasticShaderMaterial;
      const needsTransparent = mask.name === Mask.Kaukau;
      const needsMetalness = matoran.maskColorOverride === LegoColor.PearlGold;
      if (needsTransparent || needsMetalness) {
        mat = mat.clone() as WornPlasticShaderMaterial;
        if (needsTransparent) {
          mat.transparent = true;
          mat.opacity = 0.8;
          mat.uniforms.uOpacity.value = 0.8;
        }
        if (needsMetalness) mat.uniforms.uMetalness.value = 0.5;
      }
      mesh.material = mat;
    });
  }, [nodes, matoran]);

  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === maskTarget;
      mask.visible = isTarget;
    });
  }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Toa' position={[0, 2.5, 0]}>
          <primitive object={nodes.Body} />
        </group>
      </group>
    </group>
  );
}
