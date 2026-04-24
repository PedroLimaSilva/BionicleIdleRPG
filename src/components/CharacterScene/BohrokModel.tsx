import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { Color, LegoColor } from '../../types/Colors';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { CHARACTER_DEX } from '../../data/dex/index';
import { BaseMatoran } from '../../types/Matoran';
import { applyWeatheredMetalToObject } from './WeatheredMetalMaterial';

const USE_WEATHERED_METAL = true;

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

  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'bohrok_master.glb');

  const bohrokInstance = useMemo(() => nodes.Bohrok.clone(true), [nodes]);

  const { playAnimation } = useCombatAnimations(animations, group, {
    actionTimeScale: 2,
    attackResolveAtFraction: 0.1,
    modelId: id,
    transitionMode: 'stopAll',
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

    bohrokInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      if (hiddenMeshes.includes(child.name)) {
        child.visible = false;
        return;
      }

      const originalMaterial = child.material as MeshStandardMaterial;
      child.material = getBohrokMaterial(originalMaterial, colorScheme);
    });

    if (USE_WEATHERED_METAL) {
      const materialColorMap: Record<string, string> = {
        Bohrok_Feet: colorScheme.feet,
        Bohrok_Joints: colorScheme.face,
        Bohrok_Main: colorScheme.body,
        Bohrok_Secondary: colorScheme.arms,
        'Bohrok Kal Shield': colorScheme.face,
        'Bohrok Teeth': LegoColor.White,
        Solid_Black: LegoColor.Black,
        Solid_Light_Grey: LegoColor.LightGray,
      };
      applyWeatheredMetalToObject(bohrokInstance, {
        cavityStrength: 1,
        edgeColor: '#ffffff',
        edgeCurvatureScale: 2,
        edgeStrength: 0.15,
        fineScale: 18,
        grimeDarken: 0.4,
        grimeMetalnessReduce: 0.5,
        grimeRoughness: 0.2,
        largeScale: 5,
        materialColorMap,
        metalness: 0.05,
        roughness: 0.55,
      });
    }

    const shieldTarget = uppercaseName.concat(isKal ? 'Kal' : '');
    ['L', 'R'].forEach((suffix) => {
      bohrokInstance.traverse((child) => {
        if (child.name === `Hand${suffix}`) {
          child.children.forEach((shield) => {
            const isTarget = shield.name === `${shieldTarget}${suffix}`;
            shield.visible = isTarget;
          });
        }
      });
    });
  }, [bohrokInstance, id]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={bohrokInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
useGLTF.preload(import.meta.env.BASE_URL + 'bohrok_master.glb');
