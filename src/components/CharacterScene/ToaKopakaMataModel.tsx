import { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { Group, LoopOnce, Mesh, MeshStandardMaterial } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { Color, LegoColor } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { getAnimationTimeScale, setupAnimationForTestMode } from '../../utils/testMode';
import {
  applyWornPlasticToObject,
  getWornMaterial,
} from './WornPlasticMaterial';

export const ToaKopakaMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData & BaseMatoran;
  }
>(({ matoran }, ref) => {
  const group = useRef<Group>(null);
  const { nodes, animations } = useGLTF(
    import.meta.env.BASE_URL + 'toa_kopaka_mata.glb'
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    // Set mixer timeScale based on test mode
    mixer.timeScale = getAnimationTimeScale();
  }, [mixer]);

  useImperativeHandle(ref, () => ({
    playAnimation: (name) => {
      return new Promise<void>((resolve) => {
        const action = actions[name];
        if (!action) {
          console.warn(`Animation '${name}' not found for ${matoran.id}`);
          return resolve();
        }
        actions['Idle']?.fadeOut(0.2);
        action.reset();
        action.setLoop(LoopOnce, 1);
        action.clampWhenFinished = true;
        action.setEffectiveTimeScale(1.5);
        action.play();

        const onComplete = () => {
          mixer.removeEventListener('finished', onComplete);
          resolve();
          const idle = actions['Idle'];
          if (!idle) return;
          idle.reset().fadeIn(0.2).play();
        };

        mixer.addEventListener('finished', onComplete);
      });
    },
  }));

  useEffect(() => {
    const idle = actions['Idle'];
    if (!idle) return;
    idle.reset().play();

    // In test mode, force animation to frame 0 and pause
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    applyWornPlasticToObject(nodes.Body);
    applyWornPlasticToObject(nodes.Root);
  }, [nodes.Body, nodes.Root]);

  useEffect(() => {
    const maskColor = (matoran.maskColorOverride ||
      matoran.colors.mask) as Color;
    nodes.Masks.children.forEach((mask) => {
      const mesh = mask as Mesh;
      let mat = getWornMaterial(maskColor);
      const needsTransparent = mask.name === Mask.Kaukau;
      const needsMetalness =
        matoran.maskColorOverride === LegoColor.PearlGold;
      if (needsTransparent || needsMetalness) {
        mat = mat.clone();
        if (needsTransparent) {
          mat.transparent = true;
          mat.opacity = 0.8;
        }
        if (needsMetalness) mat.metalness = 0.5;
      }
      mesh.material = mat;
    });
  }, [nodes, matoran]);

  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;
    nodes.Masks.children.forEach((mask) => {
      mask.visible = mask.name === maskTarget;
    });
  }, [nodes, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Toa' position={[0, -6.9, -0.4]}>
          <primitive object={nodes.Body} />
          <primitive object={nodes.Root} />
          <primitive object={nodes.LegIKTargetL} />
          <primitive object={nodes.LegIKTargetR} />
        </group>
      </group>
    </group>
  );
});
