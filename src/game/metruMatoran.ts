import type { BaseMatoran } from '../types/Matoran';
import { MatoranStage, MatoranTag } from '../types/Matoran';
import { MatoranJob } from '../types/Jobs';
import { JOB_DETAILS } from '../data/jobs';

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

/** Returns the canonical Metru-era profession job for a character, if any. */
export function getMetruProfession(matoranId: string): MatoranJob | undefined {
  for (const job of Object.values(MatoranJob)) {
    const details = JOB_DETAILS[job];
    if (
      details.allowedStages?.includes(MatoranStage.Metru) &&
      details.allowedCharacters?.includes(matoranId)
    ) {
      return job;
    }
  }
  return undefined;
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
