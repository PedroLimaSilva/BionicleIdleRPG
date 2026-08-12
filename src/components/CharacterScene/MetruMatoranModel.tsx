import { useMemo, useRef } from 'react';
import { BaseMatoran, Mask } from '../../types/Matoran';
import { Group, Object3D } from 'three';
import { useGLTF } from '@react-three/drei';
import { useMask } from '../../hooks/useMask';
import { useKitAttachments } from '../../hooks/useKitAttachments';
import { useRigMaterials } from '../../hooks/useRigMaterials';
import { useMetruDisk } from '../../hooks/useMetruDisk';
import { KIT_2001_GLB_PATH } from '../../game/kit/kit2001';
import { KIT_2003_GLB_PATH } from '../../game/kit/kit2003';
import { KIT_2004_GLB_PATH } from '../../game/kit/kit2004';
import {
  METRU_KIT_2001_ATTACHMENTS,
  METRU_KIT_2003_ATTACHMENTS,
  METRU_KIT_2004_ATTACHMENTS,
  METRU_RIG_MATERIALS,
} from '../../game/kit/attachments/metru';
import { METRU_MASK_DISCOLORATION, METRU_WEATHERED } from '../../game/kit/palettes/metruKitPlayerPalette';

const METRU_MATORAN_GLB = import.meta.env.BASE_URL + 'matoran_metru.glb';

/** Kit attachment runs + rig materials + element disk before bloom refresh. */
const METRU_ATTACHMENT_RUNS = 5;

export function MetruMatoranModel({
  matoran,
  onKitMeshesAttached,
}: {
  matoran: BaseMatoran & { maskOverride?: Mask };
  onKitMeshesAttached?: () => void;
}) {
  const group = useRef<Group>(null);
  const { nodes } = useGLTF(METRU_MATORAN_GLB);

  const kitLayersDone = useRef(0);
  const onLayerAttached = useMemo(() => {
    if (!onKitMeshesAttached) return undefined;
    return () => {
      kitLayersDone.current += 1;
      if (kitLayersDone.current >= METRU_ATTACHMENT_RUNS) {
        kitLayersDone.current = 0;
        onKitMeshesAttached();
      }
    };
  }, [onKitMeshesAttached]);

  const characterNodes = useMemo(() => {
    const map: Record<string, Object3D | undefined> = {};
    (nodes.Matoran as Object3D | undefined)?.traverse((child) => {
      if (child.name) map[child.name] = child;
    });
    return map;
  }, [nodes]);

  const templateNodes = useMemo(
    () => nodes as Record<string, Object3D | undefined>,
    [nodes]
  );

  useKitAttachments({
    attachments: METRU_KIT_2004_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2004_GLB_PATH,
    onAttached: onLayerAttached,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: METRU_KIT_2001_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2001_GLB_PATH,
    onAttached: onLayerAttached,
    weathered: METRU_WEATHERED,
  });

  useKitAttachments({
    attachments: METRU_KIT_2003_ATTACHMENTS,
    characterNodes,
    colors: matoran.colors,
    kitUrl: KIT_2003_GLB_PATH,
    onAttached: onLayerAttached,
    weathered: METRU_WEATHERED,
  });

  useRigMaterials({
    characterNodes,
    colors: matoran.colors,
    onApplied: onLayerAttached,
    targets: METRU_RIG_MATERIALS,
    weathered: METRU_WEATHERED,
  });

  useMetruDisk({
    diskSocket: characterNodes.Disk,
    element: matoran.element,
    onAttached: onLayerAttached,
    templateNodes,
  });

  const glowColor = matoran.colors.eyes;
  useMask(nodes.Masks, matoran, glowColor, undefined, true, METRU_MASK_DISCOLORATION);

  return (
    <group ref={group} dispose={null}>
      <primitive object={nodes.Matoran} position={[0, 0, -1.4]} />
    </group>
  );
}

useGLTF.preload(METRU_MATORAN_GLB);
