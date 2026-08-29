import { Quest } from '../../types/Quests';

export const MOL_TAKANUVA_RISES_QUEST_ID = 'mol_takanuva_rises';
export const MOL_DEFEAT_OF_MAKUTA_QUEST_ID = 'mol_defeat_of_makuta';
/** Turaga reveal Metru Nui in the chasm — opens the Metru Nui saga. */
export const MOL_REDISCOVERY_OF_METRU_NUI_QUEST_ID = 'mol_rediscovery_of_metru_nui';

export const MASK_OF_LIGHT_QUEST_LINE: Quest[] = [
  // ---------------------------------------------------------------------------
  // TALES OF THE MASKS
  // ---------------------------------------------------------------------------
  {
    description:
      'Turaga Vakama summons Matoro to the Sanctum, away from the other Matoran. He speaks of ancient secrets the Turaga have kept. He asks Matoro to translate for Nuju at a private Turaga council, where they will decide whether the time has come to reveal the truth.',
    durationSeconds: 8 * 60,
    id: 'tales_turaga_and_matoro',
    name: 'Secrets Beneath the Ice',
    requirements: { matoran: ['Matoro'], minLevel: 20 },
    rewards: { currency: 3000, xpPerMatoran: 2000 },
    section: 'Tales of the Masks',
    unlockedAfter: ['bohrok_kal_naming_day'],
  },
  {
    description:
      'With their powers restored and new armor, the Toa Nuva set out to find six Kanohi Nuva masks. Each Toa faces trials alone: Tahu battles through volcanic caverns, Gali dives into sunken temples, Kopaka scales impossible peaks, Lewa braves the deepwood traps of Le-Wahi, Onua navigates collapsing mine shafts, and Pohatu crosses the scorching wastelands of Po-Wahi. Their newfound strength is tested at every turn, and tensions rise as each Toa pushes ahead on their own.',
    durationSeconds: 20 * 60,
    id: 'tales_kanohi_nuva_hunt',
    name: 'Quest for the Kanohi Nuva',
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
    },
    rewards: { currency: 3500, xpPerMatoran: 2500 },
    section: 'Tales of the Masks',
    unlockedAfter: ['tales_turaga_and_matoro'],
  },

  // ---------------------------------------------------------------------------
  // MASK OF LIGHT
  // ---------------------------------------------------------------------------
  {
    description: 'Jaller searches for Takua in Ta-Koro before the upcoming kolhii game.',
    durationSeconds: 8 * 60,
    id: 'mol_discovery_of_avohkii',
    name: 'The Lava Tunnels',
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 21 },
    rewards: {
      currency: 3500,
      cutscene: { cutsceneId: 'mol_discovery_of_avohkii', type: 'visual_novel' },
      xpPerMatoran: 2500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['tales_kanohi_nuva_hunt'],
  },
  {
    description:
      'The Toa Nuva, Turaga, and villagers from Po-Koro, Ga-Koro, and Ta-Koro fill the stands of the Ta-Koro kolhii field. Three teams take the field: Takua and Jaller, Hewkii and Hafu, and Hahli and Macku.',
    durationSeconds: 10 * 60,
    id: 'mol_kolhii_tournament',
    name: 'The Kolhii Tournament',
    requirements: {
      matoran: ['Jaller', 'Takua', 'Hahli', 'Hewkii', 'Hafu'],
      minLevel: 21,
    },
    rewards: {
      currency: 3500,
      cutscene: { cutsceneId: 'mol_kolhii_tournament', type: 'visual_novel' },
      xpPerMatoran: 2500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_discovery_of_avohkii'],
  },
  {
    description: "A special meeting is held at Tahu's suva to discuss the mask.",
    durationSeconds: 8 * 60,
    id: 'mol_avohkii_prophecy',
    name: 'The Prophecy of the Seventh Toa',
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 21 },
    rewards: {
      currency: 3500,
      cutscene: { cutsceneId: 'mol_avohkii_prophecy', type: 'visual_novel' },
      xpPerMatoran: 2500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_kolhii_tournament'],
  },
  {
    description:
      "At Kini-Nui, Gali meditates and spots a new Spirit Star—representing the Seventh Toa's arrival.",
    durationSeconds: 15 * 60,
    id: 'mol_fall_of_ta_koro',
    name: 'The Fall of Ta-Koro',
    requirements: { matoran: ['Toa_Gali_Nuva'], minLevel: 22 },
    rewards: {
      currency: 4500,
      cutscene: { cutsceneId: 'mol_fall_of_ta_koro', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_avohkii_prophecy'],
  },
  {
    description: 'On their way to Le-Koro, Jaller and Takua encounter more than just bugs.',
    durationSeconds: 10 * 60,
    id: 'mol_le_wahi_ash_bear',
    name: 'Flight of the Gukko',
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 22 },
    rewards: {
      currency: 4000,
      cutscene: { cutsceneId: 'mol_le_wahi_ash_bear', type: 'visual_novel' },
      xpPerMatoran: 2800,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_fall_of_ta_koro'],
  },
  {
    description: 'Jaller and Takua meet Toa Kopaka Nuva in a Ko-Koro snowstorm.',
    durationSeconds: 12 * 60,
    id: 'mol_ko_wahi_arrival',
    name: 'The Frozen Wahi',
    requirements: { matoran: ['Takua', 'Jaller'], minLevel: 22 },
    rewards: {
      currency: 4500,
      cutscene: { cutsceneId: 'mol_ko_wahi_arrival', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_le_wahi_ash_bear'],
  },
  {
    description: "Tahu's poison from the fight with the Rahkshi threatens the Toa's unity.",
    durationSeconds: 12 * 60,
    id: 'mol_tahu_worsens',
    name: 'The Poison Takes Hold',
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Lewa_Nuva'],
      minLevel: 22,
    },
    rewards: {
      currency: 4500,
      cutscene: { cutsceneId: 'mol_tahu_worsens', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_ko_wahi_arrival'],
  },
  {
    description: 'Toa Kopaka Nuva leads Jaller and Takua to Ko-Koro.',
    durationSeconds: 12 * 60,
    id: 'mol_ko_wahi_pursuit',
    name: 'The Frozen Lake',
    requirements: { matoran: ['Takua', 'Jaller', 'Toa_Kopaka_Nuva'], minLevel: 22 },
    rewards: {
      currency: 4500,
      cutscene: { cutsceneId: 'mol_ko_wahi_pursuit', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_ko_wahi_arrival'],
  },
  {
    description: 'The Matoran continue their journey through the Onu-Koro Highway.',
    durationSeconds: 15 * 60,
    id: 'mol_onu_koro_highway',
    name: 'The Shadow in the Tunnels',
    requirements: {
      matoran: ['Takua', 'Jaller'],
      minLevel: 22,
    },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'mol_onu_koro_highway', type: 'visual_novel' },
      xpPerMatoran: 3500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_ko_wahi_pursuit'],
  },
  {
    description: 'Takua reaches Onu-Koro without Jaller. He is met by Toa Nuva Pohatu and Onua.',
    durationSeconds: 15 * 60,
    id: 'mol_onu_koro_battle',
    name: 'The Shadows over Onu-Koro',
    requirements: {
      matoran: ['Takua', 'Toa_Pohatu_Nuva', 'Toa_Onua_Nuva'],
      minLevel: 22,
    },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'mol_onu_koro_battle', type: 'visual_novel' },
      xpPerMatoran: 3500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_onu_koro_highway'],
  },
  {
    description: 'The Rahkshi have taken over Onu-Koro.',
    durationSeconds: 15 * 60,
    id: 'mol_onu_koro_part2',
    name: 'The Shadows over Onu-Koro — Part 2',
    requirements: {
      matoran: [
        'Takua',
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 22,
    },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'mol_onu_koro_part2', type: 'visual_novel' },
      xpPerMatoran: 3500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_onu_koro_battle'],
  },
  {
    description: 'Having restrained Tahu, the Toa Nuva attempt to heal his poison.',
    durationSeconds: 12 * 60,
    id: 'mol_tahu_poisoned',
    name: 'Healing the Fire',
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva'],
      minLevel: 22,
    },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'mol_tahu_poisoned', type: 'visual_novel' },
      xpPerMatoran: 3500,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_onu_koro_part2'],
  },
  {
    description: 'Jaller, alone, presses on with his search for the Seventh Toa.',
    durationSeconds: 20 * 60,
    id: 'mol_takua_jaller_reunion',
    name: 'Reunion',
    requirements: {
      matoran: ['Takua', 'Jaller'],
      minLevel: 23,
    },
    rewards: {
      currency: 5500,
      cutscene: { cutsceneId: 'mol_takua_jaller_reunion', type: 'visual_novel' },
      xpPerMatoran: 4000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_tahu_poisoned'],
  },
  {
    description: "The Matoran finally reach the Mask's destination: Kini-Nui.",
    durationSeconds: 10 * 60,
    id: 'mol_battle_of_kini_nui',
    name: "Jaller's Sacrifice",
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
    },
    rewards: {
      currency: 5500,
      cutscene: { cutsceneId: 'mol_battle_of_kini_nui', type: 'visual_novel' },
      xpPerMatoran: 4000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_takua_jaller_reunion'],
  },
  {
    description: 'Takua, determined to avenge his friend, accepts his duty.',
    durationSeconds: 8 * 60,
    id: MOL_TAKANUVA_RISES_QUEST_ID,
    name: 'The Seventh Toa',
    requirements: { matoran: ['Takua'], minLevel: 23 },
    rewards: {
      currency: 6000,
      cutscene: { cutsceneId: 'mol_takanuva_rises', type: 'visual_novel' },
      xpPerMatoran: 5000,
    },
    section: 'Mask of Light',
    unlockedAfter: ['mol_battle_of_kini_nui'],
  },
  {
    description: 'Takanuva and the Toa Nuva prepare to confront Makuta.',
    durationSeconds: 30 * 60,
    id: MOL_DEFEAT_OF_MAKUTA_QUEST_ID,
    name: 'Into the Darkness',
    requirements: { matoran: ['Takanuva', 'Hahli'], minLevel: 24 },
    rewards: {
      currency: 7000,
      cutscene: { cutsceneId: 'mol_defeat_of_makuta', type: 'visual_novel' },
      xpPerMatoran: 6000,
    },
    section: 'Mask of Light',
    unlockedAfter: [MOL_TAKANUVA_RISES_QUEST_ID],
  },
  {
    description: 'Turaga Vakama gives a lesson on the Three Virtues.',
    durationSeconds: 12 * 60,
    id: MOL_REDISCOVERY_OF_METRU_NUI_QUEST_ID,
    name: 'The City of Legends',
    requirements: { matoran: ['Takanuva', 'Hahli', 'Jaller'], minLevel: 24 },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'mol_rediscovery_of_metru_nui', type: 'visual_novel' },
      xpPerMatoran: 4000,
    },
    section: 'Mask of Light',
    unlockedAfter: [MOL_DEFEAT_OF_MAKUTA_QUEST_ID],
  },
];
