import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Color as ThreeColor, Group, MathUtils, Mesh, MeshStandardMaterial, Color } from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { KraataPower } from '../../types/Kraata';
import { applyWeatheredMetalToObject, WeatheredMetalOptions } from './WeatheredMetalMaterial';

const BLACK = new ThreeColor('#000000');
const GLOW_LERP_SPEED = 5;
/** Threshold for considering glow "complete" (0–1). Eyes light up first, then idle plays. */
const GLOW_COMPLETE_THRESHOLD = 0.98;

interface GlowEntry {
  material: MeshStandardMaterial;
  onColor: ThreeColor;
  onEmissive: ThreeColor;
  onEmissiveIntensity: number;
}

const WEATHERED_METAL_OPTIONS: WeatheredMetalOptions = {
  cavityStrength: 1,
  debugGrimeAsColor: false,
  edgeColor: '#ffffff',
  edgeCurvatureScale: 2,
  edgeStrength: 0.15,
  fineScale: 18.0,
  grimeDarken: 0.4,
  grimeMetalnessReduce: 0.5,
  grimeRoughness: 0.2,
  largeScale: 3.5,
  metalness: 0.05,
  roughness: 0.55,
};

export const RahkshiModel = forwardRef<
  CombatantModelHandle,
  { kraata: KraataPower; hasKraata?: boolean }
>(({ hasKraata = true, kraata }, ref) => {
  const group = useRef<Group>(null);
  const glowEntries = useRef<GlowEntry[]>([]);
  const glowTarget = useRef(hasKraata);
  /** Original eye material values from the GLTF, captured once before any modifications. */
  const originalEyeValuesRef = useRef<{
    onColor: ThreeColor;
    onEmissive: ThreeColor;
    onEmissiveIntensity: number;
  } | null>(null);
  /** When hasKraata becomes true, stay on Empty until eyes finish lighting up, then switch to Idle. */
  const [glowCompleteForIdle, setGlowCompleteForIdle] = useState(hasKraata);
  const prevHasKraataRef = useRef(hasKraata);

  const { animations, nodes } = useGLTF(import.meta.env.BASE_URL + 'rahkshi.glb');

  const bodyInstance = useMemo(() => nodes.Rahkshi.clone(true), [nodes]);

  const effectiveIdleAction = hasKraata
    ? glowCompleteForIdle && prevHasKraataRef.current
      ? 'Idle'
      : 'Empty'
    : 'Empty';

  const { playAnimation } = useCombatAnimations(animations, group, {
    actionTimeScale: 1,
    attackResolveAtFraction: 0.1,
    idleActionName: effectiveIdleAction,
    modelId: kraata,
    transitionMode: 'stopAll',
  });

  const lerpCompleteRef = useRef(false);

  useEffect(() => {
    if (hasKraata && !prevHasKraataRef.current) {
      setGlowCompleteForIdle(false);
    }
    prevHasKraataRef.current = hasKraata;
    lerpCompleteRef.current = false;
  }, [hasKraata]);

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
      const mesh = child as Mesh & { userData?: { originalMaterialName?: string } };

      if (hiddenMeshes.includes(child.name)) {
        child.visible = false;
        return;
      }

      const mat = child.material as MeshStandardMaterial;
      if (mat?.name && mat.name !== 'WeatheredMetal') {
        mesh.userData ??= {};
        mesh.userData.originalMaterialName = mat.name;
      }

      if (mat.name === 'Eyes') {
        // Use stored original values if we've already replaced child.material (mat is our previous clone)
        let onColor: ThreeColor;
        let onEmissive: ThreeColor;
        let onEmissiveIntensity: number;
        const stored = originalEyeValuesRef.current;
        if (stored) {
          onColor = stored.onColor;
          onEmissive = stored.onEmissive;
          onEmissiveIntensity = stored.onEmissiveIntensity;
          // Reuse existing material; let useFrame lerp to target (no snap)
          entries.push({
            material: mat,
            onColor,
            onEmissive,
            onEmissiveIntensity,
          });
        } else {
          const clone = mat.clone();
          onColor = mat.color.clone();
          onEmissive = mat.emissive.clone();
          onEmissiveIntensity = mat.emissiveIntensity;
          originalEyeValuesRef.current = { onColor, onEmissive, onEmissiveIntensity };
          if (!glowTarget.current) {
            clone.color.set('#000000');
            clone.emissive.set('#000000');
            clone.emissiveIntensity = 0;
          }
          child.material = clone;
          entries.push({
            material: clone,
            onColor,
            onEmissive,
            onEmissiveIntensity,
          });
        }
        return;
      }

      // Non-eye body materials are handled in a two-step pipeline below:
      // 1) applyWeatheredMetalToObject
      // 2) color pass by original material name
    });

    const materialColorMap: Record<string, string> = {
      Back_baked: dex.armor,
      Face_baked: dex.armor,
      Primary: dex.armor,
      Secondary: dex.joint,
    };

    // Always apply weathering first.
    applyWeatheredMetalToObject(bodyInstance, {
      ...WEATHERED_METAL_OPTIONS,
      excludeMaterialNames: ['Eyes', 'Head', 'SOLID-SILVER', 'SOLID-SILVER.001'],
      includeNormalMappedMaterials: true,
      preserveExistingMaps: true,
    });

    // Then apply Rahkshi color scheme while preserving weathered material/shader.
    bodyInstance.traverse((child) => {
      if (!(child instanceof Mesh)) return;
      const mesh = child as Mesh & { userData?: { originalMaterialName?: string } };
      const current = mesh.material;
      if (!(current instanceof MeshStandardMaterial)) return;

      const sourceMaterialName = mesh.userData?.originalMaterialName;
      if (!sourceMaterialName) return;
      const color = materialColorMap[sourceMaterialName];
      if (!color) return;

      current.color = new Color(color);
    });

    glowEntries.current = entries;
  }, [bodyInstance, kraata, hasKraata]);

  useFrame((_, delta) => {
    const entries = glowEntries.current;
    if (entries.length === 0 || lerpCompleteRef.current) return;
    const active = glowTarget.current;

    const alpha = 1 - Math.exp(-GLOW_LERP_SPEED * delta);
    let allGlowComplete = active;
    for (const { material, onColor, onEmissive, onEmissiveIntensity } of entries) {
      material.color.lerp(active ? onColor : BLACK, alpha);
      material.emissive.lerp(active ? onEmissive : BLACK, alpha);
      material.emissiveIntensity = MathUtils.lerp(
        material.emissiveIntensity,
        active ? onEmissiveIntensity : 0,
        alpha
      );
      if (active && onEmissiveIntensity > 0) {
        const ratio = material.emissiveIntensity / onEmissiveIntensity;
        if (ratio < GLOW_COMPLETE_THRESHOLD) allGlowComplete = false;
      }
    }
    if (active && allGlowComplete) setGlowCompleteForIdle(true);
    if (allGlowComplete || (!active && entries.every((e) => e.material.emissiveIntensity < 0.01))) {
      lerpCompleteRef.current = true;
    }
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={bodyInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});
