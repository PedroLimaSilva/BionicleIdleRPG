import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';

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
    import.meta.env.BASE_URL + 'matoran_master.glb'
  );
  const { actions, mixer } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions['IdleArms'];
    if (!idle) return;

    idle.reset().play();

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
      const mat = materials[materialName] as MeshStandardMaterial;
      if (mat && 'color' in mat) {
        mat.color.set(color);
      }
      if (mat && 'emissive' in mat && mat.emissiveIntensity > 1) {
        mat.emissive.set(color);
      }
    };

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      applyColor(
        materialName,
        colorMap[colorName as keyof BaseMatoran['colors']] as Color
      );
    });

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;

      if (isTarget && matoran.isMaskTransparent && (mask as Mesh).isMesh) {
        const mesh = mask as Mesh;
        mesh.material = materials['Mask'].clone();
        const mat = mesh.material as MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
  }, [nodes, materials, matoran, actions]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Matoran'>
          <primitive
            scale={1}
            object={nodes.Body}
            position={new Vector3(0, -7, 0)}
          />
        </group>
      </group>
    </group>
  );
}
