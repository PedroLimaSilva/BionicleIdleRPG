import { Quest } from '../../types/Quests';

// Quest IDs for the Bohrok Swarm arc.
// Keep these in sync with src/data/quests/bohrok_swarm.ts.
// This quest both unlocks battles and starts Krana collection.
export const BOHROK_KRANA_LEGEND_QUEST_ID = 'bohrok_legend_of_krana';
export const BOHROK_EVOLVE_TOA_NUVA_QUEST_ID = 'bohrok_evolve_toa_nuva';
export const BOHROK_RECRUITMENT_QUEST_ID = 'bohrok_assistants';

// Bohrok Swarm arc (Beware the Bohrok).
// These quests cover the key beats of BIONICLE Chronicles 2:
// - Bohrok attack on the surface villages
// - Vakama revealing the legend of the Bohrok and Krana
// - The Toa splitting up to hunt Krana across Mata Nui
// - The descent into the Bohrok nest and confrontation with the Bahrag
// - The Toa's transformation into Toa Nuva
export const BOHROK_SWARM_QUEST_LINE: Quest[] = [
  {
    description:
      'The Toa emerge from the depths after confronting Makuta, expecting peace. Instead, smoke rises from every corner of the island. Strange mechanical creatures swarm across the land, leveling everything in their path.',
    durationSeconds: 10 * 60, // 10 minutes
    id: 'bohrok_swarm_intro',
    name: 'Beware the Bohrok',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
    },
    rewards: {
      currency: 2000,
      cutscene: { cutsceneId: 'bohrok_swarm_intro', type: 'visual_novel' },
      xpPerMatoran: 1500,
    },
    section: 'Bohrok Swarms',
    // Begins after the original Mangaia / Kini-Nui arc concludes.
    unlockedAfter: ['mnog_return_to_shore'],
  },
  {
    description: 'The Kohrak—ice Bohrok—swarm the walls of Ta-Koro.',
    durationSeconds: 15 * 60, // 15 minutes
    id: 'bohrok_ta_koro_defense',
    name: 'Siege of Ta-Koro',
    requirements: {
      matoran: ['Toa_Tahu', 'Jala'],
      minLevel: 12,
    },
    rewards: {
      currency: 2200,
      cutscene: { cutsceneId: 'bohrok_ta_koro_defense', type: 'visual_novel' },
      xpPerMatoran: 1800,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_swarm_intro'],
  },
  {
    description:
      'The fire Bohrok—Tahnok—sweep across Po-Wahi. Flames consume the desert scrub and scorch the stone. At the village gates, two Matoran stand their ground.',
    durationSeconds: 14 * 60, // 14 minutes
    id: 'bohrok_po_koro_defense',
    name: 'Hold the Stone Village',
    requirements: {
      matoran: ['Hafu', 'Huki'],
      minLevel: 12,
    },
    rewards: {
      currency: 2300,
      cutscene: { cutsceneId: 'bohrok_po_koro_defense', type: 'visual_novel' },
      xpPerMatoran: 1700,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_swarm_intro'],
  },
  {
    description:
      'The water Bohrok—Gahlok—have flooded Onu-Koro’s tunnels. Cut off from the surface, three Matoran huddle in a dry chamber with salvaged parts from destroyed Bohrok.',
    durationSeconds: 18 * 60, // 18 minutes
    id: 'bohrok_onu_koro_boxor',
    name: 'The Invention of the Boxor',
    requirements: {
      matoran: ['Onepu', 'Nuparu', 'Taipu'],
      minLevel: 12,
    },
    rewards: {
      currency: 2500,
      cutscene: { cutsceneId: 'bohrok_onu_koro_boxor', type: 'visual_novel' },
      xpPerMatoran: 2000,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_ta_koro_defense'],
  },
  {
    description:
      'Having recognized the Bohrok from the old legends, Turaga Vakama reveals the ancient tale of the swarms and the Krana that control them.',
    durationSeconds: 5 * 60, // 5 minutes
    id: BOHROK_KRANA_LEGEND_QUEST_ID,
    name: 'Legend of the Krana',
    requirements: {
      matoran: ['Toa_Tahu'],
      minLevel: 12,
    },
    rewards: {
      currency: 1000,
      cutscene: { cutsceneId: 'bohrok_legend_of_krana', type: 'visual_novel' },
      xpPerMatoran: 800,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_ta_koro_defense'],
  },
  {
    description:
      'Deep in the jungle of Le-Wahi, Onua searches for the missing Lewa. He finds the Toa of Air’s discarded Kanohi mask on the ground—and a chill runs through him.',
    durationSeconds: 15 * 60, // 15 minutes
    id: 'bohrok_lewa_krana_rescue',
    name: 'Freed from the Krana',
    requirements: {
      matoran: ['Toa_Lewa', 'Toa_Onua'],
      minLevel: 13,
    },
    rewards: {
      currency: 2400,
      cutscene: { cutsceneId: 'bohrok_lewa_krana_rescue', type: 'visual_novel' },
      xpPerMatoran: 2100,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_legend_of_krana'],
  },
  {
    description:
      'The Turaga have revealed the truth: only by collecting every type of Krana from every Bohrok breed can the Toa unlock the path into the nests and end this threat.',
    durationSeconds: 30 * 60, // 30 minutes
    id: 'bohrok_krana_hunt',
    name: 'Hunt for the Krana',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 13,
    },
    rewards: {
      currency: 2600,
      cutscene: { cutsceneId: 'bohrok_krana_hunt', type: 'visual_novel' },
      xpPerMatoran: 2200,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_lewa_krana_rescue'],
  },
  {
    description:
      'Kopaka’s Akaku reveals a hidden entrance beneath the drifts of Ko-Wahi—a tunnel spiraling down into uncharted depths. The six Toa stand at its mouth.',
    durationSeconds: 20 * 60, // 20 minutes
    id: 'bohrok_into_the_bohrok_nest',
    name: 'Into the Bohrok Nest',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 14,
      // Hard gate: all 48 Krana must be collected before this quest can start.
      requiresAllKrana: true,
    },
    rewards: {
      currency: 3000,
      cutscene: { cutsceneId: 'bohrok_into_the_bohrok_nest', type: 'visual_novel' },
      xpPerMatoran: 2600,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_krana_hunt'],
  },
  {
    description:
      'Deep in the Bohrok nest, the Toa shed their Exo-Toa armor and confront the Bahrag—Cahdok and Gahdok, twin queens of the swarm. The battle is brutal.',
    durationSeconds: 25 * 60, // 25 minutes
    id: 'bohrok_evolve_toa_nuva',
    name: 'Dawn of the Toa Nuva',
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 16,
    },
    rewards: {
      currency: 5000,
      cutscene: { cutsceneId: 'bohrok_evolve_toa_nuva', type: 'visual_novel' },
      xpPerMatoran: 4000,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_into_the_bohrok_nest'],
  },
  {
    description:
      'With the Bahrag imprisoned, the Bohrok across Mata Nui have gone dormant—standing motionless wherever the swarm’s signal ceased. Nuparu sees an opportunity.',
    durationSeconds: 15 * 60, // 15 minutes
    id: BOHROK_RECRUITMENT_QUEST_ID,
    name: 'Bohrok Assistants',
    requirements: {
      matoran: ['Nuparu', 'Onepu'],
      minLevel: 14,
    },
    rewards: {
      currency: 3000,
      cutscene: { cutsceneId: 'bohrok_assistants', type: 'visual_novel' },
      unlockCharacters: [
        { cost: 500, id: 'tahnok' },
        { cost: 500, id: 'gahlok' },
        { cost: 500, id: 'lehvak' },
        { cost: 500, id: 'pahrak' },
        { cost: 500, id: 'nuhvok' },
        { cost: 500, id: 'kohrak' },
      ],

      xpPerMatoran: 1200,
    },
    section: 'Bohrok Swarms',
    unlockedAfter: ['bohrok_evolve_toa_nuva'],
  },
];
