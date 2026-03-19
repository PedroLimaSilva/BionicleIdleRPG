import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Color as ThreeColor, Group, Mesh, Vector3 } from 'three';
import { MeshPhysicalMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { useSettings } from '../../context/useSettings';
import { Color } from '../../types/Colors';
import { applyLegoPBRToObject, isLegoPBRMaterial } from './LegoPBRShaderMaterial';

/** Set to true to use Lego PBR material (MeshStandardMaterial + UV maps) instead of baked. */
const USE_LEGO_PBR = false;

/**
 * When you have diffuse, roughness, metalness, normal maps, load them and pass to applyLegoPBRToObject:
 *
 *   const base = import.meta.env.BASE_URL;
 *   const [diffuse, roughness, metalness, normal] = useTexture(
 *     [base + 'textures/diffuse.png', base + 'textures/roughness.png', ...]
 *   );
 *   applyLegoPBRToObject(root, { diffuseMap: diffuse, roughnessMap: roughness, ... });
 */

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
  const { debugMode } = useSettings();
  const { nodes, materials, animations } = useGLTF(import.meta.env.BASE_URL + 'matoran_master.glb');
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

    if (USE_LEGO_PBR) {
      applyLegoPBRToObject(root, {
        envMapIntensity: 0.4,
        noiseStrength: 0.2,
        noiseScale: 12,
        // Pass UV-based maps when available:
        // diffuseMap, roughnessMap, metalnessMap, normalMap
      });
      if (debugMode) {
        let count = 0;
        root.traverse((c) => {
          if ((c as Mesh).isMesh && isLegoPBRMaterial((c as Mesh).material)) count++;
        });
        console.log('[DiminishedMatoranModel] Lego PBR applied to', count, 'meshes');
      }
    }
  }, [nodes, materials, matoran, debugMode]);

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
