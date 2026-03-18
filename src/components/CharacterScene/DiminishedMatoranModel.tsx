import { useEffect, useRef } from 'react';
import { BaseMatoran } from '../../types/Matoran';
import { Color as ThreeColor, Group, Vector3 } from 'three';
import { MeshPhysicalMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../../hooks/useAnimationController';
import { useIdleAnimation } from '../../hooks/useIdleAnimation';
import { useMask } from '../../hooks/useMask';
import { Color } from '../../types/Colors';
import { applyLegoPBRToObject } from './LegoPBRShaderMaterial';

/** Set to true to use object-space Lego PBR shader instead of baked materials. */
const USE_LEGO_PBR = false;

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
        objectScale: 8,
        dentsBumpStrength: 0.12,
        dentsRoughnessStrength: 0.15,
        corrosionStrength: 0.4,
        fingerprintStrength: 0.08,
        // Pass tileable textures when available, e.g.:
        // dentsTexture: useTexture(BASE_URL + 'textures/dents.png'),
        // corrosionTexture: useTexture(BASE_URL + 'textures/corrosion.png'),
        // fingerprintTexture: useTexture(BASE_URL + 'textures/fingerprints.png'),
      });
    }
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
