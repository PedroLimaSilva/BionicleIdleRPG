import { Quest } from '../../types/Quests';

export const MASK_HUNT: Quest[] = [
  {
    description:
      'After a thousand years of waiting, six mysterious canisters crash upon the shores of Mata Nui. From within emerge six powerful beings—heroes foretold in prophecy. With no memory of their past, each Toa seeks out their Turaga, who reveals their destiny: to find the Masks of Power and unite against the shadow of Makuta.',
    durationSeconds: 60,
    id: 'story_toa_arrival',
    name: 'The Arrival of the Toa',
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
    },
    rewards: {
      currency: 200,
      cutscene: { cutsceneId: 'story_toa_arrival', type: 'visual_novel' },
      unlockCharacters: [
        { cost: 250, id: 'Toa_Tahu' },
        { cost: 250, id: 'Toa_Gali' },
        { cost: 250, id: 'Toa_Kopaka' },
        { cost: 250, id: 'Toa_Lewa' },
        { cost: 250, id: 'Toa_Onua' },
        { cost: 250, id: 'Toa_Pohatu' },
      ],
      xpPerMatoran: 100,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: [],
  },
  {
    description: 'After Kopaka lands on Ko-Wahi, he discovers his duty.',
    durationSeconds: 480, // 8 minutes
    id: 'maskhunt_kopaka_matoro_icecliff',
    name: 'The Cliffside Encounter',
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 1,
    },
    rewards: {
      currency: 400,
      cutscene: { cutsceneId: 'maskhunt_kopaka_matoro_icecliff', type: 'visual_novel' },
      xpPerMatoran: 450,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_arrival'],
  },
  {
    description: 'After meeting Turaga Nuju, Kopaka sets out to the Place of Far-Seeing.',
    durationSeconds: 480, // 8 minutes
    id: 'maskhunt_kopaka_pohatu_icecliff',
    name: 'The Place of Far-Seeing',
    requirements: {
      matoran: ['Toa_Kopaka', 'Toa_Pohatu'],
      minLevel: 1,
    },
    rewards: {
      currency: 400,
      cutscene: { cutsceneId: 'maskhunt_kopaka_pohatu_icecliff', type: 'visual_novel' },
      xpPerMatoran: 450,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_kopaka_matoro_icecliff'],
  },
  {
    description:
      'Following a chance encounter between Kopaka and Pohatu, they find the other four Toa gathered near the slopes of Mount Ihu.',
    durationSeconds: 30 * 60, // 30 minutes
    id: 'story_toa_council',
    name: 'The Toa Council',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 1,
    },
    rewards: {
      currency: 500,
      cutscene: { cutsceneId: 'story_toa_council', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['mnog_tahu_unlock_01', 'maskhunt_kopaka_pohatu_icecliff'],
  },
  {
    description:
      'After the Toa Council, Tahu ventures alone and Jala tells him of a deep Onu-Wahi cave rumored to house the Mask of X-Ray Vision. Within the darkness, he faces vicious Rahi corrupted by Makuta’s influence. He must fight alone, his flame the only light against the shadows.',
    durationSeconds: 30 * 60, // 30 minutes
    id: 'maskhunt_tahu_cave_akaku',
    name: 'The Shadows Below',
    requirements: {
      matoran: ['Toa_Tahu'],
      minLevel: 5,
    },
    rewards: {
      currency: 700,
      xpPerMatoran: 400,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_council'],
  },
  {
    description:
      'Against the better judgment of his peers, Lewa dives into the caverns of Onu-Wahi, drawn by rumors of a powerful Kanohi hidden deep within. In the oppressive darkness, he finds not only the Pakari but also a hulking Rahi warped by Makuta’s corruption. With agility and cunning as his only allies, Lewa must overcome brute force to claim the Mask of Strength.',
    durationSeconds: 540, // 9 minutes
    id: 'maskhunt_lewa_pakari',
    name: 'Strength Below the Surface',
    requirements: {
      matoran: ['Toa_Lewa'],
      minLevel: 5,
    },
    rewards: {
      currency: 900,
      xpPerMatoran: 500,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_council'],
  },
  {
    description:
      'Alone once more, Kopaka treks into the coldest reaches of Ko-Wahi, where whispers on the wind speak of two hidden Kanohi: the Mahiki and the Huna. As he collects them from icebound ruins, his Akaku detects a lone Matoran out in the snow, being hunted by a Muaka.',
    durationSeconds: 780, // 13 minutes
    id: 'maskhunt_kopaka_mahiki_huna',
    name: 'Echoes in the Snow',
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 6,
    },
    rewards: {
      currency: 1300,
      xpPerMatoran: 750,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_council'],
  },
  {
    description:
      'Driven by tales of a hidden Kanohi beneath the jungle, Lewa follows a winding tunnel into a vast subterranean lake deep within Le-Wahi. As he swims to the center of the cavern, a massive Nui-Jaga erupts from the shadows. In the battle that follows, Lewa is nearly dragged beneath the surface, but with sheer determination and agility, he defeats the beast and emerges with the Kakama in hand.',
    durationSeconds: 600, // 10 minutes
    id: 'maskhunt_lewa_kakama_komau',
    name: 'Echoes Beneath the Lake',
    requirements: {
      matoran: ['Toa_Lewa'],
      minLevel: 7,
    },
    rewards: {
      currency: 1000,
      xpPerMatoran: 550,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_lewa_pakari'],
  },
  {
    description:
      'After the Toa Council, Onua begins his journey through the thick jungle of Le-Wahi. He uncovers two Kanohi—Hau and Matatu—resting on top of trees. Onua must use his strength and caution to secure the masks.',
    durationSeconds: 540, // 9 minutes
    id: 'maskhunt_onua_matatu_hau',
    name: 'Echoes of the Forest',
    requirements: {
      matoran: ['Toa_Onua'],
      minLevel: 5,
    },
    rewards: {
      currency: 800,
      xpPerMatoran: 500,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_council'],
  },
  {
    description:
      'After his success, Onua encounters a lone Le-Matoran who speaks of his friends trapped in a Nui-Rama nest. Without hesitation, Onua sets out, determined to help—even if it means leaving his mask hunt behind for now.',
    durationSeconds: 300, // 5 minutes
    id: 'maskhunt_onua_jungle_rumor',
    name: 'The Rumor from the Canopy',
    requirements: {
      matoran: ['Toa_Onua'],
      minLevel: 6,
    },
    rewards: {
      currency: 600,
      xpPerMatoran: 800,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_onua_matatu_hau'],
  },
  {
    description:
      'Gali travels far from her watery home to the rocky peaks of Po-Wahi, following whispers of a Kanohi hidden in the mountains. She discovers the Mask of Levitation embedded in a cliffside shrine—but as she reaches for it, the mountain begins to collapse. Using the Miru to slow her fall, Gali survives the landslide, only to land deep within a ravine—trapped and surrounded by corrupted Rahi.',
    durationSeconds: 600, // 10 minutes
    id: 'maskhunt_gali_miru',
    name: 'Windswept Resolve',
    requirements: {
      matoran: ['Toa_Gali'],
      minLevel: 6,
    },
    rewards: {
      currency: 950,
      xpPerMatoran: 550,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['mnog_restore_ga_koro'],
  },
  {
    description:
      'Trapped in a narrow Po-Wahi canyon after a landslide, Gali fights off wave after wave of corrupted Rahi. Her elemental power is weakening. Then—a column of fire erupts at the mouth of the gorge.',
    durationSeconds: 480, // 8 minutes
    id: 'maskhunt_gali_rescue',
    name: 'Fire in the Ravine',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali'],
      minLevel: 6,
    },
    rewards: {
      currency: 1100,
      cutscene: { cutsceneId: 'maskhunt_gali_rescue', type: 'visual_novel' },
      xpPerMatoran: 800,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_gali_miru', 'maskhunt_tahu_cave_akaku'],
  },
  {
    description:
      'Determined to grow stronger, Kopaka travels to the volcanic region of Ta-Wahi in search of the Kanohi Pakari. Amid rivers of fire and molten stone, he retrieves the mask—but is suddenly struck by a falling chunk of ice, conjured unnaturally in the heat. As darkness closes in, a vivid vision overwhelms him: two towering beings—Akamai and Wairuha—locked in battle. Kopaka awakens to find Lewa dragging him to safety. Shaken, he suspects the vision was not a prophecy, but a manipulation—perhaps from the Makuta himself. Lewa relays word from Onua: the Toa must gather once more.',
    durationSeconds: 660, // 11 minutes
    id: 'maskhunt_kopaka_pakari',
    name: 'The Heat of Insight',
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 6,
    },
    rewards: {
      currency: 1100,
      xpPerMatoran: 600,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['mnog_search_for_matoro', 'mnog_lewa_v_onua'],
  },
  {
    description:
      'At Onua’s urging, the six Toa gather once more—battered, wiser, and uncertain. The masks they have found weigh heavily, and so do the visions.',
    durationSeconds: 120, // 2 minutes
    id: 'story_toa_second_council',
    name: 'Council of Unity',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 6,
    },
    rewards: {
      currency: 100,
      cutscene: { cutsceneId: 'story_toa_second_council', type: 'visual_novel' },
      xpPerMatoran: 800,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_kopaka_pakari', 'maskhunt_gali_rescue'],
  },
  {
    description:
      'Following the plan forged at the Council, Gali, Kopaka, and Onua dive beneath the crashing surf off the Po-Koro shoreline, each wearing a Kanohi Kaukau. Below, an underwater shrine holds Tahu’s Miru.',
    durationSeconds: 720, // 12 minutes
    id: 'maskhunt_tahu_miru',
    name: 'Depths of the Shoreline',
    requirements: {
      matoran: ['Toa_Gali', 'Toa_Kopaka', 'Toa_Onua'],
      minLevel: 10,
    },
    rewards: {
      currency: 1200,
      cutscene: { cutsceneId: 'maskhunt_tahu_miru', type: 'visual_novel' },
      xpPerMatoran: 700,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    description:
      'Pohatu’s Kanohi Kaukau is found not beneath water, but atop the highest bluff in Po-Wahi. Harsh winds and sheer cliffs guard the approach.',
    durationSeconds: 660, // 11 minutes
    id: 'maskhunt_pohatu_kaukau_bluff',
    name: 'The Bluff Above All',
    requirements: {
      matoran: ['Toa_Pohatu', 'Toa_Kopaka', 'Toa_Lewa'],
      minLevel: 8,
    },
    rewards: {
      currency: 1100,
      cutscene: { cutsceneId: 'maskhunt_pohatu_kaukau_bluff', type: 'visual_novel' },
      xpPerMatoran: 650,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    description:
      'In the canopy of Le-Wahi, Tahu spots his Kakama lodged high in a massive tree. Gali and Onua watch from below.',
    durationSeconds: 600, // 10 minutes
    id: 'maskhunt_forest_tahu_kakama',
    name: 'Fire in the Trees',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Onua'],
      minLevel: 10,
    },
    rewards: {
      currency: 1200,
      cutscene: { cutsceneId: 'maskhunt_forest_tahu_kakama', type: 'visual_novel' },
      xpPerMatoran: 700,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    description:
      'Outside a massive Nui-Jaga nest, the six Toa assemble to plan their attack. The clicking of armored scorpion tails echoes from within.',
    durationSeconds: 720, // 12 minutes
    id: 'story_nui_jaga_nest',
    name: 'Nest of Discord',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 10,
    },
    rewards: {
      currency: 1400,
      cutscene: { cutsceneId: 'story_nui_jaga_nest', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: [
      'maskhunt_tahu_miru',
      'maskhunt_forest_tahu_kakama',
      'maskhunt_pohatu_kaukau_bluff',
    ],
  },
  {
    description:
      'With lessons hard-won and trust forged in battle, the six Toa embark on their final coordinated mask hunt. Across the island, they move as one.',
    durationSeconds: 900, // 15 minutes
    id: 'maskhunt_final_collection',
    name: 'The Final Hunt',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 11,
    },
    rewards: {
      currency: 1600,
      cutscene: { cutsceneId: 'maskhunt_final_collection', type: 'visual_novel' },
      xpPerMatoran: 2000,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['story_nui_jaga_nest'],
  },
  {
    description:
      'With every Kanohi collected, the six Toa journey to the sacred temple of Kini-Nui. Ancient carvings line the walls, depicting prophecy and shadow. The island is eerily quiet.',
    durationSeconds: 300, // 5 minutes
    id: 'story_kini_nui_gathering',
    name: 'The Path Below',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
    },
    rewards: {
      currency: 1000,
      cutscene: { cutsceneId: 'story_kini_nui_gathering', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['maskhunt_final_collection'],
  },
  {
    description:
      'With the Chronicler’s Company standing watch above, the six Toa descend into the ancient tunnels beneath Kini-Nui. The air grows colder, and the light from the surface fades behind them. Whispers echo through the stone — memories of long-forgotten battles and shadows yet to come. Though the path is unclear, one thing is certain: they will face whatever lies beneath, together.',
    durationSeconds: 300, // 5 minutes
    id: 'story_kini_nui_descent',
    name: 'Descent into Darkness',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
    },
    rewards: {
      currency: 100,
      cutscene: { cutsceneId: 'story_kini_nui_descent', type: 'visual_novel' },
      xpPerMatoran: 1000,
    },
    section: 'Arrival of the Toa',
    unlockedAfter: ['mnog_kini_nui_arrival'],
  },
];
