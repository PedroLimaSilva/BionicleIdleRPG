import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { Color } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { CHARACTER_DEX } from '../../data/dex/index';
import { BaseMatoran } from '../../types/Matoran';

/** Cache key: materialName + color. Shared across all Bohrok instances with same scheme. */
const bohrokMaterialCache = new Map<string, MeshStandardMaterial>();

function getRahkshiMaterial(
  original: MeshStandardMaterial,
  colorScheme: BaseMatoran['colors']
): MeshStandardMaterial {
  const name = original.name;
  let color: string;
  let cacheKey: string;

  if (name === 'Element' || name === 'Back_baked' || name === 'Face_baked') {
    color = colorScheme.body;
    cacheKey = `${name}_${color}`;
  } else {
    // Unknown material: leave as-is, came from GLTF as needed
    return original;
  }

  let mat = bohrokMaterialCache.get(cacheKey);
  if (!mat) {
    mat = original.clone();
    mat.color.set(color as Color);
    bohrokMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

export const RahkshiModel = forwardRef<CombatantModelHandle, { id: string }>(({ id }, ref) => {
  const group = useRef<Group>(null);

  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'rahkshi.glb');

  const bodyInstance = useMemo(() => nodes.Rahkshi.clone(true), [nodes]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: id,
    actionTimeScale: 1,
    transitionMode: 'stopAll',
    attackResolveAtFraction: 0.1,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useEffect(() => {
    const dex = CHARACTER_DEX[id as keyof typeof CHARACTER_DEX];
    const colorScheme = dex.colors;

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
      ].filter((e) => !e.includes(dex.name))
    );

    bodyInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      if (hiddenMeshes.includes(child.name)) {
        child.visible = false;
        return;
      }

      const originalMaterial = child.material as MeshStandardMaterial;
      child.material = getRahkshiMaterial(originalMaterial, colorScheme);
    });
  }, [bodyInstance, id]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={bodyInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
