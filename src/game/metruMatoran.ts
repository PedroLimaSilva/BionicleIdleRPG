import type { BaseMatoran } from '../types/Matoran';
import { MatoranTag } from '../types/Matoran';

/** Future Toa Metru — no Kanoka disk launcher on the rig. */
export const METRU_TOA_CANDIDATE_IDS = [
  'Matau',
  'Nokama',
  'Nuju',
  'Onewa',
  'Vakama',
  'Whenua',
] as const;

/** Matoran who carry a Great Disk (disk launcher + element disk visible). */
export const METRU_GREAT_DISK_IDS = [
  'Ahkmou',
  'Ehrye',
  'Nuhrii',
  'Orkahm',
  'Tehutti',
  'Vhisola',
] as const;

export type MetruToaCandidateId = (typeof METRU_TOA_CANDIDATE_IDS)[number];
export type MetruGreatDiskId = (typeof METRU_GREAT_DISK_IDS)[number];

/** Runtime rig node for the holster branch (sanitized from `Weapon Holster`). */
export const METRU_DISK_HOLSTER_NODE = 'Weapon_Holster';

export function hasMetruDiskLauncher(matoran: Pick<BaseMatoran, 'id' | 'tags'>): boolean {
  if (matoran.tags?.includes(MatoranTag.MetruGreatDisk)) return true;
  return (METRU_GREAT_DISK_IDS as readonly string[]).includes(matoran.id);
}

export function setMetruHolsterVisible(
  holsterRoot:
    | { visible: boolean; traverse: (cb: (o: { visible: boolean }) => void) => void }
    | undefined,
  visible: boolean
): void {
  if (!holsterRoot) return;
  holsterRoot.visible = visible;
  holsterRoot.traverse((child) => {
    child.visible = visible;
  });
}
