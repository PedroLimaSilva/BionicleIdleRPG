import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';
import { setupAnimationForTestMode } from '../../utils/testMode';
import { BoundingBox } from './BoundingBox';
import {
  createWornPlasticMaterial,
  getWornMaterial,
} from './WornPlasticMaterial';

const MAT_COLOR_MAP = {
  // Head: 'head',
  'Foot.L': 'feet',
  'Foot.R': 'feet',
  'Arm.L': 'arms',
  'Arm.R': 'arms',
  Torso: 'body',
  Mask: 'mask',
  Brain: 'eyes',
  GlowingEyes: 'eyes',
};

export function DiminishedMatoranModel({ matoran }: { matoran: BaseMatoran }) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(
    import.meta.env.BASE_URL + 'matoran_master.glb',
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions['IdleArms'];
    if (!idle) return;

    idle.reset().play();

    // In test mode, force animation to frame 0 and pause
    setupAnimationForTestMode(idle);

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  useAnimationController({
    mixer,
    idle: actions['IdleArms'],
    flavors: [actions['Tilt Head']].filter(Boolean),
  });

  useEffect(() => {
    const colorMap = matoran.colors;
    const applyColor = (materialName: string, color: Color) => {
      const original = materials[materialName] as MeshStandardMaterial;
      if (!original) return;

      const worn = getWornMaterial(materialName, color);

      worn.color.set(color);

      // preserve emissive behavior
      if ('emissive' in original && original.emissiveIntensity > 1) {
        worn.emissive.set(color);
        worn.emissiveIntensity = original.emissiveIntensity;
      }

      // preserve transparent behavior
      if (original.transparent && original.opacity < 1) {
        worn.transparent = true;
        worn.opacity = original.opacity;
      }

      // assign to all meshes using this material
      Object.values(nodes).forEach((node: unknown) => {
        if ((node as Mesh).isMesh && (node as Mesh).material === original) {
          (node as Mesh).material = worn;
        }
      });
    };

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      applyColor(
        materialName,
        colorMap[colorName as keyof BaseMatoran['colors']] as Color,
      );
    });

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;

      if (isTarget && matoran.isMaskTransparent && (mask as Mesh).isMesh) {
        const mesh = mask as Mesh;

        const worn = createWornPlasticMaterial({
          color: matoran.colors['mask'],
          roughness: 0.4,
          roughnessNoise: 0.1,
          fresnelStrength: 0.25,
        });

        worn.transparent = true;
        worn.opacity = 0.8;

        mesh.material = worn;
      }
    });
  }, [nodes, materials, matoran, actions]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <BoundingBox />
        <group name='Matoran'>
          <primitive
            scale={1}
            object={nodes.Body}
            position={new Vector3(0, 0, 0)}
          />
        </group>
      </group>
    </group>
  );
}
