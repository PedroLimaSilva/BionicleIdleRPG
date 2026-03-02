import { Quest } from '../../types/Quests';
import { MASK_HUNT } from './mask_hunt';
import { MNOG_QUEST_LINE } from './mnog';
import { BOHROK_SWARM_QUEST_LINE } from './bohrok_swarm';
import { BOHROK_KAL_QUEST_LINE } from './bohrok_kal';
import { MASK_OF_LIGHT_QUEST_LINE } from './mask_of_light';

export const QUESTS: Quest[] = [
  ...MASK_HUNT,
  ...MNOG_QUEST_LINE,
  ...BOHROK_SWARM_QUEST_LINE,
  ...BOHROK_KAL_QUEST_LINE,
  ...MASK_OF_LIGHT_QUEST_LINE,
];
