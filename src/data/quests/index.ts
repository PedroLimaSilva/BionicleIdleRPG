import { Quest } from '../../types/Quests';
import { generateMermaidFlowchart } from './mermaid';
import { MNOG_QUEST_LINE } from './mnog';

export const QUESTS: Quest[] = [...MNOG_QUEST_LINE];

console.log(generateMermaidFlowchart(QUESTS));
