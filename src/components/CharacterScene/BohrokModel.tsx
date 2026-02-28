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

function getBohrokMaterial(
  original: MeshStandardMaterial,
  colorScheme: BaseMatoran['colors']
): MeshStandardMaterial {
  const name = original.name;
  let color: string;
  let cacheKey: string;

  if (name === 'Bohrok_Main') {
    color = colorScheme.body;
    cacheKey = `Bohrok_Main_${color}`;
  } else if (name === 'Bohrok_Secondary') {
    color = colorScheme.arms;
    cacheKey = `Bohrok_Secondary_${color}`;
  } else if (name === 'Bohrok_Eye' || name === 'Bohrok_Iris') {
    color = colorScheme.eyes;
    cacheKey = `${name}_${color}`;
  } else if (name === 'Krana') {
    color = colorScheme.eyes;
    cacheKey = `Krana_${color}`;
  } else if (name === 'Bohrok_Feet') {
    color = colorScheme.feet;
    cacheKey = `Feet_${color}`;
  } else if (name === 'Bohrok_Joints' || name === 'Bohrok Kal Shield') {
    color = colorScheme.face;
    cacheKey = `Joints_${color}`;
  } else {
    // Unknown material: leave as-is, came from GLTF as needed
    return original;
  }

  let mat = bohrokMaterialCache.get(cacheKey);
  if (!mat) {
    mat = original.clone();
    mat.color.set(color as Color);
    if (name === 'Bohrok_Eye' || name === 'Bohrok_Iris') {
      mat.emissive.set(color as Color);
    }
    bohrokMaterialCache.set(cacheKey, mat);
  }
  return mat;
}

export const BohrokModel = forwardRef<CombatantModelHandle, { id: string }>(({ id }, ref) => {
  const group = useRef<Group>(null);

  const { nodes, animations } = useGLTF(import.meta.env.BASE_URL + 'bohrok_master.glb');

  const bodyInstance = useMemo(() => nodes.Body.clone(true), [nodes]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    modelId: id,
    actionTimeScale: 2,
    transitionMode: 'stopAll',
    attackResolveAtFraction: 0.1,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  useEffect(() => {
    const colorScheme = CHARACTER_DEX[id].colors;
    const [name, kal] = id.split('_');
    const uppercaseName = name.replace(/^./, (char) => char.toUpperCase());
    const isKal = kal !== undefined;

    const hiddenMeshes: string[] = [];
    if (isKal) {
      hiddenMeshes.push('Part-41671p01_dot_dat003', 'Part-41671p01_dot_dat003_1');
      hiddenMeshes.push(
        ...[
          'TahnokSymbol',
          'NuhvokSymbol',
          'GahlokSymbol',
          'LehvakSymbol',
          'PahrakSymbol',
          'KohrakSymbol',
        ].filter((e) => !e.includes(uppercaseName))
      );
    } else {
      hiddenMeshes.push('FacePlateSilver');
    }

    bodyInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      if (hiddenMeshes.includes(child.name)) {
        child.visible = false;
        return;
      }

      const originalMaterial = child.material as MeshStandardMaterial;
      child.material = getBohrokMaterial(originalMaterial, colorScheme);
    });

    const shieldTarget = uppercaseName.concat(isKal ? 'Kal' : '');
    ['L', 'R'].forEach((suffix) => {
      bodyInstance.traverse((child) => {
        if (child.name === `Hand${suffix}`) {
          child.children.forEach((shield) => {
            const isTarget = shield.name === `${shieldTarget}${suffix}`;
            shield.visible = isTarget;
          });
        }
      });
    });
  }, [bodyInstance, id]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={bodyInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
useGLTF.preload(import.meta.env.BASE_URL + 'bohrok_master.glb');
