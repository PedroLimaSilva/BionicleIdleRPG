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
import { applyTahuBattleMaterials } from '../../kit/palettes/tahuBattlePalette';
import { cloneGltfInstance } from '../../utils/cloneGltfInstance';
import { setAuthoredNormalMapsEnabled } from '../../hooks/authoredNormalMaps';
import { setBakedDiscolorationEnabled } from '../../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../../hooks/packedPbrMaps';
import {
  TAHU_DETAILED_RIG_NODE,
  TAHU_PREVIEW_MESH_VARIANT,
  type TahuMeshVariant,
} from '../tahuBattleMeshes';
import { reparentTahuBattleBrain, setTahuLodVisibility } from '../tahuLod';

export type { TahuMeshVariant };

export { TAHU_COMBAT_MESH_VARIANT, TAHU_PREVIEW_MESH_VARIANT } from '../tahuBattleMeshes';

const TAHU_GLB = import.meta.env.BASE_URL + '/Toa_Mata/tahu.glb';

function maskSocket(root: Object3D): Object3D | undefined {
  return root.getObjectByName('Masks');
}

export const TahuMataModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: RecruitedCharacterData &
      BaseMatoran & {
        discolorationBakesActive?: boolean;
        maskPowerActive?: boolean;
        normalMapsActive?: boolean;
        packedMetalnessActive?: boolean;
        packedRoughnessActive?: boolean;
      };
    meshVariant?: TahuMeshVariant;
    /** CharacterScene passes this to re-scan selective bloom after materials bind. */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, meshVariant = TAHU_PREVIEW_MESH_VARIANT, onKitMeshesAttached }, ref) => {
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

  const bakesActive = matoran.discolorationBakesActive !== false;
  const bakesActiveRef = useRef(bakesActive);
  bakesActiveRef.current = bakesActive;
  const normalMapsActive = matoran.normalMapsActive !== false;
  const normalMapsActiveRef = useRef(normalMapsActive);
  normalMapsActiveRef.current = normalMapsActive;
  const roughnessActive = matoran.packedRoughnessActive !== false;
  const metalnessActive = matoran.packedMetalnessActive !== false;
  const roughnessActiveRef = useRef(roughnessActive);
  const metalnessActiveRef = useRef(metalnessActive);
  roughnessActiveRef.current = roughnessActive;
  metalnessActiveRef.current = metalnessActive;

  const applyPreviewMapToggles = useCallback((root: Object3D) => {
    setBakedDiscolorationEnabled(root, bakesActiveRef.current);
    setAuthoredNormalMapsEnabled(root, normalMapsActiveRef.current);
    setPackedRoughnessEnabled(root, roughnessActiveRef.current);
    setPackedMetalnessEnabled(root, metalnessActiveRef.current);
  }, []);

  const applyLodAndMaterials = useCallback(() => {
    setTahuLodVisibility(instance, meshVariant);
    applyTahuBattleMaterials(instance, matoran.colors);
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
      setPackedRoughnessEnabled(instance, true);
      setPackedMetalnessEnabled(instance, true);
    };
  }, [
    applyPreviewMapToggles,
    bakesActive,
    instance,
    metalnessActive,
    normalMapsActive,
    roughnessActive,
  ]);

  useEffect(() => {
    onKitMeshesAttached?.();
  }, [onKitMeshesAttached]);

  const glowColor = matoran.colors.eyes;
  useMask(maskSocket(instance), matoran, glowColor, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      {/* Z framing only — this export translates `Tahu` so the origin stays at the feet. */}
      <group position={[0, 0, -0.4]}>
        <primitive object={instance} />
      </group>
    </group>
  );
});

TahuMataModel.displayName = 'TahuMataModel';

useGLTF.preload(TAHU_GLB);
