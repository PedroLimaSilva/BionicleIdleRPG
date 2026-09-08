import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Color as ThreeColor, Group, MathUtils, Mesh, MeshStandardMaterial, Object3D } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../hooks/useCombatAnimations';
import { useKitAttachments } from '../hooks/useKitAttachments';
import { getRahkshiArmorColors } from '../../../data/rahkshiArmorColors';
import { LegoColor } from '../../../types/Colors';
import { KraataPower } from '../../../types/Kraata';
import { applyWeatheredMetalToObject } from './WeatheredMetalMaterial';
import { cloneGltfInstance } from '../utils/cloneGltfInstance';
import { applySelectiveBloomMrt, isSelectiveBloomRahkshiGlowMaterial } from './selectiveBloom';
import { isRahkshiGlowMesh, mapRahkshiGlowMaterials } from './rahkshiGlow';
import { isRahkshiVariantMesh, shouldShowRahkshiVariantMesh } from './rahkshiVariantMeshes';
import {
  isRahkshiBattleBodyMesh,
  isRahkshiBattleLodMesh,
  isRahkshiBattleSpeciesMesh,
  RAHKSHI_DETAILED_RIG_NODE,
} from './rahkshiBattleMeshes';
import {
  applyRahkshiLodCameraLayers,
  collectRahkshiBattleMeshUuids,
  resetRahkshiLodCameraLayers,
  resolveRahkshiBattleAppearanceTarget,
  setRahkshiBattleSpeciesVisibility,
  tagDetailedLayer,
  tagRahkshiLodLayers,
} from './rahkshiLod';
import {
  logRahkshiLodEnableHint,
  logRahkshiLodMeshVisibilityChange,
  logRahkshiLodSnapshot,
} from './rahkshiLodDebug';
import { KIT_2001_GLB_PATH } from '../kit/kit2001';
import { KIT_2003_GLB_PATH } from '../kit/kit2003';
import {
  RAHKSHI_KIT_2001_ATTACHMENTS,
  RAHKSHI_KIT_2003_ATTACHMENTS,
} from '../kit/attachments/rahkshi';
import {
  RAHKSHI_WEATHERED,
  applyRahkshiBattleMaterialsToMesh,
  rahkshiBattleTintMap,
  rahkshiKitColors,
} from '../kit/palettes/rahkshiKitPalette';

const BLACK = new ThreeColor('#000000');
const GLOW_LERP_SPEED = 5;
/** Threshold for considering glow "complete" (0–1). Eyes light up first, then idle plays. */
const GLOW_COMPLETE_THRESHOLD = 0.98;
const RAHKSHI_GLB = import.meta.env.BASE_URL + 'rahkshi.glb';

export type RahkshiMeshVariant = 'detailed' | 'battle';

/** Must match how many `useKitAttachments` calls this component makes. */
const RAHKSHI_ATTACHMENT_RUNS = 2;

interface GlowEntry {
  material: MeshStandardMaterial;
  onColor: ThreeColor;
  onEmissive: ThreeColor;
  onEmissiveIntensity: number;
}

