import { useEffect, useRef } from 'react';
import { BaseMatoran, Mask } from '../../types/Matoran';
import { Color as ThreeColor, Group, Mesh } from 'three';
import { MeshPhysicalMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { useSettings } from '../../context/useSettings';
import { Color } from '../../types/Colors';
import { applyWeatheredMetalToObject, isWeatheredMetalMaterial } from './WeatheredMetalMaterial';

/** Set to true to apply weathered metal (procedural grime) to meshes without normalMap. Masks exempt. */
const USE_WEATHERED_METAL = true;

const MAT_COLOR_MAP = {
  Arm: 'arms',
  Arms: 'arms',
  Brain: 'eyes',
  Face: 'face',
  Feet: 'feet',
  GlowingEyes: 'eyes',
  Hands: 'feet',
  Torso: 'body',
};

export function RebuiltMatoranModel({
  matoran,
}: {
  matoran: BaseMatoran & { maskOverride?: Mask };
}) {
  const group = useRef<Group>(null);
  const { debugMode } = useSettings();
  const { animations, materials, nodes } = useGLTF(import.meta.env.BASE_URL + 'rebuilt.glb');
  const { actions, mixer } = useIdleAnimation(animations, group);

  useAnimationController({
    flavors: [actions['Tilt Head']].filter(Boolean),
    idle: actions['Idle'],
    mixer,
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

    if (USE_WEATHERED_METAL) {
      const materialColorMap: Record<string, string> = {};
      Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
        if (materialName !== 'Brain' && materialName !== 'GlowingEyes') {
          materialColorMap[materialName] = colorMap[
            colorName as keyof BaseMatoran['colors']
          ] as string;
        }
      });
      applyWeatheredMetalToObject(root, {
        cavityStrength: 1,
        edgeColor: '#ffffff',
        edgeCurvatureScale: 2,
        edgeStrength: 0.15,
        excludeMaterialNames: ['Brain', 'GlowingEyes'],
        fineScale: 18.0,
        grimeDarken: 0.4,
        grimeMetalnessReduce: 0.5,
        grimeRoughness: 0.2,
        largeScale: 3.5,
        materialColorMap,
        metalness: 0.05,
        roughness: 0.55,
      });
      if (debugMode) {
        let count = 0;
        root.traverse((c) => {
          if ((c as Mesh).isMesh && isWeatheredMetalMaterial((c as Mesh).material)) count++;
        });
        console.log('[RebuiltMatoranModel] Weathered metal applied to', count, 'meshes');
      }
    }
  }, [nodes, materials, matoran.id, matoran.colors, debugMode]);

  // Inject the active mask from the shared masks.glb
  const maskTarget = matoran.maskOverride || matoran.mask;
  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, maskTarget, matoran, glowColor);

  return (
    <group ref={group} dispose={null}>
      <primitive scale={1} object={nodes.Body} position={[0, 3.65, -1]} />
    </group>
  );
}
