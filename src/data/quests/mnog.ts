import { Quest } from '../../types/Quests';
import { GameItemId } from '../loot';

export const MNOG_QUEST_LINE: Quest[] = [
  {
    section: "The Cronicler's Journey",
    id: 'mnog_find_canister_beach',
    name: 'The Canister on the shore',
    description: 'Takua awakes on the shore of Ta-Wahi. He has no memory of how he got there.',
    durationSeconds: 1 * 60, // 1 minute
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_canister_beach' },
      loot: {
        [GameItemId.Charcoal]: 100,
        [GameItemId.BurnishedAlloy]: 50,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    unlockedAfter: ['story_toa_arrival'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_takua_meets_kapura',
    name: 'The Art of Moving Slowly',
    description:
      'Entering the forest, Takua gets lost and meets Kapura, a Matoran who seems to be lost too.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
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
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_takua_meets_kapura' },
      unlockCharacters: [
        {
          id: 'Kapura',
          cost: 200,
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
      ],
      loot: {
        [GameItemId.Charcoal]: 1000,
        [GameItemId.BurnishedAlloy]: 500,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    unlockedAfter: ['mnog_find_canister_beach'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_tahu_unlock_01',
    name: 'A disturbance in the Forest',
    description: 'Takua proceeds to Ta-Koro were he meets Jala, Captain of the Ta-Koro Guard.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
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
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_tahu_unlock_01' },
      unlockCharacters: [
        // TODO: MOVE JALA TO A LATER QUEST
        {
          id: 'Jala',
          cost: 200,
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
        [GameItemId.Charcoal]: 1000,
        [GameItemId.BurnishedAlloy]: 500,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    unlockedAfter: ['mnog_takua_meets_kapura'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_ga_koro_sos',
    name: 'A call for help',
    description:
      'Jala mentioned a distress call from Ga-Koro. Takua offers to help. He returns to the coast of Ta-Wahi and meets Maku.',
    durationSeconds: 20 * 60, // 20 minutes
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
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_ga_koro_sos' },
      loot: {
        [GameItemId.WaterAlgae]: 100,
        [GameItemId.GaPearl]: 50,
      },
      xpPerMatoran: 200,
      currency: 600,
    },
    unlockedAfter: ['mnog_tahu_unlock_01'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_restore_ga_koro',
    name: 'Ga-Koro Under Siege',
    description: 'Takua reaches Ga-Koro and finds the village completely deserted.',
    durationSeconds: 10 * 60, // 10 minutes
    requirements: {
      matoran: ['Takua', 'Toa_Gali'],
      minLevel: 5,
      items: [
        {
          id: GameItemId.WaterAlgae,
          amount: 100,
          consumed: true,
        },
      ],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_restore_ga_koro' },
      loot: {
        [GameItemId.WaterAlgae]: 1000,
        [GameItemId.GaPearl]: 500,
      },
      unlockCharacters: [
        {
          id: 'Hahli',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.WaterAlgae,
              quantity: 300,
            },
            {
              item: GameItemId.GaPearl,
              quantity: 100,
            },
          ],
        },
      ],
      xpPerMatoran: 200,
      currency: 600,
    },
    unlockedAfter: ['mnog_ga_koro_sos', 'story_toa_council'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_po_wahi_desert',
    name: 'The way to Po-Koro',
    description: `Maku confided that she hasn't heard from Huki in a long time.
       She asks if you can sail to Po-Koro.
       Po-Wahi is a dry, arid land of sand and stone and the way too Po-Koro is a long journey.`,
    durationSeconds: 15 * 60, // 15 min
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_po_wahi_desert' },
      xpPerMatoran: 250,
      currency: 500,
      unlockCharacters: [
        {
          id: 'Hafu',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.StoneBlock,
              quantity: 150,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.StoneBlock]: 100,
        [GameItemId.GemShard]: 50,
      },
    },
    unlockedAfter: ['mnog_restore_ga_koro'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_po_koro_sickness',
    name: 'A Game Gone Wrong',
    description: `Takua finally arrives at the stone village of Po-Koro, 
      Takua finds many villagers have fallen ill, including famous Koli player Huki.
      A salesman approaches Takua.`,
    durationSeconds: 15 * 60, // 15 min
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      xpPerMatoran: 250,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_po_koro_sickness' },
      currency: 500,
      unlockCharacters: [
        {
          id: 'Kivi',
          cost: 300,
          requiredItems: [
            {
              item: GameItemId.StoneBlock,
              quantity: 150,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.StoneBlock]: 100,
        [GameItemId.GemShard]: 50,
      },
    },
    unlockedAfter: ['mnog_po_wahi_desert'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_po_koro_cave_investigation',
    name: 'Cave of the Corrupted',
    description:
      'Takua finds an infected Koli ball while exploring an area of Po-Wahi. He finds a cave. Inside, he discovers a Rahi nest and a stash of corrupted balls. Toa Pohatu arrives just in time to help seal the cave.',
    durationSeconds: 10 * 60, // 10 min
    requirements: {
      matoran: ['Takua', 'Toa_Pohatu'],
      minLevel: 5,
      items: [
        {
          id: GameItemId.StoneBlock,
          amount: 200,
          consumed: true,
        },
      ],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_po_koro_cave_investigation' },
      loot: {
        [GameItemId.StoneBlock]: 1000,
        [GameItemId.GemShard]: 500,
      },
      xpPerMatoran: 400,
      currency: 800,
    },
    unlockedAfter: ['mnog_po_koro_sickness', 'story_toa_council'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_recruit_hewkii',
    name: 'Koli Champion Recovered',
    description: 'With the source of the corruption destroyed, Huki finally begins to recover.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_recruit_hewkii' },
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
    unlockedAfter: ['mnog_po_koro_cave_investigation'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_arrive_onu_koro',
    name: 'Into the Underground',
    description: `Takua travels through the rocky tunnels toward Onu-Koro, following rumors of mining troubles.`,
    durationSeconds: 10 * 60, // 10 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 8,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_arrive_onu_koro' },
      xpPerMatoran: 200,
      unlockCharacters: [
        {
          id: 'Nuparu',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.LightStone,
              quantity: 300,
            },
            {
              item: GameItemId.BiolumeThread,
              quantity: 100,
            },
          ],
        },
        {
          id: 'Onepu',
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
      currency: 400,
    },
    unlockedAfter: ['mnog_recruit_hewkii'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_onu_koro_lava_problem',
    name: 'Redirection',
    description:
      'Onu-Koro’s main tunnel has been blocked by lava flows. Takua can use his lava board to cross it and activate an ancient pump system to reroute the molten stream and restore safe mining routes.',
    durationSeconds: 20 * 60, // 20 min
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
    unlockedAfter: ['mnog_arrive_onu_koro'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_meet_taipu',
    name: 'Meet Taipu',
    description:
      'With the lava redirected, Takua can explore the newly opened tunnels. At the end of the tunnel to Le-Koro, Takua meets Taipu—a strong but simple miner who is very eager to see the surface world.',
    durationSeconds: 10 * 60, // 10 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_meet_taipu' },
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
    unlockedAfter: ['mnog_onu_koro_lava_problem'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_enter_le_wahi',
    name: 'Enter Le-Wahi',
    description:
      'Takua and Taipu travel through the reopened tunnel toward Le-Wahi. Taipu cannot contain his excitement.',
    durationSeconds: 10 * 60, // 10 min
    requirements: {
      matoran: ['Takua', 'Taipu'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      loot: {
        [GameItemId.JungleResin]: 100,
      },
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_enter_le_wahi' },
      xpPerMatoran: 300,
      currency: 600,
    },
    unlockedAfter: ['mnog_meet_taipu'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_flight_to_hive',
    name: 'Flight to the Hive',
    description: 'Arriving at Le-Koro, Takua finds the village nearly deserted.',
    durationSeconds: 5 * 60, // 5 min
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
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_flight_to_hive' },
      xpPerMatoran: 500,
      currency: 700,
    },
    unlockedAfter: ['mnog_enter_le_wahi'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_rescue_from_hive',
    name: 'Rescue from the Hive',
    description: 'Takua, Tamaru, and Kongu fly to the Nui-Rama hive in a daring rescue mission.',
    durationSeconds: 0.5 * 60 * 60, // 0.5 hours
    requirements: {
      matoran: ['Takua', 'Tamaru', 'Kongu'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_rescue_from_hive' },
      xpPerMatoran: 1000,
      currency: 1200,
    },
    unlockedAfter: ['mnog_flight_to_hive'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_lewa_v_onua',
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
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_lewa_v_onua' },
      xpPerMatoran: 1000,
      currency: 1200,
    },
    unlockedAfter: [
      'mnog_rescue_from_hive',
      'maskhunt_lewa_kakama_komau',
      'maskhunt_onua_jungle_rumor',
    ],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_arrive_ko_koro',
    name: 'Journey to Ko-Koro',
    description:
      'At Jala’s request, Takua travels to the icy peaks of Ko-Wahi to warn the secluded Ko-Matoran of increased Rahi activity. Near an abandoned outpost, he finds a Matoran frozen in ice.',
    durationSeconds: 0.5 * 60 * 60, // 0.5 hours
    requirements: {
      matoran: ['Takua'],
      minLevel: 11,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 1000,
          consumed: true,
        },
      ],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_arrive_ko_koro' },
      unlockCharacters: [
        {
          id: 'Kopeke',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.IceChip,
              quantity: 150,
            },
            {
              item: GameItemId.FrostChisel,
              quantity: 50,
            },
          ],
        },
        {
          id: 'Lumi',
          cost: 300,
          requiredItems: [
            {
              item: GameItemId.IceChip,
              quantity: 150,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.IceChip]: 75,
        [GameItemId.FrostChisel]: 25,
      },
      xpPerMatoran: 350,
      currency: 800,
    },
    unlockedAfter: ['mnog_lewa_v_onua'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_search_for_matoro',
    name: 'Search for Matoro',
    description:
      'After reaching the silent village of Ko-Koro, Takua learns that Turaga Nuju speaks only in gestures and whistles. In order to understand him, Takua must find his translator—Matoro—who has gone missing somewhere in the icy wastes of Ko-Wahi.',
    durationSeconds: 0.5 * 60 * 60, // 1.5 hours
    requirements: {
      matoran: ['Takua', 'Toa_Kopaka'],
      minLevel: 8,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 1000,
          consumed: true,
        },
      ],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_search_for_matoro' },
      unlockCharacters: [
        {
          id: 'Matoro',
          cost: 1200,
          requiredItems: [
            {
              item: GameItemId.IceChip,
              quantity: 300,
            },
            {
              item: GameItemId.FrostChisel,
              quantity: 100,
            },
          ],
        },
      ],
      loot: {
        [GameItemId.IceChip]: 150,
        [GameItemId.FrostChisel]: 50,
      },
      xpPerMatoran: 350,
      currency: 850,
    },
    unlockedAfter: ['mnog_arrive_ko_koro', 'maskhunt_kopaka_mahiki_huna'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_summon_chroniclers_company',
    name: 'Summon the Chronicler’s Company',
    description:
      'After speaking with Turaga Nuju through Matoro’s translation, Takua is entrusted with a sacred duty: to gather one brave Matoran from each village for a journey to Kini-Nui.',
    durationSeconds: 30 * 60, // 30 min
    requirements: {
      matoran: ['Takua', 'Kopeke'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_summon_chroniclers_company' },
      unlockCharacters: [
        {
          id: 'Hafu',
          cost: 600,
          requiredItems: [
            {
              item: GameItemId.StoneBlock,
              quantity: 150,
            },
            {
              item: GameItemId.GemShard,
              quantity: 50,
            },
          ],
        },
      ],
      xpPerMatoran: 600,
      currency: 1500,
    },
    unlockedAfter: ['mnog_search_for_matoro'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_journey_to_kini_nui_1',
    name: 'Passage to Kini-Nui',
    description:
      'With the Chronicler’s Company assembled, Takua leads the six Matoran across Mata Nui. In Ga-Koro, Nokama reveals the hidden water passage that leads deep inland toward Kini-Nui. Together, the company embarks on the sacred journey.',
    durationSeconds: 30 * 60, // 30 min
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 1200,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_journey_to_kini_nui_1' },
    },
    unlockedAfter: ['mnog_summon_chroniclers_company'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_journey_to_kini_nui_2',
    name: 'Ravine Crossing',
    description:
      'After passing through the secret waterfall passage, the Chronicler’s Company treks across the forest toward Kini-Nui. Their progress is halted by a deep ravine. As the team debates their options, Tamaru proposes a daring method to get across.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 1000,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_journey_to_kini_nui_2' },
    },
    unlockedAfter: ['mnog_journey_to_kini_nui_1'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_journey_to_kini_nui_3',
    name: 'Rockslide Ahead',
    description:
      'Having crossed the ravine, the Chronicler’s Company makes steady progress toward Kini-Nui. But their path is blocked once more—this time by a massive rockslide. The group must clear a way through or find a clever way around the rubble.',
    durationSeconds: 30 * 60, // 1 hour
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 12,
      items: [
        {
          id: GameItemId.CarvingTool,
          amount: 100,
          consumed: true,
        },
      ],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 1100,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_journey_to_kini_nui_3' },
    },
    unlockedAfter: ['mnog_journey_to_kini_nui_2'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_journey_to_kini_nui_4',
    name: 'The Silent Gate',
    description:
      'Beyond the rockslide, the Chronicler’s Company discovers a great stone gate carved in the shape of a solemn face. There’s no obvious way through. The Matoran must find a way to unlock its hidden mechanism and continue their journey to Kini-Nui.',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
      items: [
        {
          id: GameItemId.IceChip,
          amount: 100,
          consumed: true,
        },
        {
          id: GameItemId.FrostChisel,
          amount: 50,
          consumed: true,
        },
      ],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 900,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_journey_to_kini_nui_4' },
    },
    unlockedAfter: ['mnog_journey_to_kini_nui_3'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_kini_nui_arrival',
    name: 'Arrival at Kini-Nui',
    description:
      'The Chronicler’s Company reaches the heart of Mata Nui and are tasked with its defense by the Toa themselves!',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_kini_nui_arrival' },
      xpPerMatoran: 2000,
      currency: 1500,
    },
    unlockedAfter: ['story_kini_nui_gathering', 'mnog_journey_to_kini_nui_4'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_kini_nui_defense',
    name: 'Defense of Kini-Nui',
    description:
      'With the Toa descended into the depths beneath Kini-Nui, the Chronicler’s Company remains behind to defend the shrine. Suddenly, waves of Rahi begin emerging from the jungle—Makuta’s final effort to stop the Toa. The Matoran must hold the line.',
    durationSeconds: 20 * 60, // 2 hours
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 25,
    },
    rewards: {
      xpPerMatoran: 2000,
      currency: 1800,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_kini_nui_defense' },
    },
    unlockedAfter: ['mnog_kini_nui_arrival'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_gali_call',
    name: "Gali's Call",
    description:
      'With the shrine defended and the villagers rallying to the Company’s aid, Takua suddenly hears Gali’s voice echoing in his mind, calling for help. Remembering an ancient tunnel deep in Onu-Wahi, he sets out alone, hoping to reach her in time.',
    durationSeconds: 20 * 60, // 1 hour
    requirements: {
      matoran: ['Takua'],
      minLevel: 13,
      items: [
        {
          id: GameItemId.LightStone,
          amount: 1000,
          consumed: true,
        },
      ],
    },
    rewards: {
      xpPerMatoran: 300,
      currency: 1000,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_gali_call' },
    },
    unlockedAfter: ['mnog_kini_nui_defense', 'story_kini_nui_descent'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_witness_makuta_battle',
    name: 'Confronting Chaos',
    description:
      'Navigating ancient tunnels beneath Kini-Nui, Takua quietly arrives at the edge of a vast chamber—Mangaia. There, he sees the Toa united in battle against the dark presence of Makuta. From the shadows, he watches the fate of Mata Nui unfold.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 30,
    },
    rewards: {
      xpPerMatoran: 800,
      currency: 1600,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_witness_makuta_battle' },
    },
    unlockedAfter: ['mnog_gali_call'],
  },
  {
    section: "The Cronicler's Journey",
    id: 'mnog_return_to_shore',
    name: 'Return to the Shore',
    description:
      'Having followed the Toa’s journey to its end and witnessed their confrontation with Makuta, Takua emerges once again on the familiar shore of Ta-Wahi. There, Turaga Vakama awaits him. It is time to record the final chapter of this saga.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 30,
      items: [],
    },
    rewards: {
      xpPerMatoran: 5000,
      currency: 2000,
      cutscene: { type: 'visual_novel', cutsceneId: 'mnog_return_to_shore' },
    },
    unlockedAfter: ['mnog_witness_makuta_battle'],
  },
];
