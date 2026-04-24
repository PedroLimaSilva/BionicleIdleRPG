import { Quest } from '../../types/Quests';

export const MNOG_QUEST_LINE: Quest[] = [
  {
    description: 'Takua awakens on the shore of Ta-Wahi. He has no memory of how he got there.',
    durationSeconds: 1 * 60, // 1 minute
    id: 'mnog_find_canister_beach',
    name: 'The Canister on the shore',
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_canister_beach', type: 'visual_novel' },
      xpPerMatoran: 150,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['story_toa_arrival'],
  },
  {
    description:
      'Entering the forest, Takua gets lost and meets Kapura, a Matoran who seems to be lost too.',
    durationSeconds: 5 * 60, // 5 minutes
    id: 'mnog_takua_meets_kapura',
    name: 'The Art of Moving Slowly',
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_takua_meets_kapura', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 750,
          id: 'Kapura',
        },
      ],
      xpPerMatoran: 150,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_find_canister_beach'],
  },
  {
    description: 'Takua proceeds to Ta-Koro where he meets Jala, Captain of the Ta-Koro Guard.',
    durationSeconds: 5 * 60, // 5 minutes
    id: 'mnog_tahu_unlock_01',
    name: 'A disturbance in the Forest',
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_tahu_unlock_01', type: 'visual_novel' },
      unlockCharacters: [
        // TODO: MOVE JALA TO A LATER QUEST
        {
          cost: 2000,
          id: 'Jala',
        },
      ],
      xpPerMatoran: 150,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_takua_meets_kapura'],
  },
  {
    description:
      'Jala mentioned a distress call from Ga-Koro. Takua offers to help. He returns to the coast of Ta-Wahi and meets Maku.',
    durationSeconds: 20 * 60, // 20 minutes
    id: 'mnog_ga_koro_sos',
    name: 'A call for help',
    requirements: {
      matoran: ['Takua'],
      minLevel: 6,
    },
    rewards: {
      currency: 600,
      cutscene: { cutsceneId: 'mnog_ga_koro_sos', type: 'visual_novel' },
      xpPerMatoran: 200,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_tahu_unlock_01'],
  },
  {
    description: 'Takua reaches Ga-Koro and finds the village completely deserted.',
    durationSeconds: 10 * 60, // 10 minutes
    id: 'mnog_restore_ga_koro',
    name: 'Ga-Koro Under Siege',
    requirements: {
      matoran: ['Takua', 'Toa_Gali'],
      minLevel: 5,
    },
    rewards: {
      currency: 600,
      cutscene: { cutsceneId: 'mnog_restore_ga_koro', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 1000,
          id: 'Hahli',
        },
      ],
      xpPerMatoran: 200,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_ga_koro_sos', 'story_toa_council'],
  },
  {
    description: `Maku confided that she hasn't heard from Huki in a long time.
       She asks if you can sail to Po-Koro.
       Po-Wahi is a dry, arid land of sand and stone, and the way to Po-Koro is a long journey.`,
    durationSeconds: 15 * 60, // 15 min
    id: 'mnog_po_wahi_desert',
    name: 'The way to Po-Koro',
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_po_wahi_desert', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 500,
          id: 'Hafu',
        },
      ],
      xpPerMatoran: 250,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_restore_ga_koro'],
  },
  {
    description: `Takua finally arrives at the stone village of Po-Koro.
      Many villagers have fallen ill, including famous Koli player Huki.
      A salesman approaches Takua.`,
    durationSeconds: 15 * 60, // 15 min
    id: 'mnog_po_koro_sickness',
    name: 'A Game Gone Wrong',
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_po_koro_sickness', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 750,
          id: 'Kivi',
        },
      ],
      xpPerMatoran: 250,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_po_wahi_desert'],
  },
  {
    description:
      'Takua finds an infected Koli ball while exploring an area of Po-Wahi. He finds a cave. Inside, he discovers a Rahi nest and a stash of corrupted balls. Toa Pohatu arrives just in time to help seal the cave.',
    durationSeconds: 10 * 60, // 10 min
    id: 'mnog_po_koro_cave_investigation',
    name: 'Cave of the Corrupted',
    requirements: {
      matoran: ['Takua', 'Toa_Pohatu'],
      minLevel: 5,
    },
    rewards: {
      currency: 800,
      cutscene: { cutsceneId: 'mnog_po_koro_cave_investigation', type: 'visual_novel' },
      xpPerMatoran: 400,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_po_koro_sickness', 'story_toa_council'],
  },
  {
    description: 'With the source of the corruption destroyed, Huki finally begins to recover.',
    durationSeconds: 5 * 60, // 5 minutes
    id: 'mnog_recruit_hewkii',
    name: 'Koli Champion Recovered',
    requirements: {
      matoran: ['Takua'],
      minLevel: 7,
    },
    rewards: {
      currency: 300,
      cutscene: { cutsceneId: 'mnog_recruit_hewkii', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 1000,
          id: 'Huki',
        },
        {
          cost: 600,
          id: 'Maku',
        },
      ],
      xpPerMatoran: 200,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_po_koro_cave_investigation'],
  },
  {
    description: `Takua travels through the rocky tunnels toward Onu-Koro, following rumors of mining troubles.`,
    durationSeconds: 10 * 60, // 10 minutes
    id: 'mnog_arrive_onu_koro',
    name: 'Into the Underground',
    requirements: {
      matoran: ['Takua'],
      minLevel: 8,
    },
    rewards: {
      currency: 400,
      cutscene: { cutsceneId: 'mnog_arrive_onu_koro', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 1000,
          id: 'Nuparu',
        },
        {
          cost: 600,
          id: 'Onepu',
        },
      ],
      xpPerMatoran: 200,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_recruit_hewkii'],
  },
  {
    description:
      "Onu-Koro's main tunnel has been blocked by lava flows. Takua can use his lava board to cross it and activate an ancient pump system to reroute the molten stream and restore safe mining routes.",
    durationSeconds: 20 * 60, // 20 min
    id: 'mnog_onu_koro_lava_problem',
    name: 'Redirection',
    requirements: {
      matoran: ['Takua'],
      minLevel: 8,
    },
    rewards: {
      currency: 700,
      xpPerMatoran: 300,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_arrive_onu_koro'],
  },
  {
    description:
      'With the lava redirected, Takua can explore the newly opened tunnels. At the end of the tunnel to Le-Koro, Takua meets Taipu—a strong but simple miner who is very eager to see the surface world.',
    durationSeconds: 10 * 60, // 10 minutes
    id: 'mnog_meet_taipu',
    name: 'Meet Taipu',
    requirements: {
      matoran: ['Takua'],
      minLevel: 9,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'mnog_meet_taipu', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 600,
          id: 'Taipu',
        },
      ],
      xpPerMatoran: 250,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_onu_koro_lava_problem'],
  },
  {
    description:
      'Takua and Taipu travel through the reopened tunnel toward Le-Wahi. Taipu cannot contain his excitement.',
    durationSeconds: 10 * 60, // 10 min
    id: 'mnog_enter_le_wahi',
    name: 'Enter Le-Wahi',
    requirements: {
      matoran: ['Takua', 'Taipu'],
      minLevel: 9,
    },
    rewards: {
      currency: 600,
      cutscene: { cutsceneId: 'mnog_enter_le_wahi', type: 'visual_novel' },
      xpPerMatoran: 300,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_meet_taipu'],
  },
  {
    description: 'Arriving at Le-Koro, Takua finds the village nearly deserted.',
    durationSeconds: 5 * 60, // 5 min
    id: 'mnog_flight_to_hive',
    name: 'Flight to the Hive',
    requirements: {
      matoran: ['Takua'],
      minLevel: 10,
    },
    rewards: {
      currency: 700,
      cutscene: { cutsceneId: 'mnog_flight_to_hive', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 600,
          id: 'Tamaru',
        },
        {
          cost: 1000,
          id: 'Kongu',
        },
      ],
      xpPerMatoran: 500,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_enter_le_wahi'],
  },
  {
    description: 'Takua, Tamaru, and Kongu fly to the Nui-Rama hive in a daring rescue mission.',
    durationSeconds: 0.5 * 60 * 60, // 0.5 hours
    id: 'mnog_rescue_from_hive',
    name: 'Rescue from the Hive',
    requirements: {
      matoran: ['Takua', 'Tamaru', 'Kongu'],
      minLevel: 10,
    },
    rewards: {
      currency: 1200,
      cutscene: { cutsceneId: 'mnog_rescue_from_hive', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_flight_to_hive'],
  },
  {
    description:
      'Takua, Taipu, and all the Le-Matoran, including Turaga Matau, are trapped in a Nui-Rama nest. There does not seem to be a way out!',
    durationSeconds: 15 * 60, // 15 minutes
    id: 'mnog_lewa_v_onua',
    name: 'Trapped in the Hive',
    requirements: {
      matoran: ['Takua', 'Taipu', 'Tamaru', 'Kongu'],
      minLevel: 10,
    },
    rewards: {
      currency: 1200,
      cutscene: { cutsceneId: 'mnog_lewa_v_onua', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: [
      'mnog_rescue_from_hive',
      'maskhunt_lewa_kakama_komau',
      'maskhunt_onua_jungle_rumor',
    ],
  },
  {
    description:
      "At Jala's request, Takua travels to the icy peaks of Ko-Wahi to warn the secluded Ko-Matoran of increased Rahi activity. Near an abandoned outpost, he finds a Matoran frozen in ice.",
    durationSeconds: 0.5 * 60 * 60, // 0.5 hours
    id: 'mnog_arrive_ko_koro',
    name: 'Journey to Ko-Koro',
    requirements: {
      matoran: ['Takua'],
      minLevel: 11,
    },
    rewards: {
      currency: 800,
      cutscene: { cutsceneId: 'mnog_arrive_ko_koro', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 600,
          id: 'Kopeke',
        },
        {
          cost: 750,
          id: 'Lumi',
        },
      ],
      xpPerMatoran: 350,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_lewa_v_onua'],
  },
  {
    description:
      'After reaching the silent village of Ko-Koro, Takua learns that Turaga Nuju speaks only in gestures and whistles. In order to understand him, Takua must find his translator—Matoro—who has gone missing somewhere in the icy wastes of Ko-Wahi.',
    durationSeconds: 0.5 * 60 * 60, // 30 minutes
    id: 'mnog_search_for_matoro',
    name: 'Search for Matoro',
    requirements: {
      matoran: ['Takua', 'Toa_Kopaka'],
      minLevel: 8,
    },
    rewards: {
      currency: 850,
      cutscene: { cutsceneId: 'mnog_search_for_matoro', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 1000,
          id: 'Matoro',
        },
      ],
      xpPerMatoran: 350,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_arrive_ko_koro', 'maskhunt_kopaka_mahiki_huna'],
  },
  {
    description:
      "After speaking with Turaga Nuju through Matoro's translation, Takua is entrusted with a sacred duty: to gather one brave Matoran from each village for a journey to Kini-Nui.",
    durationSeconds: 30 * 60, // 30 min
    id: 'mnog_summon_chroniclers_company',
    name: "Summon the Chronicler's Company",
    requirements: {
      matoran: ['Takua', 'Kopeke'],
      minLevel: 12,
    },
    rewards: {
      currency: 1500,
      cutscene: { cutsceneId: 'mnog_summon_chroniclers_company', type: 'visual_novel' },
      unlockCharacters: [
        {
          cost: 600,
          id: 'Hafu',
        },
      ],
      xpPerMatoran: 600,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_search_for_matoro'],
  },
  {
    description:
      "With the Chronicler's Company assembled, Takua leads the six Matoran across Mata Nui. In Ga-Koro, Nokama reveals the hidden water passage that leads deep inland toward Kini-Nui. Together, the company embarks on the sacred journey.",
    durationSeconds: 30 * 60, // 30 min
    id: 'mnog_journey_to_kini_nui_1',
    name: 'Passage to Kini-Nui',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      currency: 1200,
      cutscene: { cutsceneId: 'mnog_journey_to_kini_nui_1', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_summon_chroniclers_company'],
  },
  {
    description:
      "After passing through the secret waterfall passage, the Chronicler's Company treks across the forest toward Kini-Nui. Their progress is halted by a deep ravine. As the team debates their options, Tamaru proposes a daring method to get across.",
    durationSeconds: 30 * 60, // 30 minutes
    id: 'mnog_journey_to_kini_nui_2',
    name: 'Ravine Crossing',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      currency: 1000,
      cutscene: { cutsceneId: 'mnog_journey_to_kini_nui_2', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_journey_to_kini_nui_1'],
  },
  {
    description:
      "Having crossed the ravine, the Chronicler's Company makes steady progress toward Kini-Nui. But their path is blocked once more\u2014this time by a massive rockslide. The group must clear a way through or find a clever way around the rubble.",
    durationSeconds: 30 * 60, // 1 hour
    id: 'mnog_journey_to_kini_nui_3',
    name: 'Rockslide Ahead',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 12,
    },
    rewards: {
      currency: 1100,
      cutscene: { cutsceneId: 'mnog_journey_to_kini_nui_3', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_journey_to_kini_nui_2'],
  },
  {
    description:
      "Beyond the rockslide, the Chronicler's Company discovers a great stone gate carved in the shape of a solemn face. There's no obvious way through. The Matoran must find a way to unlock its hidden mechanism and continue their journey to Kini-Nui.",
    durationSeconds: 15 * 60, // 15 minutes
    id: 'mnog_journey_to_kini_nui_4',
    name: 'The Silent Gate',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      currency: 900,
      cutscene: { cutsceneId: 'mnog_journey_to_kini_nui_4', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_journey_to_kini_nui_3'],
  },
  {
    description:
      "The Chronicler's Company reaches the heart of Mata Nui and are tasked with its defense by the Toa themselves!",
    durationSeconds: 30 * 60, // 30 minutes
    id: 'mnog_kini_nui_arrival',
    name: 'Arrival at Kini-Nui',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 20,
    },
    rewards: {
      currency: 1500,
      cutscene: { cutsceneId: 'mnog_kini_nui_arrival', type: 'visual_novel' },
      xpPerMatoran: 2000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['story_kini_nui_gathering', 'mnog_journey_to_kini_nui_4'],
  },
  {
    description:
      "With the Toa descended into the depths beneath Kini-Nui, the Chronicler's Company remains behind to defend the shrine. Suddenly, waves of Rahi begin emerging from the jungle\u2014Makuta's final effort to stop the Toa. The Matoran must hold the line.",
    durationSeconds: 20 * 60, // 2 hours
    id: 'mnog_kini_nui_defense',
    name: 'Defense of Kini-Nui',
    requirements: {
      matoran: ['Takua', 'Hafu', 'Maku', 'Tamaru', 'Kopeke', 'Taipu', 'Kapura'],
      minLevel: 25,
    },
    rewards: {
      currency: 1800,
      cutscene: { cutsceneId: 'mnog_kini_nui_defense', type: 'visual_novel' },
      xpPerMatoran: 2000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_kini_nui_arrival'],
  },
  {
    description:
      "With the shrine defended and the villagers rallying to the Company's aid, Takua suddenly hears Gali's voice echoing in his mind, calling for help. Remembering an ancient tunnel deep in Onu-Wahi, he sets out alone, hoping to reach her in time.",
    durationSeconds: 20 * 60, // 1 hour
    id: 'mnog_gali_call',
    name: "Gali's Call",
    requirements: {
      matoran: ['Takua'],
      minLevel: 13,
    },
    rewards: {
      currency: 1000,
      cutscene: { cutsceneId: 'mnog_gali_call', type: 'visual_novel' },
      xpPerMatoran: 300,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_kini_nui_defense', 'story_kini_nui_descent'],
  },
  {
    description:
      'Navigating ancient tunnels beneath Kini-Nui, Takua quietly arrives at the edge of a vast chamber—Mangaia. There, he sees the Toa united in battle against the dark presence of Makuta. From the shadows, he watches the fate of Mata Nui unfold.',
    durationSeconds: 5 * 60, // 5 minutes
    id: 'mnog_witness_makuta_battle',
    name: 'Confronting Chaos',
    requirements: {
      matoran: ['Takua'],
      minLevel: 30,
    },
    rewards: {
      currency: 1600,
      cutscene: { cutsceneId: 'mnog_witness_makuta_battle', type: 'visual_novel' },
      xpPerMatoran: 800,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_gali_call'],
  },
  {
    description:
      "Having followed the Toa's journey to its end and witnessed their confrontation with Makuta, Takua emerges once again on the familiar shore of Ta-Wahi. There, Turaga Vakama awaits him. It is time to record the final chapter of this saga.",
    durationSeconds: 5 * 60, // 5 minutes
    id: 'mnog_return_to_shore',
    name: 'Return to the Shore',
    requirements: {
      matoran: ['Takua'],
      minLevel: 30,
    },
    rewards: {
      currency: 2000,
      cutscene: { cutsceneId: 'mnog_return_to_shore', type: 'visual_novel' },
      xpPerMatoran: 5000,
    },
    section: "The Chronicler's Journey",
    unlockedAfter: ['mnog_witness_makuta_battle'],
  },
];
