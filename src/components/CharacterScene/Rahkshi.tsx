import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Color as ThreeColor, Group, MathUtils, Mesh, MeshStandardMaterial } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Color } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { getRahkshiArmorColors, RahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { KraataPower } from '../../types/Kraata';

const BLACK = new ThreeColor('#000000');
const GLOW_LERP_SPEED = 5;

interface GlowEntry {
  material: MeshStandardMaterial;
  onColor: ThreeColor;
  onEmissive: ThreeColor;
  onEmissiveIntensity: number;
}

/** Cache key: materialName + color. Shared across all Bohrok instances with same scheme. */
const rahkshiMaterialCache = new Map<string, MeshStandardMaterial>();

function getRahkshiMaterial(
  original: MeshStandardMaterial,
  colorScheme: RahkshiArmorColors
): MeshStandardMaterial {
  const name = original.name;
  let color: string;
  let cacheKey: string;

  if (name === 'Primary' || name === 'Back_baked' || name === 'Face_baked') {
    color = colorScheme.armor;
    cacheKey = `${name}_${color}`;
  } else if (name === 'Secondary') {
    color = colorScheme.joint;
    cacheKey = `${name}_${color}`;
  } else {
    // Unknown material: leave as-is, came from GLTF as needed
    return original;
  }

  let mat = rahkshiMaterialCache.get(cacheKey);
  if (!mat) {
    mat = original.clone();
    mat.color.set(color as Color);
    rahkshiMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

export const RahkshiModel = forwardRef<
  CombatantModelHandle,
  { kraata: KraataPower; hasKraata?: boolean }
>(({ kraata, hasKraata = true }, ref) => {
  const group = useRef<Group>(null);
  const glowEntries = useRef<GlowEntry[]>([]);
  const glowTarget = useRef(hasKraata);

  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'rahkshi.glb');

  const bodyInstance = useMemo(() => nodes.Rahkshi.clone(true), [nodes]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: kraata,
    actionTimeScale: 1,
    transitionMode: 'stopAll',
    attackResolveAtFraction: 0.1,
    idleActionName: hasKraata ? 'Idle' : 'Empty',
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  glowTarget.current = hasKraata;

  useEffect(() => {
    const dex = getRahkshiArmorColors(kraata);
    const entries: GlowEntry[] = [];

    const hiddenMeshes: string[] = [];
    hiddenMeshes.push(
      ...[
        'GuurahkL',
        'GuurahkR',
        'GuurahkS',
        'TurahkL',
        'TurahkR',
        'TurahkS',
        'KurahkL',
        'KurahkR',
        'KurahkS',
        'LerahkL',
        'LerahkR',
        'LerahkS',
        'PanrahkL',
        'PanrahkR',
        'PanrahkS',
        'VorahkL',
        'VorahkR',
        'VorahkS',
      ].filter((e) => !e.includes(dex.staff))
    );

    bodyInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      if (hiddenMeshes.includes(child.name)) {
        child.visible = false;
        return;
      }

      const mat = child.material as MeshStandardMaterial;

      if (mat.name === 'Glow') {
        const clone = mat.clone();
        if (!glowTarget.current) {
          clone.color.set('#000000');
          clone.emissive.set('#000000');
          clone.emissiveIntensity = 0;
        }
        child.material = clone;
        entries.push({
          material: clone,
          onColor: mat.color.clone(),
          onEmissive: mat.emissive.clone(),
          onEmissiveIntensity: mat.emissiveIntensity,
        });
        return;
      }

      child.material = getRahkshiMaterial(mat, dex);
    });

    glowEntries.current = entries;
  }, [bodyInstance, kraata]);

  useFrame((_, delta) => {
    const entries = glowEntries.current;
    if (entries.length === 0) return;
    const active = glowTarget.current;
    const alpha = 1 - Math.exp(-GLOW_LERP_SPEED * delta);
    for (const { material, onColor, onEmissive, onEmissiveIntensity } of entries) {
      material.color.lerp(active ? onColor : BLACK, alpha);
      material.emissive.lerp(active ? onEmissive : BLACK, alpha);
      material.emissiveIntensity = MathUtils.lerp(
        material.emissiveIntensity,
        active ? onEmissiveIntensity : 0,
        alpha
      );
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={bodyInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
