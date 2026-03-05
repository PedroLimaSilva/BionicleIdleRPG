import { Quest } from '../../types/Quests';

export const MOL_TAKANUVA_RISES_QUEST_ID = 'mol_takanuva_rises';
export const MOL_DEFEAT_OF_MAKUTA_QUEST_ID = 'mol_defeat_of_makuta';

export const MASK_OF_LIGHT_QUEST_LINE: Quest[] = [
  // ---------------------------------------------------------------------------
  // TALES OF THE MASKS
  // ---------------------------------------------------------------------------
  {
    id: 'tales_turaga_and_matoro',
    name: 'Secrets Beneath the Ice',
    description:
      'Turaga Vakama summons Matoro to the Sanctum, away from the other Matoran. He speaks of ancient secrets the Turaga have kept. He asks Matoro to translate for Nuju at a private Turaga council, where they will decide whether the time has come to reveal the truth.',
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Matoro'], minLevel: 20, items: [] },
    rewards: { xpPerMatoran: 2000, currency: 3000, loot: {} },
    unlockedAfter: ['bohrok_kal_naming_day'],
    section: 'Tales of the Masks',
  },
  {
    id: 'tales_kanohi_nuva_hunt',
    name: 'Quest for the Kanohi Nuva',
    description:
      'With their powers restored and new armor, the Toa Nuva set out to find six Kanohi Nuva masks. Each Toa faces trials alone: Tahu battles through volcanic caverns, Gali dives into sunken temples, Kopaka scales impossible peaks, Lewa braves the deepwood traps of Le-Wahi, Onua navigates collapsing mine shafts, and Pohatu crosses the scorching wastelands of Po-Wahi. Their newfound strength is tested at every turn, and tensions rise as each Toa pushes ahead on their own.',
    durationSeconds: 20 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 21,
      items: [],
    },
    rewards: { xpPerMatoran: 2500, currency: 3500, loot: {} },
    unlockedAfter: ['tales_turaga_and_matoro'],
    section: 'Tales of the Masks',
  },

  // ---------------------------------------------------------------------------
  // MASK OF LIGHT
  // ---------------------------------------------------------------------------
  {
    id: 'mol_discovery_of_avohkii',
    name: 'The Lava Tunnels',
    description: 'Jaller searches for Takua in Ta-Wahi before the upcoming kolhii game.',
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 21, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_discovery_of_avohkii' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['tales_kanohi_nuva_hunt'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_kolhii_tournament',
    name: 'The Kolhii Tournament',
    description:
      'The Toa Nuva, Turaga, and villagers from Po-Koro, Ga-Koro, and Ta-Koro fill the stands of the Ta-Koro kolhii field. Three teams take the field: Takua and Jaller, Hewkii and Hafu, and Hahli and Macku.',
    durationSeconds: 10 * 60,
    requirements: {
      matoran: ['Jaller', 'Takua', 'Hahli', 'Hewkii', 'Hafu'],
      minLevel: 21,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_kolhii_tournament' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['mol_discovery_of_avohkii'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_avohkii_prophecy',
    name: 'The Prophecy of the Seventh Toa',
    description: "A special meeting is held at Tahu's suva to discuss the mask.",
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 21, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_avohkii_prophecy' },
      xpPerMatoran: 2500,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['mol_kolhii_tournament'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_fall_of_ta_koro',
    name: 'The Fall of Ta-Koro',
    description:
      "At Kini-Nui, Gali meditates and spots a new Spirit Star—representing the Seventh Toa's arrival.",
    durationSeconds: 15 * 60,
    requirements: { matoran: ['Toa_Gali_Nuva'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_fall_of_ta_koro' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_avohkii_prophecy'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_le_wahi_ash_bear',
    name: 'The Ash Bear',
    description: 'On their way to Le-Koro, Jaller and Takua encounter Graalok the Ash Bear.',
    durationSeconds: 10 * 60,
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_le_wahi_ash_bear' },
      xpPerMatoran: 2800,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: ['mol_fall_of_ta_koro'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_ko_wahi_pursuit',
    name: 'The Frozen Lake',
    description: 'Jaller and Takua meet Toa Nuva Kopaka in a Ko-Koro snowstorm.',
    durationSeconds: 12 * 60,
    requirements: { matoran: ['Takua', 'Jaller', 'Toa_Kopaka_Nuva'], minLevel: 22, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_ko_wahi_pursuit' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['mol_le_wahi_ash_bear'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_onu_koro_highway',
    name: 'The Shadow in the Tunnels',
    description: 'The Matoran continue their journey through the Onu-Koro Highway.',
    durationSeconds: 15 * 60,
    requirements: {
      matoran: ['Takua', 'Jaller'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_onu_koro_highway' },
      xpPerMatoran: 3500,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: ['mol_ko_wahi_pursuit'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_onu_koro_battle',
    name: 'The Shadows over Onu Koro',
    description: 'Takua reaches Onu-Koro without Jaller. He is met by Toa Nuva Pohatu and Onua.',
    durationSeconds: 15 * 60,
    requirements: {
      matoran: ['Takua', 'Toa_Pohatu_Nuva', 'Toa_Onua_Nuva'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_onu_koro_battle' },
      xpPerMatoran: 3500,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: ['mol_onu_koro_highway'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_tahu_poisoned',
    name: 'Healing the Fire',
    description: 'Having restrained Tahu, the Toa Nuva attempt to heal his poison.',
    durationSeconds: 12 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva'],
      minLevel: 22,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_tahu_poisoned' },
      xpPerMatoran: 3500,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: ['mol_onu_koro_battle'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_takua_jaller_reunion',
    name: 'Reunion',
    description: 'Jaller, alone, presses on with his search for the Seventh Toa.',
    durationSeconds: 20 * 60,
    requirements: {
      matoran: ['Takua', 'Jaller'],
      minLevel: 23,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takua_jaller_reunion' },
      xpPerMatoran: 4000,
      currency: 5500,
      loot: {},
    },
    unlockedAfter: ['mol_tahu_poisoned'],
    section: 'Mask of Light',
  },
  {
    id: 'mol_battle_of_kini_nui',
    name: "Jaller's Sacrifice",
    description: "The Matoran finally reach the Mask's destination: Kini-Nui.",
    durationSeconds: 10 * 60,
    requirements: {
      matoran: [
        'Takua',
        'Jaller',
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 23,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_battle_of_kini_nui' },
      xpPerMatoran: 4000,
      currency: 5500,
      loot: {},
    },
    unlockedAfter: ['mol_takua_jaller_reunion'],
    section: 'Mask of Light',
  },
  {
    id: MOL_TAKANUVA_RISES_QUEST_ID,
    name: 'The Seventh Toa',
    description: 'Takua, determined to avenge his friend, accepts his duty.',
    durationSeconds: 8 * 60,
    requirements: { matoran: ['Takua'], minLevel: 23, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_takanuva_rises' },
      xpPerMatoran: 5000,
      currency: 6000,
      loot: {},
    },
    unlockedAfter: ['mol_battle_of_kini_nui'],
    section: 'Mask of Light',
  },
  {
    id: MOL_DEFEAT_OF_MAKUTA_QUEST_ID,
    name: 'Into the Darkness',
    description: 'Takanuva and the Toa Nuva prepare to confront Makuta.',
    durationSeconds: 30 * 60,
    requirements: { matoran: ['Takanuva', 'Hahli'], minLevel: 24, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_defeat_of_makuta' },
      xpPerMatoran: 6000,
      currency: 7000,
      loot: {},
    },
    unlockedAfter: [MOL_TAKANUVA_RISES_QUEST_ID],
    section: 'Mask of Light',
  },
  {
    id: 'mol_rediscovery_of_metru_nui',
    name: 'The City of Legends',
    description:
      'Turaga Vakama gives a lesson on the Three Virtues.',
    durationSeconds: 12 * 60,
    requirements: { matoran: ['Takanuva', 'Hahli', 'Jaller'], minLevel: 24, items: [] },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'mol_rediscovery_of_metru_nui' },
      xpPerMatoran: 4000,
      currency: 5000,
      loot: {},
    },
    unlockedAfter: [MOL_DEFEAT_OF_MAKUTA_QUEST_ID],
    section: 'Mask of Light',
  },
];
