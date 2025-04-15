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

export function generateMermaidFlowchart(quests: Quest[]) {
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

  return `\`\`\`mermaid\ngraph TD\n${nodes.join('\n')}\n${edges.join('\n')}\n\`\`\``;
}
