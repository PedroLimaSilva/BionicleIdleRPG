import { writeFileSync } from 'fs';
import { QUESTS } from '../src/data/quests/index';
import { generateMermaidFlowchart } from '../src/data/quests/mermaid';

const output = generateMermaidFlowchart(QUESTS);
writeFileSync('public/quest-graph.md', output);
console.log('✅ Mermaid quest graph updated!');
