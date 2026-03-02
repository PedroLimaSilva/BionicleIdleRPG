import type { VisualNovelCutscene } from '../../types/Cutscenes';
import { MNOG_CUTSCENES } from './mnog';
import { STORY_CUTSCENES } from './story';
import { MASK_HUNT_CUTSCENES } from './mask_hunt';
import { BOHROK_SWARM_CUTSCENES } from './bohrok_swarm';
import { BOHROK_KAL_CUTSCENES } from './bohrok_kal';
import { MASK_OF_LIGHT_CUTSCENES } from './mask_of_light';

export const VISUAL_NOVEL_CUTSCENES: Record<string, VisualNovelCutscene> = {
  ...MNOG_CUTSCENES,
  ...STORY_CUTSCENES,
  ...MASK_HUNT_CUTSCENES,
  ...BOHROK_SWARM_CUTSCENES,
  ...BOHROK_KAL_CUTSCENES,
  ...MASK_OF_LIGHT_CUTSCENES,
};
