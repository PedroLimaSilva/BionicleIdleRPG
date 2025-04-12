import { MatoranTag } from '../types/Matoran';
import { Quest } from '../types/Quests';
import { GameItemId } from './loot';

export const QUESTS: Quest[] = [
  {
    id: 'story_find_canister_beach',
    name: 'The Canister on the shore',
    description:
      'Takua finds a large cylindrical canister that washed ashore. Large footsteps lead from it to Ta-Wahi',
    durationSeconds: 1 * 60, // 1 minute
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Kapura',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.Charcoal,
              quantity: 150,
            },
            {
              item: GameItemId.BurnishedAlloy,
              quantity: 50,
            },
          ],
        },
        {
          id: 'Jala',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.Charcoal,
              quantity: 300,
            },
            {
              item: GameItemId.BurnishedAlloy,
              quantity: 100,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.Charcoal]: 100,
        [GameItemId.BurnishedAlloy]: 50,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    followUpQuests: ['story_tahu_unlock_01'],
    unlockedAfter: [],
  },
  {
    id: 'story_tahu_unlock_01',
    name: 'A disturbance in the Forest',
    description:
      'Jala and Kapura investigate a strange disturbance deep in the Ta-Wahi forest. Smoke rises where none should be—could the ancient legends be true?',
    durationSeconds: 1 * 60 * 60, // 1 hour
    requirements: {
      matoran: ['Jala', 'Kapura'],
      minLevel: 5,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 100,
          consumed: true,
        },
        {
          id: GameItemId.BurnishedAlloy,
          amount: 50,
          consumed: true,
        },
      ],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Toa_Tahu',
          cost: 10000,
          requiredItems: [
            {
              item: GameItemId.Charcoal,
              quantity: 3000,
            },
            {
              item: GameItemId.BurnishedAlloy,
              quantity: 1000,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.Charcoal]: 1000,
        [GameItemId.BurnishedAlloy]: 500,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    followUpQuests: ['story_ga_koro_sos'],
    unlockedAfter: ['story_find_canister_beach'],
  },
  {
    id: 'story_ga_koro_sos',
    name: 'A call for help',
    description:
      'Jala mentioned a distress call from Ga-Koro. Back at the Ta-Wahi coast, Takua meets Maku, who pleads for help—Ga-Koro is under attack by a Rahi! Moved by her urgency, Takua sets sail to offer aid.',
    durationSeconds: 2 * 60 * 60, // 2 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 6,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 50,
          consumed: true,
        },
      ],
    },
    rewards: {
      loot: {
        [GameItemId.WaterAlgae]: 100,
        [GameItemId.GaPearl]: 50,
      },
      xpPerMatoran: 200,
      currency: 600,
    },
    followUpQuests: ['story_restore_ga_koro'],
    unlockedAfter: ['story_tahu_unlock_01'],
  },
  {
    id: 'story_restore_ga_koro',
    name: 'Ga-Koro Under Siege',
    description:
      'Takua finds the villagers of Ga-Koro trapped underwater. Takua needs to find a way to release them.',
    durationSeconds: 2 * 60 * 60, // 2 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 6,
      items: [
        {
          id: GameItemId.WaterAlgae,
          amount: 100,
          consumed: true,
        },
      ],
    },
    rewards: {
      loot: {
        [GameItemId.WaterAlgae]: 1000,
        [GameItemId.GaPearl]: 500,
      },
      unlockCharacters: [
        {
          id: 'Toa_Gali',
          cost: 10000,
          requiredItems: [
            {
              item: GameItemId.WaterAlgae,
              quantity: 3000,
            },
            {
              item: GameItemId.GaPearl,
              quantity: 1000,
            },
          ],
        },
      ],
      xpPerMatoran: 200,
      currency: 600,
    },
    followUpQuests: ['story_po_koro_sickness'],
    unlockedAfter: ['story_ga_koro_sos'],
  },
  {
    id: 'story_po_koro_sickness',
    name: 'A Game Gone Wrong',
    description: `Maku confided that she hasn't heard from Huki in a long time.
       She asks if you can sail to Po-Koro.
       Arriving in the stone village of Po-Koro, 
       Takua finds many villagers—including famous Koli player Huki—sick.
       Suspicion turns to the Koli balls used in recent matches.`,
    durationSeconds: 1 * 60 * 60, // 1 hour
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      xpPerMatoran: 250,
      currency: 500,
      loot: {
        [GameItemId.StoneBlock]: 100,
        [GameItemId.GemShard]: 50,
      },
    },
    followUpQuests: ['story_po_koro_cave_investigation'],
    unlockedAfter: ['story_restore_ga_koro'],
  },
  {
    id: 'story_po_koro_cave_investigation',
    name: 'Cave of the Corrupted',
    description:
      'Takua follows the trail of the infected Koli balls to a dark cave outside Po-Koro. Inside, he discovers a Rahi nest and a stash of corrupted balls. Toa Pohatu arrives just in time to help seal the cave.',
    durationSeconds: 2 * 60 * 60, // 2 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [
        {
          id: GameItemId.StoneBlock,
          amount: 200,
          consumed: true,
        },
      ],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Toa_Pohatu',
          cost: 10000,
          requiredItems: [
            {
              item: GameItemId.StoneBlock,
              quantity: 3000,
            },
            {
              item: GameItemId.GemShard,
              quantity: 1000,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.StoneBlock]: 1000,
        [GameItemId.GemShard]: 500,
      },
      xpPerMatoran: 400,
      currency: 800,
    },
    followUpQuests: ['story_recruit_hewkii'],
    unlockedAfter: ['story_po_koro_sickness'],
  },
  {
    id: 'story_recruit_hewkii',
    name: 'Koli Champion Recovered',
    description:
      'With the source of the corruption destroyed, Hewkii finally begins to recover. Inspired by Takua’s courage, he offers to join the journey ahead.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Huki',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.StoneBlock,
              quantity: 300,
            },
            {
              item: GameItemId.GemShard,
              quantity: 100,
            },
          ],
        },
        {
          id: 'Maku',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.WaterAlgae,
              quantity: 150,
            },
            {
              item: GameItemId.GaPearl,
              quantity: 50,
            },
          ],
        },
      ],
      xpPerMatoran: 200,
      currency: 300,
    },
    followUpQuests: [],
    unlockedAfter: ['story_po_koro_cave_investigation'],
  },
];

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

function generateMermaidFlowchart(quests: Quest[]) {
  const nodes = quests.map((q) => {
    const duration = formatDuration(q.durationSeconds || 0);
    const rewards = formatRewards(q.rewards);
    const label = sanitize(`${q.name}\n(${duration})${rewards}`);
    return `  ${q.id}["${label}"]`;
  });

  const edges: string[] = [];
  quests.forEach((q) => {
    if (q.followUpQuests && q.followUpQuests.length > 0) {
      q.followUpQuests.forEach((targetId) => {
        edges.push(`  ${q.id} --> ${targetId}`);
      });
    }
  });

  return `graph TD\n${nodes.join('\n')}\n${edges.join('\n')}`;
}

// Example usage:
console.log(generateMermaidFlowchart(QUESTS));
