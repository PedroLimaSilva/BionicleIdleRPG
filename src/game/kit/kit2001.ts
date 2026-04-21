import { LegoColor } from '../../types/Colors';
import type { KitSocketAttachment } from '../../types/KitParts';

export const KIT_2001_GLB_PATH = import.meta.env.BASE_URL + 'kit_2001.glb';

/** Gali Mata — keys are socket names on the rig; values describe the kit asset */
export const GALI_MATA_KIT_2001_ATTACHMENTS: Record<string, KitSocketAttachment> = {
  'MataFoot.L': {
    kitNodeName: 'MataFoot',
    materialColors: {
      Main: { kind: 'lego', value: LegoColor.Blue },
      Metal: { kind: 'lego', value: LegoColor.LightGray },
    },
  },
  MataChest: {
    kitNodeName: 'MataChest',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  MataAbdomen: {
    kitNodeName: 'MataAbdomen',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  MataHip: {
    kitNodeName: 'MataHip',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
  'GearM.L': { kitNodeName: 'GearM' },
  'GearM.M': { kitNodeName: 'GearM' },
  'GearM.R': { kitNodeName: 'GearM' },
  Socket: {
    kitNodeName: 'Socket',
    materialColors: { Main: { kind: 'lego', value: LegoColor.Blue } },
  },
};
