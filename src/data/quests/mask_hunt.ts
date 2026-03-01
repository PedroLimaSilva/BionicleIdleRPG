import { Quest } from '../../types/Quests';
import { GameItemId } from '../loot';

export const MASK_HUNT: Quest[] = [
  {
    id: 'story_toa_arrival',
    name: 'The Arrival of the Toa',
    description:
      'After a thousand years of waiting, six mysterious canisters crash upon the shores of Mata Nui. From within emerge six powerful beings—heroes foretold in prophecy. With no memory of their past, each Toa seeks out their Turaga, who reveals their destiny: to find the Masks of Power and unite against the shadow of Makuta.',
    durationSeconds: 60,
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'story_toa_arrival' },
      unlockCharacters: [
        { id: 'Toa_Tahu', cost: 100, requiredItems: [] },
        { id: 'Toa_Gali', cost: 100, requiredItems: [] },
        { id: 'Toa_Kopaka', cost: 100, requiredItems: [] },
        { id: 'Toa_Lewa', cost: 100, requiredItems: [] },
        { id: 'Toa_Onua', cost: 100, requiredItems: [] },
        { id: 'Toa_Pohatu', cost: 100, requiredItems: [] },
      ],
      xpPerMatoran: 100,
      currency: 200,
      loot: {},
    },
    unlockedAfter: [],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_kopaka_matoro_icecliff',
    name: 'The Cliffside Encounter',
    description: 'After Kopaka lands on Ko-Wahi, he discovers his duty.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 1,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_kopaka_matoro_icecliff' },
      xpPerMatoran: 450,
      currency: 400,
      loot: {
        [GameItemId.IceChip]: 100,
        [GameItemId.StoneBlock]: 100,
      },
    },
    unlockedAfter: ['story_toa_arrival'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_kopaka_pohatu_icecliff',
    name: 'The Place of Far-Seeing',
    description: 'After meeting Turaga Nuju, Kopaka sets out to the Place of Far-Seeing.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Kopaka', 'Toa_Pohatu'],
      minLevel: 1,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_kopaka_pohatu_icecliff' },
      xpPerMatoran: 450,
      currency: 400,
      loot: {
        [GameItemId.IceChip]: 100,
        [GameItemId.StoneBlock]: 100,
      },
    },
    unlockedAfter: ['maskhunt_kopaka_matoro_icecliff'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'story_toa_council',
    name: 'The Toa Council',
    description:
      'Following a chance encounter between Kopaka and Pohatu, they find the other four Toa gathered near the slopes of Mount Ihu.',
    durationSeconds: 30 * 60, // 2 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 1,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 500,
      cutscene: { type: 'visual_novel', cutsceneId: 'story_toa_council' },
      loot: {},
    },
    unlockedAfter: ['mnog_tahu_unlock_01', 'maskhunt_kopaka_pohatu_icecliff'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_tahu_cave_akaku',
    name: 'The Shadows Below',
    description:
      'After the Toa Council, Tahu ventures alone and Jala tells him of a deep Onu-Wahi cave rumored to house the Mask of X-Ray Vision. Within the darkness, he faces vicious Rahi corrupted by Makuta’s influence. He must fight alone, his flame the only light against the shadows.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Toa_Tahu'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      xpPerMatoran: 400,
      currency: 700,
      loot: {
        [GameItemId.LightStone]: 100,
        [GameItemId.BurnishedAlloy]: 50,
      },
    },
    unlockedAfter: ['story_toa_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_lewa_pakari',
    name: 'Strength Below the Surface',
    description:
      'Against the better judgment of his peers, Lewa dives into the caverns of Onu-Wahi, drawn by rumors of a powerful Kanohi hidden deep within. In the oppressive darkness, he finds not only the Pakari but also a hulking Rahi warped by Makuta’s corruption. With agility and cunning as his only allies, Lewa must overcome brute force to claim the Mask of Strength.',
    durationSeconds: 540, // 9 minutes
    requirements: {
      matoran: ['Toa_Lewa'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      xpPerMatoran: 500,
      currency: 900,
      loot: {
        [GameItemId.LightStone]: 60,
        [GameItemId.BiolumeThread]: 30,
      },
    },
    unlockedAfter: ['story_toa_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_kopaka_mahiki_huna',
    name: 'Echoes in the Snow',
    description:
      'Alone once more, Kopaka treks into the coldest reaches of Ko-Wahi, where whispers on the wind speak of two hidden Kanohi: the Mahiki and the Huna. As he collects them from icebound ruins, his Akaku detects a lone Matoran out in the snow, being hunted by a Muaka.',
    durationSeconds: 780, // 13 minutes
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 750,
      currency: 1300,
      loot: {
        [GameItemId.FrostChisel]: 120,
        [GameItemId.IceChip]: 240,
      },
    },
    unlockedAfter: ['story_toa_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_lewa_kakama_komau',
    name: 'Echoes Beneath the Lake',
    description:
      'Driven by tales of a hidden Kanohi beneath the jungle, Lewa follows a winding tunnel into a vast subterranean lake deep within Le-Wahi. As he swims to the center of the cavern, a massive Nui-Jaga erupts from the shadows. In the battle that follows, Lewa is nearly dragged beneath the surface, but with sheer determination and agility, he defeats the beast and emerges with the Kakama in hand.',
    durationSeconds: 600, // 10 minutes
    requirements: {
      matoran: ['Toa_Lewa'],
      minLevel: 7,
      items: [],
    },
    rewards: {
      xpPerMatoran: 550,
      currency: 1000,
      loot: {
        [GameItemId.FeatherTufts]: 80,
        [GameItemId.JungleResin]: 40,
      },
    },
    unlockedAfter: ['maskhunt_lewa_pakari'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_onua_matatu_hau',
    name: 'Echoes of the Forest',
    description:
      'After the Toa Council, Onua begins his journey through the thick jungle of Le-Wahi. He uncovers two Kanohi—Hau and Matatu—resting on top of trees. Onua must use his strength and caution to secure the masks.',
    durationSeconds: 540, // 9 minutes
    requirements: {
      matoran: ['Toa_Onua'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      xpPerMatoran: 500,
      currency: 800,
      loot: {
        [GameItemId.FeatherTufts]: 100,
        [GameItemId.JungleResin]: 50,
      },
    },
    unlockedAfter: ['story_toa_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_onua_jungle_rumor',
    name: 'The Rumor from the Canopy',
    description:
      'After his success, Onua encounters a lone Le-Matoran who speaks of his friends trapped in a Nui-Rama nest. Without hesitation, Onua sets out, determined to help—even if it means leaving his mask hunt behind for now.',
    durationSeconds: 300, // 5 minutes
    requirements: {
      matoran: ['Toa_Onua'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 800,
      currency: 600,
    },
    unlockedAfter: ['maskhunt_onua_matatu_hau'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_gali_miru',
    name: 'Windswept Resolve',
    description:
      'Gali travels far from her watery home to the rocky peaks of Po-Wahi, following whispers of a Kanohi hidden in the mountains. She discovers the Mask of Levitation embedded in a cliffside shrine—but as she reaches for it, the mountain begins to collapse. Using the Miru to slow her fall, Gali survives the landslide, only to land deep within a ravine—trapped and surrounded by corrupted Rahi.',
    durationSeconds: 600, // 10 minutes
    requirements: {
      matoran: ['Toa_Gali'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 550,
      currency: 950,
      loot: {
        [GameItemId.StoneBlock]: 80,
        [GameItemId.CarvingTool]: 40,
      },
    },
    unlockedAfter: ['mnog_restore_ga_koro'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_gali_rescue',
    name: 'Fire in the Ravine',
    description:
      'Trapped in a narrow Po-Wahi canyon after a landslide, Gali fights off wave after wave of corrupted Rahi. Her elemental power is weakening. Then—a column of fire erupts at the mouth of the gorge.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_gali_rescue' },
      xpPerMatoran: 800,
      currency: 1100,
      loot: {
        [GameItemId.GaPearl]: 60,
        [GameItemId.BurnishedAlloy]: 60,
      },
    },
    unlockedAfter: ['maskhunt_gali_miru', 'maskhunt_tahu_cave_akaku'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_kopaka_pakari',
    name: 'The Heat of Insight',
    description:
      'Determined to grow stronger, Kopaka travels to the volcanic region of Ta-Wahi in search of the Kanohi Pakari. Amid rivers of fire and molten stone, he retrieves the mask—but is suddenly struck by a falling chunk of ice, conjured unnaturally in the heat. As darkness closes in, a vivid vision overwhelms him: two towering beings—Akamai and Wairuha—locked in battle. Kopaka awakens to find Lewa dragging him to safety. Shaken, he suspects the vision was not a prophecy, but a manipulation—perhaps from the Makuta himself. Lewa relays word from Onua: the Toa must gather once more.',
    durationSeconds: 660, // 11 minutes
    requirements: {
      matoran: ['Toa_Kopaka'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 600,
      currency: 1100,
      loot: {
        [GameItemId.Charcoal]: 200,
        [GameItemId.BurnishedAlloy]: 100,
      },
    },
    unlockedAfter: ['mnog_search_for_matoro', 'mnog_lewa_v_onua'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'story_toa_second_council',
    name: 'Council of Unity',
    description:
      'At Onua’s urging, the six Toa gather once more—battered, wiser, and uncertain. The masks they have found weigh heavily, and so do the visions.',
    durationSeconds: 120, // 2 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'story_toa_second_council' },
      xpPerMatoran: 800,
      currency: 100,
      loot: {},
    },
    unlockedAfter: ['maskhunt_kopaka_pakari', 'maskhunt_gali_rescue'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_tahu_miru',
    name: 'Depths of the Shoreline',
    description:
      'Following the plan forged at the Council, Gali, Kopaka, and Onua dive beneath the crashing surf off the Po-Koro shoreline, each wearing a Kanohi Kaukau. Below, an underwater shrine holds Tahu’s Miru.',
    durationSeconds: 720, // 12 minutes
    requirements: {
      matoran: ['Toa_Gali', 'Toa_Kopaka', 'Toa_Onua'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_tahu_miru' },
      xpPerMatoran: 700,
      currency: 1200,
      loot: {
        [GameItemId.GaPearl]: 120,
        [GameItemId.BurnishedAlloy]: 120,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_pohatu_kaukau_bluff',
    name: 'The Bluff Above All',
    description:
      'Pohatu’s Kanohi Kaukau is found not beneath water, but atop the highest bluff in Po-Wahi. Harsh winds and sheer cliffs guard the approach.',
    durationSeconds: 660, // 11 minutes
    requirements: {
      matoran: ['Toa_Pohatu', 'Toa_Kopaka', 'Toa_Lewa'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_pohatu_kaukau_bluff' },
      xpPerMatoran: 650,
      currency: 1100,
      loot: {
        [GameItemId.CarvingTool]: 100,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_forest_tahu_kakama',
    name: 'Fire in the Trees',
    description:
      'In the canopy of Le-Wahi, Tahu spots his Kakama lodged high in a massive tree. Gali and Onua watch from below.',
    durationSeconds: 600, // 10 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Onua'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_forest_tahu_kakama' },
      xpPerMatoran: 700,
      currency: 1200,
      loot: {
        [GameItemId.Charcoal]: 100,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'story_nui_jaga_nest',
    name: 'Nest of Discord',
    description:
      'Outside a massive Nui-Jaga nest, the six Toa assemble to plan their attack. The clicking of armored scorpion tails echoes from within.',
    durationSeconds: 720, // 12 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'story_nui_jaga_nest' },
      xpPerMatoran: 1000,
      currency: 1400,
    },
    unlockedAfter: [
      'maskhunt_tahu_miru',
      'maskhunt_forest_tahu_kakama',
      'maskhunt_pohatu_kaukau_bluff',
    ],
    section: 'Arrival of the Toa',
  },
  {
    id: 'maskhunt_final_collection',
    name: 'The Final Hunt',
    description:
      'With lessons hard-won and trust forged in battle, the six Toa embark on their final coordinated mask hunt. Across the island, they move as one.',
    durationSeconds: 900, // 15 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 11,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'maskhunt_final_collection' },
      xpPerMatoran: 2000,
      currency: 1600,
    },
    unlockedAfter: ['story_nui_jaga_nest'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'story_kini_nui_gathering',
    name: 'The Path Below',
    description:
      'With every Kanohi collected, the six Toa journey to the sacred temple of Kini-Nui. Ancient carvings line the walls, depicting prophecy and shadow. The island is eerily quiet.',
    durationSeconds: 300, // 5 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'story_kini_nui_gathering' },
      xpPerMatoran: 3000,
      currency: 1000,
      loot: {},
    },
    unlockedAfter: ['maskhunt_final_collection'],
    section: 'Arrival of the Toa',
  },
  {
    id: 'story_kini_nui_descent',
    name: 'Descent into Darkness',
    description:
      'With the Chronicler’s Company standing watch above, the six Toa descend into the ancient tunnels beneath Kini-Nui. The air grows colder, and the light from the surface fades behind them. Whispers echo through the stone — memories of long-forgotten battles and shadows yet to come. Though the path is unclear, one thing is certain: they will face whatever lies beneath, together.',
    durationSeconds: 300, // 5 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'story_kini_nui_descent' },
      xpPerMatoran: 1000,
      currency: 100,
      loot: {},
    },
    unlockedAfter: ['mnog_kini_nui_arrival'],
    section: 'Arrival of the Toa',
  },
];
