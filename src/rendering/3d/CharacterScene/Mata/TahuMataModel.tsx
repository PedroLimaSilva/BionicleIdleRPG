import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, RecruitedCharacterData } from '../../../../types/Matoran';
import { CombatantModelHandle } from '../../../../pages/Battle/CombatantModel';
import { useCombatAnimations } from '../../hooks/useCombatAnimations';
import { useMask } from '../../hooks/useMask';
import { useKitAttachments } from '../../hooks/useKitAttachments';
import { KIT_2001_GLB_PATH } from '../../kit/kit2001';
import { TAHU_MATA_KIT_2001_ATTACHMENTS } from '../../kit/attachments/Toa Mata/tahu';
import { applyTahuBattleMaterials, TAHU_WEATHERED } from '../../kit/palettes/tahuBattlePalette';
import { cloneGltfInstance } from '../../utils/cloneGltfInstance';
import { setAuthoredNormalMapsEnabled } from '../../hooks/authoredNormalMaps';
import { setBakedDiscolorationEnabled } from '../../hooks/bakedDiscoloration';
import { TAHU_DETAILED_RIG_NODE, type TahuMeshVariant } from '../tahuBattleMeshes';
import { reparentTahuBattleBrain, setTahuLodVisibility } from '../tahuLod';

export type { TahuMeshVariant };

/** Character sheet, dex preview, and inventory screens. */
export const TAHU_PREVIEW_MESH_VARIANT: TahuMeshVariant = 'detailed';

/** Live combat (`CombatantModel`) — uses merged `Battle_*` meshes. */
export const TAHU_COMBAT_MESH_VARIANT: TahuMeshVariant = 'battle';

const TAHU_GLB = import.meta.env.BASE_URL + '/Toa_Mata/tahu.glb';

function buildKitCharacterNodes(root: Object3D): Record<string, Object3D> {
  const map: Record<string, Object3D> = {};
  root.traverse((child) => {
    if (child.name) map[child.name] = child;
  });
  return map;
}

function TahuDetailedKitLayer({
  characterNodes,
  colors,
  onAttached,
  stage,
}: {
  characterNodes: Record<string, Object3D>;
  colors: BaseMatoran['colors'];
  onAttached?: () => void;
  stage: BaseMatoran['stage'];
}) {
  useKitAttachments({
    attachments: TAHU_MATA_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached,
    stage,
    weathered: TAHU_WEATHERED,
  });
  return null;
}

export const TahuMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData &
      BaseMatoran & {
        discolorationBakesActive?: boolean;
        maskPowerActive?: boolean;
        normalMapsActive?: boolean;
      };
    meshVariant?: TahuMeshVariant;
    /** CharacterScene passes this to re-scan selective bloom after kit GLB attaches */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, meshVariant = TAHU_PREVIEW_MESH_VARIANT, onKitMeshesAttached }, ref) => {
  const isBattle = meshVariant === 'battle';
  const group = useRef<Group>(null);
  const { animations, nodes, scene } = useGLTF(TAHU_GLB);
  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.25,
    modelId: matoran.id,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const instance = useMemo(() => {
    const root =
      (scene.getObjectByName(TAHU_DETAILED_RIG_NODE) as Object3D | null) ??
      (nodes[TAHU_DETAILED_RIG_NODE] as Object3D | undefined);
    if (!root) return new Group();
    const cloned = cloneGltfInstance(root);
    reparentTahuBattleBrain(cloned);
    return cloned;
  }, [nodes, scene]);

  const kitCharacterNodes = useMemo(() => buildKitCharacterNodes(instance), [instance]);

  const bakesActive = matoran.discolorationBakesActive !== false;
  const bakesActiveRef = useRef(bakesActive);
  bakesActiveRef.current = bakesActive;
  const normalMapsActive = matoran.normalMapsActive !== false;
  const normalMapsActiveRef = useRef(normalMapsActive);
  normalMapsActiveRef.current = normalMapsActive;

  const applyPreviewMapToggles = useCallback((root: Object3D) => {
    setBakedDiscolorationEnabled(root, bakesActiveRef.current);
    setAuthoredNormalMapsEnabled(root, normalMapsActiveRef.current);
  }, []);

  const applyLodAndMaterials = useCallback(() => {
    setTahuLodVisibility(instance, meshVariant);
    if (meshVariant === 'battle') {
      applyTahuBattleMaterials(instance, matoran.colors);
    }
    // Apply after materials so stolen bake / normal maps still exist. Do not
    // put toggle flags in this callback — rebuilding weathered slots drops them.
    applyPreviewMapToggles(instance);
  }, [applyPreviewMapToggles, instance, matoran.colors, meshVariant]);

  useLayoutEffect(() => {
    applyLodAndMaterials();
  }, [applyLodAndMaterials]);

  useLayoutEffect(() => {
    applyPreviewMapToggles(instance);
    return () => {
      setBakedDiscolorationEnabled(instance, true);
      setAuthoredNormalMapsEnabled(instance, true);
    };
  }, [applyPreviewMapToggles, bakesActive, instance, normalMapsActive]);

  const onAttached = useMemo(
    () =>
      onKitMeshesAttached
        ? () => {
            applyLodAndMaterials();
            onKitMeshesAttached();
          }
        : undefined,
    [applyLodAndMaterials, onKitMeshesAttached]
  );

  useEffect(() => {
    if (!isBattle) return;
    onKitMeshesAttached?.();
  }, [isBattle, onKitMeshesAttached]);

  const glowColor = matoran.colors.eyes;
  useMask(kitCharacterNodes.Masks, matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      {!isBattle && (
        <TahuDetailedKitLayer
          characterNodes={kitCharacterNodes}
          colors={matoran.colors}
          onAttached={onAttached}
          stage={matoran.stage}
        />
      )}
      {/* Z framing only — this export translates `Tahu` so the origin stays at the feet. */}
      <group position={[0, 0, -0.4]}>
        <primitive object={instance} />
      </group>
    </group>
  );
});

TahuMataModel.displayName = 'TahuMataModel';

useGLTF.preload(TAHU_GLB);
