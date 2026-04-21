import { LegoColor } from '../../types/Colors';
import type { KitAttachmentSpec } from '../../types/KitParts';

export const KIT_2001_GLB_PATH = import.meta.env.BASE_URL + 'kit_2001.glb';

/** Gali Mata — sockets and kit node names match the Blender export */
export const GALI_MATA_KIT_2001_ATTACHMENTS: readonly KitAttachmentSpec[] = [
  {
    socketName: 'MataFoot.L',
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Metal: { kind: 'lego', value: LegoColor.LightGray },
    },
  },
  {
    socketName: 'MataChest',
    kitNodeName: 'MataChest',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  {
    socketName: 'MataAbdomen',
    kitNodeName: 'MataAbdomen',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  {
    socketName: 'MataHip',
    kitNodeName: 'MataHip',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  { socketName: 'GearM.L', kitNodeName: 'GearM' },
  { socketName: 'GearM.M', kitNodeName: 'GearM' },
  { socketName: 'GearM.R', kitNodeName: 'GearM' },
  {
    socketName: 'Socket',
    kitNodeName: 'Socket',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
];
