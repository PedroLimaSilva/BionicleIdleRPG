import { ElementTribe } from '../types/Matoran';

/** Template nodes in `matoran_metru.glb` (scene root) for each Metru element disk. */
export const METRU_DISK_TEMPLATE_BY_ELEMENT: Partial<Record<ElementTribe, string>> = {
  [ElementTribe.Air]: 'DiskLeMetru',
  [ElementTribe.Earth]: 'DiskOnuMetru',
  [ElementTribe.Fire]: 'DiskTaMetru',
  [ElementTribe.Ice]: 'DiskKoMetru',
  [ElementTribe.Stone]: 'DiskPoMetru',
  [ElementTribe.Water]: 'DiskGaMetru',
};

export const METRU_DISK_TEMPLATE_NODES = Object.values(METRU_DISK_TEMPLATE_BY_ELEMENT);

export function getMetruDiskTemplateNode(element: ElementTribe): string | undefined {
  return METRU_DISK_TEMPLATE_BY_ELEMENT[element];
}
