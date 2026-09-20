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
import { applyKopakaSheetMaterials } from '../../kit/palettes/kopakaSheetPalette';
import { cloneGltfInstance } from '../../utils/cloneGltfInstance';
import { setAuthoredNormalMapsEnabled } from '../../hooks/authoredNormalMaps';
import { setBakedDiscolorationEnabled } from '../../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../../hooks/packedPbrMaps';
import { KOPAKA_SHEET_RIG_NODE } from '../kopakaSheetMeshes';
import { setKopakaSheetVisibility } from '../kopakaLod';

const KOPAKA_GLB = import.meta.env.BASE_URL + '/Toa_Mata/kopaka.glb';

function maskSocket(root: Object3D): Object3D | undefined {
  return root.getObjectByName('Masks');
}

export const KopakaMataModel = forwardRef<
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
    /** CharacterScene passes this to re-scan selective bloom after materials bind. */
    onKitMeshesAttached?: () => void;
  }
>(({ matoran, onKitMeshesAttached }, ref) => {
  const group = useRef<Group>(null);
  const { animations, nodes, scene } = useGLTF(KOPAKA_GLB);
  const { playAnimation } = useCombatAnimations(animations, group, {
    attackResolveAtFraction: 0.25,
    modelId: matoran.id,
  });

  useImperativeHandle(ref, () => ({ playAnimation }));

  const instance = useMemo(() => {
    const root =
      (scene.getObjectByName(KOPAKA_SHEET_RIG_NODE) as Object3D | null) ??
      (nodes[KOPAKA_SHEET_RIG_NODE] as Object3D | undefined);
    if (!root) return new Group();
    return cloneGltfInstance(root);
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

  useLayoutEffect(() => {
    setKopakaSheetVisibility(instance);
    applyKopakaSheetMaterials(instance, matoran.colors);
    applyPreviewMapToggles(instance);
  }, [applyPreviewMapToggles, instance, matoran.colors]);

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
      {/* Z framing only — this export translates `Kopaka` so the origin stays at the feet. */}
      <group position={[0, 0, -0.4]}>
        <primitive object={instance} />
      </group>
    </group>
  );
});

KopakaMataModel.displayName = 'KopakaMataModel';

useGLTF.preload(KOPAKA_GLB);
