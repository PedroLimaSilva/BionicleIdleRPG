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
      cutscene: 'Fk47EDfWK10',
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
  },
  {
    id: 'maskhunt_kopaka_pohatu_icecliff',
    name: 'The Cliffside Encounter',
    description:
      'As Kopaka explores the frozen drifts of Ko-Wahi, he unexpectedly crosses paths with Pohatu, who arrived chasing a Rahi sighting from the desert’s edge. Though their temperaments clash, the two agree to investigate a nearby crevasse said to conceal a Kanohi Mask. There, they must work together to survive an avalanche and fend off ambushing Rahi to retrieve the Mask of Shielding.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Kopaka', 'Toa_Pohatu'],
      minLevel: 1,
      items: [],
    },
    rewards: {
      xpPerMatoran: 450,
      currency: 400,
      loot: {
        [GameItemId.IceChip]: 100,
        [GameItemId.StoneBlock]: 100,
      },
    },
    unlockedAfter: ['story_toa_arrival'],
  },
  {
    id: 'story_toa_council',
    name: 'The Toa Council',
    description:
      'Following a chance encounter between Kopaka and Pohatu, they find the other four Toa gathered near the slopes of Mount Ihu. Though tensions arise between their differing personalities and priorities, they come to a shared understanding: each must search for the scattered Kanohi and grow stronger in preparation for the battle against Makuta. They part ways with a mutual vow to reunite when the time is right.',
    durationSeconds: 30 * 60, // 2 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 1,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 500,
      loot: {},
    },
    unlockedAfter: ['maskhunt_kopaka_pohatu_icecliff'],
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
    unlockedAfter: ['mnog_tahu_unlock_01', 'story_toa_council'],
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
  },
  {
    id: 'maskhunt_onua_matatu_komau',
    name: 'Echoes of the Forest',
    description:
      'After the Toa Council, Onua begins his journey through the thick jungle of Le-Wahi. He uncovers two Kanohi—Matatu and Komau—resting on top of trees. Onua must use his strength and caution to secure the masks.',
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
    unlockedAfter: ['maskhunt_onua_matatu_komau'],
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
  },
  {
    id: 'maskhunt_gali_rescue',
    name: 'Fire in the Ravine',
    description:
      'Drawn by a column of dust and the cries of battle, Tahu rushes into the Po-Wahi canyon to find Gali trapped and under siege by Rahi. The two fight side by side in the narrow gorge, pushing back the beasts with elemental synergy. In the heart of the clash, Gali is struck by a vision—brief, radiant, and overwhelming—of a form greater than any single Toa: the Toa Kaita.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali'],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 800,
      currency: 1100,
      loot: {
        [GameItemId.GaPearl]: 60,
        [GameItemId.BurnishedAlloy]: 60,
      },
    },
    unlockedAfter: ['maskhunt_gali_miru', 'maskhunt_tahu_cave_akaku'],
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
    unlockedAfter: [
      'mnog_search_for_matoro',
      'mnog_lewa_v_onua',
    ],
  },
  {
    id: 'story_toa_second_council',
    name: 'Council of Unity',
    description:
      'After a string of difficult battles and strange visions, the Toa reconvene—this time at Onua’s request. They share what they’ve learned: visions, near-deaths, and the masks they’ve found. For the first time, they speak openly of trust and strategy. Realizing they’ve made little progress alone, the Toa agree: from now on, they will work together to gather the remaining Masks of Power. Unity will be their path forward.',
    durationSeconds: 120, // 2 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 6,
      items: [],
    },
    rewards: {
      xpPerMatoran: 800,
      currency: 100,
      loot: {},
    },
    unlockedAfter: ['maskhunt_kopaka_pakari', 'maskhunt_gali_rescue'],
  },
  {
    id: 'maskhunt_tahu_miru',
    name: 'Depths of the Shoreline',
    description:
      'Following a shared plan forged at the Toa Council, the six heroes arrive at the Po-Koro shoreline. There, Gali, Kopaka, and Onua dive beneath the crashing surf—each wearing a Kanohi Kaukau—to retrieve Tahu’s Miru from an underwater shrine. But the shrine is guarded by a territorial Tarakava, and teamwork becomes essential as the Rahi strikes from the depths. By combining their elemental powers and mobility, the Toa secure the mask and reaffirm the strength of unity.',
    durationSeconds: 720, // 12 minutes
    requirements: {
      matoran: ['Toa_Gali', 'Toa_Kopaka', 'Toa_Onua'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      xpPerMatoran: 700,
      currency: 1200,
      loot: {
        [GameItemId.GaPearl]: 120,
        [GameItemId.BurnishedAlloy]: 120,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    id: 'maskhunt_pohatu_kaukau_bluff',
    name: 'The Bluff Above All',
    description:
      'Working together after the Toa Council, Kopaka, Pohatu, and Lewa set out to recover Pohatu’s Kanohi Kaukau—unusually located not beneath water, but atop the highest bluff in Po-Wahi. There, harsh winds and cliffs guard the shrine. To reach it, the trio must combine Pohatu’s speed, Lewa’s agility, and Kopaka’s precision to scale the sheer face. The climb tests their limits, but the Mask of Water Breathing awaits at the summit.',
    durationSeconds: 660, // 11 minutes
    requirements: {
      matoran: ['Toa_Pohatu', 'Toa_Kopaka', 'Toa_Lewa'],
      minLevel: 9,
      items: [],
    },
    rewards: {
      xpPerMatoran: 650,
      currency: 1100,
      loot: {
        [GameItemId.CarvingTool]: 100,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    id: 'maskhunt_forest_tahu_kakama',
    name: 'Fire in the Trees',
    description:
      'Journeying to Le-Wahi, Tahu, Gali, and Onua seek out the Kanohi Kakama—Tahu’s Mask of Speed—hidden high in the jungle canopy. Impatient, Tahu scorches the tree to force the mask loose, triggering a fast-spreading blaze. Gali, furious at his recklessness, calls on the surrounding waters to extinguish the fire. Though the mask is recovered, tensions rise as Gali storms off, leaving the others in uneasy silence.',
    durationSeconds: 600, // 10 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Onua'],
      minLevel: 10,
      items: [],
    },
    rewards: {
      xpPerMatoran: 700,
      currency: 1200,
      loot: {
        [GameItemId.Charcoal]: 100,
      },
    },
    unlockedAfter: ['story_toa_second_council'],
  },
  {
    id: 'story_nui_jaga_nest',
    name: 'Nest of Discord',
    description:
      'Outside a massive Nui-Jaga nest, the Toa assemble to plan their next move. Tahu pushes for a direct assault, but Gali argues for a strategic approach—driving the Rahi into the open where they can be fought safely. Onua sides with Gali, while Pohatu dismisses the risk. When Lewa asks Kopaka’s thoughts, the Toa of Ice coldly rejects Tahu’s aggressive plan. Tensions rise and tempers flare until Tahu hurls a fireball in frustration, accidentally igniting the brush. The smoke flushes the Nui-Jaga out—and the Toa are forced to fight them head-on, together.',
    durationSeconds: 720, // 12 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 10,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 1400,
    },
    unlockedAfter: [
      'maskhunt_tahu_miru',
      'maskhunt_forest_tahu_kakama',
      'maskhunt_pohatu_kaukau_bluff',
    ],
  },
  {
    id: 'maskhunt_final_collection',
    name: 'The Final Hunt',
    description:
      'With battles behind them and lessons hard-won, the Toa gather one last time. They have seen visions, saved villages, and clashed with one another—but now, united in purpose, they set out to retrieve the final Kanohi needed to complete their sets. Across icy cliffs, jungle treetops, volcanic depths, and desert shrines, they coordinate their search with precision and trust. The last Masks of Power await, and with them, the strength to face what lies beneath the island.',
    durationSeconds: 900, // 15 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 11,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2000,
      currency: 1600,
    },
    unlockedAfter: ['story_nui_jaga_nest'],
  },
  {
    id: 'story_kini_nui_gathering',
    name: 'The Path Below',
    description:
      'With every Kanohi collected, the Toa journey to the sacred temple of Kini-Nui. The island is quiet as they arrive, standing together beneath ancient carvings that speak of prophecy and shadow.',
    durationSeconds: 300, // 5 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 12,
      items: [],
    },
    rewards: {
      xpPerMatoran: 3000,
      currency: 1000,
      loot: {},
    },
    unlockedAfter: ['maskhunt_final_collection'],
  },
  {
    id: 'story_kini_nui_descent',
    name: 'Descent into Darkness',
    description:
      'With the Chronicler’s Company standing watch above, the six Toa descend into the ancient tunnels beneath Kini-Nui. The air grows colder, and the light from the surface fades behind them. Whispers echo through the stone — memories of long-forgotten battles and shadows yet to come. Though the path is unclear, one thing is certain: they will face whatever lies beneath, together.',
    durationSeconds: 300, // 5 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 12,
      items: [],
    },
    rewards: {
      cutscene: 'oken0zw1D-U',
      xpPerMatoran: 1000,
      currency: 100,
      loot: {},
    },
    unlockedAfter: ['mnog_kini_nui_arrival'],
  },
];
