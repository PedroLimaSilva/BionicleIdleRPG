import { useCallback, useLayoutEffect, useRef } from 'react';
import { BaseMatoran, Mask } from '../../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../hooks/useAnimationController';
import { useIdleAnimation } from '../hooks/useIdleAnimation';
import { REBUILT_IDLE_SWITCH } from './idleSwitchConfigs';
import { useMask } from '../hooks/useMask';
import { setBakedDiscolorationEnabled } from '../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../hooks/packedPbrMaps';
import { applyRebuiltSheetMaterials } from '../kit/palettes/rebuiltSheetPalette';
import { REBUILT_SHEET_RIG_NODE } from './rebuiltSheetMeshes';
import { setRebuiltSheetVisibility } from './rebuiltLod';

const REBUILT_GLB = import.meta.env.BASE_URL + 'rebuilt.glb';

export function RebuiltMatoranModel({
  matoran,
  onKitMeshesAttached,
}: {
  matoran: BaseMatoran & {
    discolorationBakesActive?: boolean;
    maskOverride?: Mask;
    maskPowerActive?: boolean;
    packedMetalnessActive?: boolean;
    packedRoughnessActive?: boolean;
  };
  onKitMeshesAttached?: () => void;
}) {
  const group = useRef<Group>(null);
  const { animations, nodes, scene } = useGLTF(REBUILT_GLB);
  const { actions, idleActionName, mixer } = useIdleAnimation(animations, group, {
    idleSwitch: REBUILT_IDLE_SWITCH,
  });

  useAnimationController({
    flavors: [actions['Tilt Head']].filter(Boolean),
    idle: actions[idleActionName],
    mixer,
  });

  const root =
    (scene.getObjectByName(REBUILT_SHEET_RIG_NODE) as typeof nodes.Matoran | null) ?? nodes.Matoran;

  const bakesActive = matoran.discolorationBakesActive !== false;
  const roughnessActive = matoran.packedRoughnessActive !== false;
  const metalnessActive = matoran.packedMetalnessActive !== false;
  const bakesActiveRef = useRef(bakesActive);
  const roughnessActiveRef = useRef(roughnessActive);
  const metalnessActiveRef = useRef(metalnessActive);
  bakesActiveRef.current = bakesActive;
  roughnessActiveRef.current = roughnessActive;
  metalnessActiveRef.current = metalnessActive;

  const applyPreviewPackedToggles = useCallback((obj: Object3D) => {
    setBakedDiscolorationEnabled(obj, bakesActiveRef.current);
    setPackedRoughnessEnabled(obj, roughnessActiveRef.current);
    setPackedMetalnessEnabled(obj, metalnessActiveRef.current);
  }, []);

  useLayoutEffect(() => {
    if (!root) return;
    setRebuiltSheetVisibility(root);
    applyRebuiltSheetMaterials(root, matoran.colors);
    applyPreviewPackedToggles(root);
    onKitMeshesAttached?.();
  }, [applyPreviewPackedToggles, matoran.colors, onKitMeshesAttached, root]);

  useLayoutEffect(() => {
    if (!root) return;
    applyPreviewPackedToggles(root);
    return () => {
      setBakedDiscolorationEnabled(root, true);
      setPackedRoughnessEnabled(root, true);
      setPackedMetalnessEnabled(root, true);
    };
  }, [applyPreviewPackedToggles, bakesActive, metalnessActive, roughnessActive, root]);

  useMask(nodes.Masks, matoran, matoran.colors.eyes, matoran.maskPowerActive);

  return (
    <group ref={group} dispose={null}>
      {/* Z framing only — this export translates `Matoran` so the origin stays at the feet. */}
      <group position={[0, 0, -1.4]}>{root ? <primitive object={root} /> : null}</group>
    </group>
  );
}

useGLTF.preload(REBUILT_GLB);
