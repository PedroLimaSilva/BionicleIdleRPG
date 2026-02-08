import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial, Vector3 } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { Color } from '../../types/Colors';
import { setupAnimationForTestMode } from '../../utils/testMode';
import { getWornMaterial } from './WornPlasticMaterial';

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
    // Save current mesh materials before any mutations. When the effect
    // re-runs (e.g. matoran.colors changes), the cleanup function restores
    // these originals so the `=== original` check in applyColor still works.
    const savedMaterials = new Map<Mesh, MeshStandardMaterial>();
    Object.values(nodes).forEach((node: unknown) => {
      if ((node as Mesh).isMesh) {
        savedMaterials.set(
          node as Mesh,
          (node as Mesh).material as MeshStandardMaterial,
        );
      }
    });
    if (nodes.Masks) {
      (nodes.Masks as Group).children.forEach((child) => {
        if ((child as Mesh).isMesh && !savedMaterials.has(child as Mesh)) {
          savedMaterials.set(
            child as Mesh,
            (child as Mesh).material as MeshStandardMaterial,
          );
        }
      });
    }

    const colorMap = matoran.colors;
    const applyColor = (materialName: string, color: Color) => {
      const original = materials[materialName] as MeshStandardMaterial;
      if (!original) return;

      let worn = getWornMaterial(color);

      const needsEmissive =
        'emissive' in original && original.emissiveIntensity > 1;
      const needsTransparent = original.transparent;

      if (needsEmissive || needsTransparent) {
        worn = worn.clone();
        if (needsEmissive) {
          worn.emissive.set(color);
          worn.emissiveIntensity = original.emissiveIntensity;
        }
        if (needsTransparent) {
          worn.transparent = true;
          worn.opacity = original.opacity;
        }
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
        const worn = getWornMaterial(matoran.colors['mask']).clone();
        worn.transparent = true;
        worn.opacity = 0.8;
        mesh.material = worn;
      }
    });

    return () => {
      // Restore the original GLTF materials so the next effect run can
      // match meshes by their original material reference.
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
