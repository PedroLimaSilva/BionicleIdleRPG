import { Quest } from '../../types/Quests';
import { MASK_HUNT } from './mask_hunt';
import { MNOG_QUEST_LINE } from './mnog';
import { BOHROK_SWARM_QUEST_LINE } from './bohrok_swarm';
import { BOHROK_KAL_QUEST_LINE } from './bohrok_kal';

export const QUESTS: Quest[] = [
  ...MASK_HUNT,
  ...MNOG_QUEST_LINE,
  ...BOHROK_SWARM_QUEST_LINE,
  ...BOHROK_KAL_QUEST_LINE,
];
