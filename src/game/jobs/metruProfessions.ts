import { JOB_DETAILS } from '../../data/jobs';
import { MatoranJob } from '../../types/Jobs';
import { MatoranStage } from '../../types/Matoran';

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
