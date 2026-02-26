import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Color as ThreeColor, Group, Vector3 } from 'three';
import { MeshPhysicalMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { Color } from '../../types/Colors';

const MAT_COLOR_MAP = {
  Face: 'face',
  'Foot.L': 'feet',
  'Foot.R': 'feet',
  'Arm.L': 'arms',
  'Arm.R': 'arms',
  Torso: 'body',
  Brain: 'eyes',
  GlowingEyes: 'eyes',
};

export function RebuiltMatoranModel({ matoran }: { matoran: BaseMatoran }) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(import.meta.env.BASE_URL + 'matoran_rebuilt.glb');
  const { actions, mixer } = useIdleAnimation(animations, group);

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

      if (needsEmissive) {
        if (needsEmissive && original.emissive) {
          original.emissive = new ThreeColor(color);
          original.emissiveIntensity = original.emissiveIntensity ?? 0;
        }
      }
    });
  }, [nodes, materials, matoran]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive scale={1} object={nodes.Body} position={new Vector3(0, 2.55, 0)} />
    </group>
  );
}
