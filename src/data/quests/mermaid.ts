import { Quest } from '../../types/Quests';

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h ? `${h}h` : '', m ? `${m}m` : '', s && !h && !m ? `${s}s` : '']
    .filter(Boolean)
    .join(' ');
}

function formatRewards(rewards: Quest['rewards']) {
  if (!rewards) return '';
  const parts: string[] = [];
  if (rewards.unlockCharacters) {
    parts.push(
      `Unlock: ${rewards.unlockCharacters.map((c) => c.id).join(', ')}`
    );
  }
  if (rewards.loot) {
    parts.push(
      `Loot: ${Object.entries(rewards.loot)
        .map(([k, v]) => `${k}=${v}`)
        .join(', ')}`
    );
  }
  if (rewards.currency) parts.push(`Currency: ${rewards.currency}`);
  if (rewards.xpPerMatoran) parts.push(`XP: ${rewards.xpPerMatoran}`);
  return parts.length ? `\n${parts.join('\n')}` : '';
}

function sanitize(text: string) {
  return text.replace(/"/g, "'").replace(/[{}]/g, '').replace(/\|/g, '/');
}

export interface QuestStates {
  completed: string[];
  active: string[];
  available: string[];
  locked: string[];
}

export function generateMermaidFlowchart(
  quests: Quest[],
  questStates?: QuestStates
) {
  // Determine quest states if not provided
  const states: QuestStates = questStates || {
    completed: [],
    active: [],
    available: [],
    locked: [],
  };

  // Define node styles using classDef
  const classDefs = [
    'classDef completed fill:#22c55e,stroke:#16a34a,stroke-width:3px,color:#fff',
    'classDef active fill:#eab308,stroke:#ca8a04,stroke-width:3px,color:#000',
    'classDef available fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff',
    'classDef locked fill:#6b7280,stroke:#4b5563,stroke-width:2px,color:#d1d5db,opacity:0.6',
  ];

  const nodes = quests.map((q) => {
    const duration = formatDuration(q.durationSeconds || 0);
    const rewards = formatRewards(q.rewards);
    const label = sanitize(`${q.name}\n(${duration})${rewards}`);
    return `  ${q.id}["${label}"]`;
  });

  const edges: string[] = [];
  quests.forEach((q) => {
    if (q.unlockedAfter && q.unlockedAfter.length > 0) {
      q.unlockedAfter.forEach((sourceId) => {
        edges.push(`  ${sourceId} --> ${q.id}`);
      });
    }
  });

  // Apply classes to nodes based on their state
  const classAssignments: string[] = [];
  quests.forEach((q) => {
    if (states.completed.includes(q.id)) {
      classAssignments.push(`  class ${q.id} completed`);
    } else if (states.active.includes(q.id)) {
      classAssignments.push(`  class ${q.id} active`);
    } else if (states.available.includes(q.id)) {
      classAssignments.push(`  class ${q.id} available`);
    } else if (states.locked.includes(q.id)) {
      classAssignments.push(`  class ${q.id} locked`);
    }
  });

  return `\`\`\`mermaid\ngraph TD\n${nodes.join('\n')}\n${edges.join('\n')}\n${classDefs.join('\n')}\n${classAssignments.join('\n')}\n\`\`\``;
}