/** Deepest node wins for duplicate socket names. */
function buildKitCharacterNodes(root: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  root.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

function applyBattleMaterials(root: Object3D, meshUuids: Set<string>, kraata: KraataPower): void {
  const dex = getRahkshiArmorColors(kraata);
  root.traverse((child) => {
    if (!(child as Mesh).isMesh || !meshUuids.has(child.uuid)) return;

    if (isRahkshiBattleSpeciesMesh(child.name)) {
      applyRahkshiBattleMaterialsToMesh(child, { Battle_Metal: dex.armor });
      return;
    }

    if (isRahkshiBattleBodyMesh(child.name)) {
      applyRahkshiBattleMaterialsToMesh(child, rahkshiBattleTintMap(dex));
    }
  });
}

export const RahkshiModel = forwardRef<
  CombatantModelHandle,
  {
    kraata: KraataPower;
    hasKraata?: boolean;
    meshVariant?: RahkshiMeshVariant;
    onKitMeshesAttached?: () => void;
  }
>(({ hasKraata = true, kraata, meshVariant = 'detailed', onKitMeshesAttached }, ref) => {
  const isBattle = meshVariant === 'battle';
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

  const { animations, nodes, scene } = useGLTF(RAHKSHI_GLB);
  const camera = useThree((state) => state.camera);

  const detailedInstance = useMemo(() => {
    const root =
      (scene.getObjectByName(RAHKSHI_DETAILED_RIG_NODE) as Object3D | null) ??
      (nodes[RAHKSHI_DETAILED_RIG_NODE] as Object3D | undefined);
    if (!root) return new Group();
    const instance = cloneGltfInstance(root);
    tagRahkshiLodLayers(instance);
    return instance;
  }, [nodes, scene]);

  const battleAppearanceTarget = useMemo(
    () => resolveRahkshiBattleAppearanceTarget(detailedInstance),
    [detailedInstance]
  );

  const detailedMeshUuids = useMemo(() => {
    const uuids = new Set<string>();
    detailedInstance.traverse((child) => {
      if ((child as Mesh).isMesh && !isRahkshiBattleLodMesh(child.name)) {
        uuids.add(child.uuid);
      }
    });
    return uuids;
  }, [detailedInstance]);

  const battleMeshUuids = useMemo(
    () => battleAppearanceTarget?.meshUuids ?? collectRahkshiBattleMeshUuids(detailedInstance),
    [battleAppearanceTarget, detailedInstance]
  );

  const kitCharacterNodes = useMemo(
    () => buildKitCharacterNodes(detailedInstance),
    [detailedInstance]
  );
  const kitColors = useMemo(() => rahkshiKitColors(getRahkshiArmorColors(kraata)), [kraata]);

  const eyeGlowEntriesRef = useRef<GlowEntry[]>([]);
  const kitLayersDone = useRef(0);

  const dex = useMemo(() => getRahkshiArmorColors(kraata), [kraata]);

  const syncLodState = useCallback(
    (source = 'syncLodState') => {
      tagRahkshiLodLayers(detailedInstance, source);
      applyRahkshiLodCameraLayers(camera, meshVariant, source);
      setRahkshiBattleSpeciesVisibility(detailedInstance, meshVariant, dex.staff, source);
      if (meshVariant === 'battle' && battleAppearanceTarget) {
        applyBattleMaterials(battleAppearanceTarget.root, battleMeshUuids, kraata);
      }
      logRahkshiLodSnapshot(detailedInstance, meshVariant, source);
    },
    [
      battleAppearanceTarget,
      battleMeshUuids,
      camera,
      detailedInstance,
      dex.staff,
      kraata,
      meshVariant,
    ]
  );

  useEffect(() => {
    logRahkshiLodEnableHint();
  }, []);

  useLayoutEffect(() => {
    syncLodState('useLayoutEffect');
  }, [syncLodState]);

  useEffect(() => {
    syncLodState('useEffect');
    return () => resetRahkshiLodCameraLayers(camera);
  }, [camera, syncLodState]);

  useFrame(() => {
    applyRahkshiLodCameraLayers(camera, meshVariant, 'useFrame');
  });

  const collectHeadSocketGlow = useCallback(() => {
    if (isBattle) return;
    const stored = originalEyeValuesRef.current;
    const socket = kitCharacterNodes.Socket_Head;
    if (!stored || !socket) {
      glowEntries.current = eyeGlowEntriesRef.current;
      return;
    }
    const headEntries: GlowEntry[] = [];
    socket.traverse((child) => {
      // Face and Glow are authored under Socket_Head — only the kit clone should emit.
      if (!(child instanceof Mesh) || detailedMeshUuids.has(child.uuid)) return;
      if (child.name === 'Face' || child.name === 'Glow') return;
      const mat = child.material;
      if (!(mat instanceof MeshStandardMaterial)) return;
      if (isSelectiveBloomRahkshiGlowMaterial(mat.name)) return;
      mat.emissive.copy(stored.onEmissive);
      mat.emissiveIntensity = glowTarget.current ? stored.onEmissiveIntensity : 0;
      headEntries.push({
        material: mat,
        onColor: mat.color.clone(),
        onEmissive: stored.onEmissive,
        onEmissiveIntensity: stored.onEmissiveIntensity,
      });
    });
    glowEntries.current = [...eyeGlowEntriesRef.current, ...headEntries];
  }, [detailedMeshUuids, isBattle, kitCharacterNodes]);

  const registerGlowMaterial = useCallback(
    (mat: MeshStandardMaterial, entries: GlowEntry[]): MeshStandardMaterial => {
      const stored = originalEyeValuesRef.current;
      if (stored) {
        applySelectiveBloomMrt(mat);
        entries.push({
          material: mat,
          onColor: stored.onColor,
          onEmissive: stored.onEmissive,
          onEmissiveIntensity: stored.onEmissiveIntensity,
        });
        return mat;
      }

      const onColor = mat.color.clone();
      const onEmissive = mat.emissive.clone();
      const onEmissiveIntensity = mat.emissiveIntensity;
      originalEyeValuesRef.current = { onColor, onEmissive, onEmissiveIntensity };

      const clone = mat.clone();
      if (!glowTarget.current) {
        clone.color.set('#000000');
        clone.emissive.set('#000000');
        clone.emissiveIntensity = 0;
      }
      applySelectiveBloomMrt(clone);
      entries.push({
        material: clone,
        onColor,
        onEmissive,
        onEmissiveIntensity,
      });
      return clone;
    },
    []
  );

  const registerGlowMesh = useCallback(
    (child: Mesh, entries: GlowEntry[]): void => {
      mapRahkshiGlowMaterials(child, (mat) => registerGlowMaterial(mat, entries));
    },
    [registerGlowMaterial]
  );

  useEffect(() => {
    originalEyeValuesRef.current = null;
    kitLayersDone.current = 0;
  }, [kraata, meshVariant]);

  const onKitLayerAttached = useMemo(() => {
    return () => {
      kitLayersDone.current += 1;
      if (kitLayersDone.current < RAHKSHI_ATTACHMENT_RUNS) return;
      kitLayersDone.current = 0;
      detailedInstance.traverse((child) => {
        if ((child as Mesh).isMesh && !detailedMeshUuids.has(child.uuid)) {
          tagDetailedLayer(child);
        }
      });
      syncLodState('onKitLayerAttached');
      collectHeadSocketGlow();
      onKitMeshesAttached?.();
    };
  }, [
    collectHeadSocketGlow,
    detailedInstance,
    detailedMeshUuids,
    onKitMeshesAttached,
    syncLodState,
  ]);

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

  // Runs before kit attach (declaration order) so weathering never walks kit clones.
  useEffect(() => {
    if (isBattle) return;

    const dex = getRahkshiArmorColors(kraata);
    const entries: GlowEntry[] = [];

    detailedInstance.traverse((child) => {
      if (!(child instanceof Mesh) || !detailedMeshUuids.has(child.uuid)) return;
      const mesh = child as Mesh & { userData?: { originalMaterialName?: string } };

      if (isRahkshiVariantMesh(child.name)) {
        const nextVisible = shouldShowRahkshiVariantMesh(child.name, dex.staff);
        logRahkshiLodMeshVisibilityChange('detailedVariantMesh', child, nextVisible, {
          variant: 'detailed',
          staff: dex.staff,
        });
        child.visible = nextVisible;
        if (!child.visible) return;
      }

      const mat = child.material as MeshStandardMaterial;
      if (mat?.name && mat.name !== 'WeatheredMetal') {
        mesh.userData ??= {};
        mesh.userData.originalMaterialName = mat.name;
      }

      if (isRahkshiGlowMesh(child.name) || isSelectiveBloomRahkshiGlowMaterial(mat.name)) {
        registerGlowMesh(child, entries);
        return;
      }
    });

    glowEntries.current = entries;
    eyeGlowEntriesRef.current = entries;

    const materialColorMap: Record<string, string> = {
      Back_baked: dex.armor,
      Face_baked: dex.armor,
      KraataCradle_baked: LegoColor.DarkBluishGray,
      KraataCradleHolder_baked: LegoColor.DarkBluishGray,
      RahkshiShoulders_baked: LegoColor.DarkBluishGray,
    };

    detailedInstance.traverse((child) => {
      if (!(child instanceof Mesh) || !detailedMeshUuids.has(child.uuid)) return;
      applyWeatheredMetalToObject(child, {
        ...RAHKSHI_WEATHERED,
        excludeMaterialNames: ['Eyes', 'SOLID-SILVER', 'SOLID-SILVER.001'],
        materialColorMap,
        uniqueMaterials: true,
      });
    });

    syncLodState('detailedWeathering');
  }, [detailedInstance, detailedMeshUuids, isBattle, kraata, registerGlowMesh, syncLodState]);

  useEffect(() => {
    if (!isBattle || !battleAppearanceTarget) return;

    const entries: GlowEntry[] = [];

    battleAppearanceTarget.root.traverse((child) => {
      if (!(child instanceof Mesh) || !battleMeshUuids.has(child.uuid)) return;
      const mesh = child as Mesh & { userData?: { originalMaterialName?: string } };

      const mat = child.material as MeshStandardMaterial;
      if (mat?.name && mat.name !== 'WeatheredMetal') {
        mesh.userData ??= {};
        mesh.userData.originalMaterialName = mat.name;
      }

      if (isRahkshiGlowMesh(child.name) || isSelectiveBloomRahkshiGlowMaterial(mat.name)) {
        registerGlowMesh(child, entries);
      }
    });

    glowEntries.current = entries;
    eyeGlowEntriesRef.current = entries;
    syncLodState('battleGlowSetup');
    onKitMeshesAttached?.();
  }, [
    battleAppearanceTarget,
    battleMeshUuids,
    isBattle,
    kraata,
    onKitMeshesAttached,
    registerGlowMesh,
    syncLodState,
  ]);

  const kitAttachments = isBattle ? {} : RAHKSHI_KIT_2003_ATTACHMENTS;
  const kit2001Attachments = isBattle ? {} : RAHKSHI_KIT_2001_ATTACHMENTS;

  useKitAttachments({
    attachments: kitAttachments,
    characterNodes: kitCharacterNodes,
    colors: kitColors,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: isBattle ? undefined : onKitLayerAttached,
    weathered: RAHKSHI_WEATHERED,
  });

  useKitAttachments({
    attachments: kit2001Attachments,
    characterNodes: kitCharacterNodes,
    colors: kitColors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: isBattle ? undefined : onKitLayerAttached,
    weathered: RAHKSHI_WEATHERED,
  });

  useEffect(() => {
    return () => {
      // GLTF geometry is shared with useGLTF cache — never dispose it on clone teardown.
      detailedInstance.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const mat of materials) {
          if (mat instanceof MeshStandardMaterial && mat.name === 'WeatheredMetal') {
            mat.dispose();
          }
        }
      });
    };
  }, [detailedInstance]);

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
      <primitive object={detailedInstance} scale={1} position={[0, 0, 0]} />
    </group>
  );
});

RahkshiModel.displayName = 'RahkshiModel';

useGLTF.preload(RAHKSHI_GLB);
useKitAttachments.preload(KIT_2001_GLB_PATH, KIT_2003_GLB_PATH);
