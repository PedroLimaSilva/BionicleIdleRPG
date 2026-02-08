import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';
import { setupAnimationForTestMode } from '../../utils/testMode';
import { getWornMaterial, type WornPlasticShaderMaterial } from './WornPlasticMaterial';

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
    const materialReplacements = new Map<
      MeshStandardMaterial,
      WornPlasticShaderMaterial
    >();

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      const original = materials[materialName] as MeshStandardMaterial;
      if (!original) return;

      const color = colorMap[colorName as keyof BaseMatoran['colors']] as Color;
      let worn = getWornMaterial(color) as WornPlasticShaderMaterial;

      const needsEmissive =
        'emissive' in original && (original.emissiveIntensity ?? 0) > 0;
      const needsTransparent = original.transparent;

      if (needsEmissive || needsTransparent) {
        worn = worn.clone() as WornPlasticShaderMaterial;
        if (needsEmissive && worn.uniforms?.uEmissive) {
          worn.uniforms.uEmissive.value.copy(original.emissive);
          worn.uniforms.uEmissiveIntensity.value =
            original.emissiveIntensity ?? 0;
        }
        if (needsTransparent) {
          worn.transparent = true;
          worn.opacity = original.opacity ?? 1;
          if (worn.uniforms?.uOpacity)
            worn.uniforms.uOpacity.value = original.opacity ?? 1;
        }
      }

      materialReplacements.set(original, worn);
    });

    root.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        const replacement = materialReplacements.get(
          mesh.material as MeshStandardMaterial,
        );
        if (replacement) mesh.material = replacement;
      }
    });

    nodes.Masks?.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;

      if (isTarget && matoran.isMaskTransparent && (mask as Mesh).isMesh) {
        const mesh = mask as Mesh;
        const worn = getWornMaterial(
          matoran.colors['mask'],
        ).clone() as WornPlasticShaderMaterial;
        worn.transparent = true;
        worn.opacity = 0.8;
        if (worn.uniforms?.uOpacity) worn.uniforms.uOpacity.value = 0.8;
        mesh.material = worn;
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
      <group name='Scene'>
        <group name='Matoran'>
          <primitive
            scale={1}
            object={nodes.Body}
            position={new Vector3(0, 2.5, 0)}
          />
        </group>
      </group>
    </group>
  );
}
