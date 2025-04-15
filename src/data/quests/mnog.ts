import { Quest } from '../../types/Quests';
import { GameItemId } from '../loot';

export const MNOG_QUEST_LINE: Quest[] = [
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
      cutscene: 'u0DYYVupuGQ',
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
      cutscene: 'Cn5jxci0RiQ',
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
      cutscene: 'qRVxnc26NDI',
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
      cutscene: 'Fud_TgE_GTs',
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
      cutscene: 'EZdYj1GQR4s',
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
    followUpQuests: ['story_arrive_onu_koro'],
    unlockedAfter: ['story_po_koro_cave_investigation'],
  },
  {
    id: 'story_arrive_onu_koro',
    name: 'Into the Underground',
    description: `Takua travels through the rocky tunnels toward Onu-Koro, following rumors of mining troubles.`,
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 8,
      items: [],
    },
    rewards: {
      xpPerMatoran: 200,
      currency: 400,
    },
    followUpQuests: ['story_onu_koro_lava_problem'],
    unlockedAfter: ['story_recruit_hewkii'],
  },
  {
    id: 'story_onu_koro_lava_problem',
    name: 'Redirection',
    description:
      'Onu-Koro’s main tunnel has been blocked by lava flows. Takua can use his lava board to cross it and activate an ancient pump system to reroute the molten stream and restore safe mining routes.',
    durationSeconds: 2 * 60 * 60, // 2 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 8,
      items: [
        {
          id: GameItemId.BurnishedAlloy,
          amount: 1000,
          consumed: true,
        },
      ],
    },
    rewards: {
      loot: {
        [GameItemId.LightStone]: 1000,
        [GameItemId.BiolumeThread]: 500,
      },
      xpPerMatoran: 300,
      currency: 700,
    },
    followUpQuests: ['story_meet_taipu'],
    unlockedAfter: ['story_arrive_onu_koro'],
  },
  {
    id: 'story_meet_taipu',
    name: 'Meet Taipu',
    description:
      'With the lava redirected, Takua can explore the newly opened tunnels. At the end of the tunnel to Le Koro, Takua meets Taipu who is very eager to explore Le-Wahi and wants to join in your adventure.',
    durationSeconds: 45 * 60, // 45 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Taipu',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.LightStone,
              quantity: 150,
            },
            {
              item: GameItemId.BiolumeThread,
              quantity: 50,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.LightStone]: 500,
        [GameItemId.BiolumeThread]: 250,
      },
      xpPerMatoran: 250,
      currency: 500,
    },
    followUpQuests: ['story_enter_le_wahi'],
    unlockedAfter: ['story_onu_koro_lava_problem'],
  },
  {
    id: 'story_enter_le_wahi',
    name: 'Enter Le-Wahi',
    description:
      'Takua and Taipu travel through the reopened tunnel toward Le-Wahi. As they emerge into the jungle, a Nui-Rama suddenly ambushes them—snatching Taipu and flying off toward the treetops. Takua presses on alone, determined to rescue his friend.',
    durationSeconds: 1 * 60 * 60, // 1 hour
    requirements: {
      matoran: ['Takua', 'Taipu'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      loot: {
        [GameItemId.JungleResin]: 100,
      },
      cutscene: 'vM0lWqZ9uD4',
      xpPerMatoran: 300,
      currency: 600,
    },
    followUpQuests: ['story_flight_to_hive'],
    unlockedAfter: ['story_meet_taipu'],
  },
  {
    id: 'story_flight_to_hive',
    name: 'Flight to the Hive',
    description:
      'Arriving at Le-Koro, Takua finds the village nearly deserted—most of its Matoran have been taken by the Nui-Rama. The few who remain, including Tamaru and Kongu, greet him with urgency. With a Kahu prepared for flight, Takua joins them on a daring mission to rescue the missing villagers from the hive.',
    durationSeconds: 1.5 * 60 * 60, // 1.5 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 10,
      items: [
        {
          id: GameItemId.FeatherTufts,
          amount: 400,
          consumed: true,
        },
        {
          id: GameItemId.JungleResin,
          amount: 200,
          consumed: true,
        },
      ],
    },
    rewards: {
      unlockCharacters: [
        {
          id: 'Tamaru',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.FeatherTufts,
              quantity: 150,
            },
            {
              item: GameItemId.JungleResin,
              quantity: 50,
            },
          ],
        },
        {
          id: 'Kongu',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.FeatherTufts,
              quantity: 300,
            },
            {
              item: GameItemId.JungleResin,
              quantity: 100,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.FeatherTufts]: 800,
        [GameItemId.JungleResin]: 400,
      },
      cutscene: '3feiWoDhKzo',
      xpPerMatoran: 500,
      currency: 700,
    },
    followUpQuests: ['story_rescue_from_hive'],
    unlockedAfter: ['story_enter_le_wahi'],
  },
  {
    id: 'story_rescue_from_hive',
    name: 'Rescue from the Hive',
    description:
      'Takua, Tamaru, and Kongu fly to the Nui-Rama hive in a daring rescue mission. As they enter, something downs their Kahu birds and they are trapped. Inside, they discover the captive Le-Matoran—and Taipu, still alive but forced to work.',
    durationSeconds: 0.5 * 60 * 60, // 0.5 hours
    requirements: {
      matoran: ['Takua', 'Tamaru', 'Kongu'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: 'dsSugRBjusI',
      xpPerMatoran: 1000,
      currency: 1200,
    },
    followUpQuests: ['story_lewa_v_onua'],
    unlockedAfter: ['story_flight_to_hive'],
  },
  {
    id: 'story_lewa_v_onua',
    name: 'Trapped in the Hive',
    description:
      'Takua, Taipu and all the Le Matoran, includind Turaga Matau, are trapped in a Nui-Rama nest. There does not seem to be a way out!',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Takua', 'Taipu', 'Tamaru', 'Kongu'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: 'tggBKXjwPow',
      xpPerMatoran: 1000,
      currency: 1200,
    },
    followUpQuests: [],
    unlockedAfter: ['story_lewa_v_onua'],
  },
];
