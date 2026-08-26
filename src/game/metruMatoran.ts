import type { BaseMatoran } from '../types/Matoran';
import { MatoranStage, MatoranTag } from '../types/Matoran';

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

/** Metru → Toa Metru evolution targets (one dex id per candidate). */
export const METRU_TOA_EVOLUTION_MAP: Record<MetruToaCandidateId, string> = {
  Matau: 'Toa_Matau',
  Nokama: 'Toa_Nokama',
  Nuju: 'Toa_Nuju',
  Onewa: 'Toa_Onewa',
  Vakama: 'Toa_Vakama',
  Whenua: 'Toa_Whenua',
};

/**
 * Toa Metru without a dedicated GLB — rendered with Nuju's rig and their dex palette.
 * Matau, Nuju, and Lhikan have their own models.
 */
export const TOA_METRU_NUJU_RIG_IDS = ['Toa_Nokama', 'Toa_Onewa', 'Toa_Vakama'] as const;

export type ToaMetruNujuRigId = (typeof TOA_METRU_NUJU_RIG_IDS)[number];

export function usesNujuToaMetruRig(id: string): id is ToaMetruNujuRigId {
  return (TOA_METRU_NUJU_RIG_IDS as readonly string[]).includes(id);
}

/** Runtime rig node for the holster branch on the loaded rig. */
export const METRU_DISK_HOLSTER_NODE = 'Disk_LauncherWeapon_Holster';

export function hasMetruDiskLauncher(matoran: Pick<BaseMatoran, 'id' | 'tags' | 'stage'>): boolean {
  if (matoran.stage === MatoranStage.ToaMetru) return false;
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
