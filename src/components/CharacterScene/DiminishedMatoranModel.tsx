import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Color as ThreeColor, Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';
import { setupAnimationForTestMode } from '../../utils/testMode';
import { getStandardPlasticMaterial } from './StandardPlasticMaterial';

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
  const { nodes, materials, animations } = useGLTF(import.meta.env.BASE_URL + 'matoran_master.glb');
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
    const root = group.current;
    if (!root) return;

    const savedMaterials = new Map<Mesh, MeshStandardMaterial>();
    root.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        savedMaterials.set(mesh, mesh.material as MeshStandardMaterial);
      }
    });

    const colorMap = matoran.colors;
    const materialReplacements = new Map<MeshStandardMaterial, MeshStandardMaterial>();

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      const original = materials[materialName] as MeshStandardMaterial;
      if (!original) return;

      const color = colorMap[colorName as keyof BaseMatoran['colors']] as Color;
      let standard = getStandardPlasticMaterial(color);

      const needsEmissive =
        materialName === 'GlowingEyes' &&
        original.emissive &&
        (original.emissiveIntensity ?? 0) > 0;
      const needsTransparent = original.transparent;

      if (needsEmissive || needsTransparent) {
        standard = standard.clone();
        if (needsEmissive && original.emissive) {
          standard.emissive = new ThreeColor(color);
          standard.emissiveIntensity = original.emissiveIntensity ?? 0;
        }
        if (needsTransparent) {
          standard.transparent = true;
          standard.opacity = original.opacity ?? 1;
          standard.roughness = 0;
          standard.metalness = 0.85;
        }
      }

      materialReplacements.set(original, standard);
    });

    root.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const replacement = materialReplacements.get(mesh.material as MeshStandardMaterial);
        if (replacement) mesh.material = replacement;
      }
    });

    nodes.Masks?.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;

      if (isTarget && matoran.isMaskTransparent && (mask as Mesh).isMesh) {
        const mesh = mask as Mesh;
        const standard = getStandardPlasticMaterial(matoran.colors['mask']).clone();
        standard.transparent = true;
        standard.opacity = 0.8;
        mesh.material = standard;
      }
    });

    return () => {
      savedMaterials.forEach((material, mesh) => {
        mesh.material = material;
      });
    };
  }, [nodes, materials, matoran]);

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group name="Matoran">
          <primitive scale={1} object={nodes.Body} position={new Vector3(0, 2.5, 0)} />
        </group>
      </group>
    </group>
  );
}
