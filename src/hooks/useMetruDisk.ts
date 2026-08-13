import { useEffect, useRef } from 'react';
import { Object3D } from 'three';
import { ElementTribe } from '../types/Matoran';
import { getMetruDiskTemplateNode, METRU_DISK_TEMPLATE_NODES } from '../game/metruDisk';

export type UseMetruDiskParams = {
  /** Holster socket on the rig (`Disk` under the disk launcher). */
  diskSocket: Object3D | undefined;
  /** Flat `nodes` map from `useGLTF` on `matoran_metru.glb`. */
  templateNodes: Record<string, Object3D | undefined>;
  element: ElementTribe;
  enabled?: boolean;
  onAttached?: () => void;
};

/**
 * Parents a cloned element disk (textured mesh from `matoran_metru.glb`) onto the
 * holster socket. Root-level disk templates stay out of the render tree.
 */
export function useMetruDisk({
  diskSocket,
  element,
  enabled = true,
  onAttached,
  templateNodes,
}: UseMetruDiskParams): void {
  const onAttachedRef = useRef(onAttached);
  onAttachedRef.current = onAttached;

  useEffect(() => {
    for (const nodeName of METRU_DISK_TEMPLATE_NODES) {
      const template = templateNodes[nodeName];
      if (template) template.visible = false;
    }

    if (!enabled || !diskSocket) return;

    const templateName = getMetruDiskTemplateNode(element);
    const template = templateName ? templateNodes[templateName] : undefined;
    if (!template) {
      return;
    }

    const clone = template.clone(true);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);
    clone.visible = true;
    diskSocket.add(clone);
    onAttachedRef.current?.();

    return () => {
      diskSocket.remove(clone);
    };
  }, [diskSocket, element, enabled, templateNodes]);
}
