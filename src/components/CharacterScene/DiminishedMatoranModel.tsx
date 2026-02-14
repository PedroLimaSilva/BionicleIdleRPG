import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Color as ThreeColor, Group, Vector3 } from 'three';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';
import { setupAnimationForTestMode } from '../../utils/testMode';
import { MeshPhysicalMaterial } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';

const MAT_COLOR_MAP = {
  Face: 'face',
  'Foot.L': 'feet',
  'Foot.R': 'feet',
  'Arm.L': 'arms',
  'Arm.R': 'arms',
  Torso: 'body',
  Mask: 'mask',
  Brain: 'eyes',
  GlowingEyes: 'eyes',
  Akaku: 'mask',
  Hau: 'mask',
  Huna: 'mask',
  Kakama: 'mask',
  Kaukau: 'mask',
  Komau: 'mask',
  Mahiki: 'mask',
  Matatu: 'mask',
  Miru: 'mask',
  Pakari: 'mask',
  Rau: 'mask',
  Ruru: 'mask',
};

export function DiminishedMatoranModel({ matoran }: { matoran: BaseMatoran }) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(import.meta.env.BASE_URL + 'matoran_master.glb');
  const { actions, mixer } = useAnimations(animations, group);
  console.log(nodes);
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

  useAnimationController({
    mixer,
    idle: actions['Idle'],
    flavors: [actions['Tilt Head']].filter(Boolean),
  });

  useEffect(() => {
    const root = group.current;
    if (!root) return;

    const colorMap = matoran.colors;

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      const original = materials[materialName] as MeshPhysicalMaterial;
      if (!original) return;

      const color = colorMap[colorName as keyof BaseMatoran['colors']] as Color;
      original.color = new ThreeColor(color);

      const needsEmissive =
        materialName === 'GlowingEyes' &&
        original.emissive &&
        (original.emissiveIntensity ?? 0) > 0;
      const needsTransparent = original.transparent;

      if (needsEmissive || needsTransparent) {
        if (needsEmissive && original.emissive) {
          original.emissive = new ThreeColor(color);
          original.emissiveIntensity = original.emissiveIntensity ?? 0;
        }
      }
    });

    nodes.Masks?.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;
    });
  }, [nodes, materials, matoran]);

  return (
    <group ref={group} dispose={null}>
      <primitive scale={1} object={nodes.Body} position={new Vector3(0, 2.55, 0)} />
    </group>
  );
}
