import { useCallback, useLayoutEffect, useRef } from 'react';
import { BaseMatoran, Mask } from '../../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../hooks/useAnimationController';
import { useIdleAnimation } from '../hooks/useIdleAnimation';
import { useMask } from '../hooks/useMask';
import { setBakedDiscolorationEnabled } from '../hooks/bakedDiscoloration';
import { setPackedMetalnessEnabled, setPackedRoughnessEnabled } from '../hooks/packedPbrMaps';
import { applyDiminishedSheetMaterials } from '../kit/palettes/diminishedSheetPalette';
import { alignDiminishedMaskSocket, DIMINISHED_SHEET_RIG_NODE } from './diminishedSheetMeshes';

const DIMINISHED_GLB = import.meta.env.BASE_URL + 'matoran_master.glb';

export function DiminishedMatoranModel({
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
  const { animations, nodes, scene } = useGLTF(DIMINISHED_GLB);
  const { actions, mixer } = useIdleAnimation(animations, group);

  useAnimationController({
    flavors: [actions['Tilt Head']].filter(Boolean),
    idle: actions['Idle'],
    mixer,
  });

  const root =
    (scene.getObjectByName(DIMINISHED_SHEET_RIG_NODE) as typeof nodes.Matoran | null) ??
    nodes.Matoran;

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
    applyDiminishedSheetMaterials(root, matoran.colors);
    applyPreviewPackedToggles(root);
    alignDiminishedMaskSocket(nodes.Masks);
    onKitMeshesAttached?.();
  }, [applyPreviewPackedToggles, matoran.colors, nodes.Masks, onKitMeshesAttached, root]);

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
      {/* Do not overwrite `Matoran.position` — this export lifts the armature so origin stays at the feet. */}
      {root ? <primitive object={root} /> : null}
    </group>
  );
}

useGLTF.preload(DIMINISHED_GLB);
