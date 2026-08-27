import { useEffect, useMemo, useRef } from 'react';
import { BaseMatoran, Mask } from '../../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useAnimationController } from '../hooks/useAnimationController';
import { useIdleAnimation } from '../hooks/useIdleAnimation';
import { useMask } from '../hooks/useMask';
import { useKitAttachments } from '../hooks/useKitAttachments';
import { useRigMaterials } from '../hooks/useRigMaterials';
import { useMetruDisk } from '../hooks/useMetruDisk';
import { KIT_2001_GLB_PATH } from '../kit/kit2001';
import { KIT_2003_GLB_PATH } from '../kit/kit2003';
import { KIT_2004_GLB_PATH } from '../kit/kit2004';
import {
  getMetruKit2003Attachments,
  getMetruKit2004Attachments,
  getMetruRigMaterials,
  METRU_KIT_2001_ATTACHMENTS,
} from '../kit/attachments/metru';
import { METRU_MASK_DISCOLORATION, METRU_WEATHERED } from '../kit/palettes/metruKitPlayerPalette';
import {
  hasMetruDiskLauncher,
  METRU_DISK_HOLSTER_NODE,
  setMetruHolsterVisible,
} from '../metruMatoran';

const METRU_MATORAN_GLB = import.meta.env.BASE_URL + 'matoran_metru.glb';

export function MetruMatoranModel({
  matoran,
  onKitMeshesAttached,
}: {
  matoran: BaseMatoran & { maskOverride?: Mask };
  onKitMeshesAttached?: () => void;
}) {
  const group = useRef<Group>(null);
  const { animations, nodes } = useGLTF(METRU_MATORAN_GLB);
  const { actions, mixer } = useIdleAnimation(animations, group);
  const hasDiskLauncher = hasMetruDiskLauncher(matoran);

  useAnimationController({
    flavors: [actions['Tilt Head']].filter(Boolean),
    idle: actions['Idle'],
    mixer,
  });

  const kitLayersDone = useRef(0);
  const attachmentRuns = hasDiskLauncher ? 5 : 4;

  useEffect(() => {
    kitLayersDone.current = 0;
  }, [matoran.id, hasDiskLauncher]);

  const onLayerAttached = useMemo(() => {
    if (!onKitMeshesAttached) return undefined;
    return () => {
      kitLayersDone.current += 1;
      if (kitLayersDone.current >= attachmentRuns) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [attachmentRuns, onKitMeshesAttached]);

  const characterNodes = useMemo(() => {
    const map: Record<string, Object3D | undefined> = {};
    (nodes.Matoran as Object3D | undefined)?.traverse((child) => {
      if (child.name) map[child.name] = child;
    });
    return map;
  }, [nodes]);

  const templateNodes = useMemo(() => nodes as Record<string, Object3D | undefined>, [nodes]);

  const kit2003Attachments = useMemo(
    () => getMetruKit2003Attachments(hasDiskLauncher),
    [hasDiskLauncher]
  );

  const kit2004Attachments = useMemo(
    () => getMetruKit2004Attachments(hasDiskLauncher),
    [hasDiskLauncher]
  );

  const rigMaterials = useMemo(() => getMetruRigMaterials(), []);

  useEffect(() => {
    setMetruHolsterVisible(characterNodes[METRU_DISK_HOLSTER_NODE], hasDiskLauncher);
  }, [characterNodes, hasDiskLauncher]);

  useKitAttachments({
    attachments: kit2004Attachments,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: METRU_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: kit2003Attachments,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onLayerAttached,
    stage: matoran.stage,
    weathered: METRU_WEATHERED,
  });

  useRigMaterials({
    characterNodes,
    colors: matoran.colors,
    onApplied: onLayerAttached,
    targets: rigMaterials,
    weathered: METRU_WEATHERED,
  });

  useMetruDisk({
    diskSocket: characterNodes.Disk,
    element: matoran.element,
    enabled: hasDiskLauncher,
    onAttached: onLayerAttached,
    templateNodes,
  });

  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, matoran, glowColor, undefined, true, METRU_MASK_DISCOLORATION);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Matoran} position={[0, 6.6, -1.4]} />
    </group>
  );
}

useGLTF.preload(METRU_MATORAN_GLB);
