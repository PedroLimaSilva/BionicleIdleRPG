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
    id: 'bohrok_swarm_intro',
    name: 'Beware the Bohrok',
    description:
      'The Toa emerge from the depths after confronting Makuta, expecting peace. Instead, smoke rises from every corner of the island. Strange mechanical creatures swarm across the land, leveling everything in their path.',
    durationSeconds: 10 * 60, // 10 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_swarm_intro' },
      xpPerMatoran: 1500,
      currency: 2000,
    },
    // Begins after the original Mangaia / Kini-Nui arc concludes.
    unlockedAfter: ['mnog_return_to_shore'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_ta_koro_defense',
    name: 'Siege of Ta-Koro',
    description: 'The Kohrak—ice Bohrok—swarm the walls of Ta-Koro.',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Jala'],
      minLevel: 12,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_ta_koro_defense' },
      xpPerMatoran: 1800,
      currency: 2200,
    },
    unlockedAfter: ['bohrok_swarm_intro'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_po_koro_defense',
    name: 'Hold the Stone Village',
    description:
      'The fire Bohrok—Tahnok—sweep across Po-Wahi. Flames consume the desert scrub and scorch the stone. At the village gates, two Matoran stand their ground.',
    durationSeconds: 14 * 60, // 14 minutes
    requirements: {
      matoran: ['Hafu', 'Huki'],
      minLevel: 12,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_po_koro_defense' },
      xpPerMatoran: 1700,
      currency: 2300,
    },
    unlockedAfter: ['bohrok_swarm_intro'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_onu_koro_boxor',
    name: 'The Invention of the Boxor',
    description:
      'The water Bohrok—Gahlok—have flooded Onu-Koro’s tunnels. Cut off from the surface, three Matoran huddle in a dry chamber with salvaged parts from destroyed Bohrok.',
    durationSeconds: 18 * 60, // 18 minutes
    requirements: {
      matoran: ['Onepu', 'Nuparu', 'Taipu'],
      minLevel: 12,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_onu_koro_boxor' },
      xpPerMatoran: 2000,
      currency: 2500,
    },
    unlockedAfter: ['bohrok_ta_koro_defense'],
    section: 'Bohrok Swarms',
  },
  {
    id: BOHROK_KRANA_LEGEND_QUEST_ID,
    name: 'Legend of the Krana',
    description:
      'Having recognized the Bohrok from the old legends, Turaga Vakama reveals the ancient tale of the swarms and the Krana that control them.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Toa_Tahu'],
      minLevel: 12,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_legend_of_krana' },
      xpPerMatoran: 800,
      currency: 1000,
    },
    unlockedAfter: ['bohrok_ta_koro_defense'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_lewa_krana_rescue',
    name: 'Freed from the Krana',
    description:
      'Deep in the jungle of Le-Wahi, Onua searches for the missing Lewa. He finds the Toa of Air’s discarded Kanohi mask on the ground—and a chill runs through him.',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Toa_Lewa', 'Toa_Onua'],
      minLevel: 13,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_lewa_krana_rescue' },
      xpPerMatoran: 2100,
      currency: 2400,
    },
    unlockedAfter: ['bohrok_legend_of_krana'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_krana_hunt',
    name: 'Hunt for the Krana',
    description:
      'The Turaga have revealed the truth: only by collecting every type of Krana from every Bohrok breed can the Toa unlock the path into the nests and end this threat.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 13,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_krana_hunt' },
      xpPerMatoran: 2200,
      currency: 2600,
    },
    unlockedAfter: ['bohrok_lewa_krana_rescue'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_into_the_bohrok_nest',
    name: 'Into the Bohrok Nest',
    description:
      'Kopaka’s Akaku reveals a hidden entrance beneath the drifts of Ko-Wahi—a tunnel spiraling down into uncharted depths. The six Toa stand at its mouth.',
    durationSeconds: 20 * 60, // 20 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 14,
      // Hard gate: all 48 Krana must be collected before this quest can start.
      requiresAllKrana: true,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_into_the_bohrok_nest' },
      xpPerMatoran: 2600,
      currency: 3000,
    },
    unlockedAfter: ['bohrok_krana_hunt'],
    section: 'Bohrok Swarms',
  },
  {
    id: 'bohrok_evolve_toa_nuva',
    name: 'Dawn of the Toa Nuva',
    description:
      'Deep in the Bohrok nest, the Toa shed their Exo-Toa armor and confront the Bahrag—Cahdok and Gahdok, twin queens of the swarm. The battle is brutal.',
    durationSeconds: 25 * 60, // 25 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 16,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_evolve_toa_nuva' },
      xpPerMatoran: 4000,
      currency: 5000,
    },
    unlockedAfter: ['bohrok_into_the_bohrok_nest'],
    section: 'Bohrok Swarms',
  },
  {
    id: BOHROK_RECRUITMENT_QUEST_ID,
    name: 'Bohrok Assistants',
    description:
      'With the Bahrag imprisoned, the Bohrok across Mata Nui have gone dormant—standing motionless wherever the swarm’s signal ceased. Nuparu sees an opportunity.',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Nuparu', 'Onepu'],
      minLevel: 14,
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_assistants' },
      xpPerMatoran: 1200,
      currency: 3000,

      unlockCharacters: [
        { id: 'tahnok', cost: 500 },
        { id: 'gahlok', cost: 500 },
        { id: 'lehvak', cost: 500 },
        { id: 'pahrak', cost: 500 },
        { id: 'nuhvok', cost: 500 },
        { id: 'kohrak', cost: 500 },
      ],
    },
    unlockedAfter: ['bohrok_evolve_toa_nuva'],
    section: 'Bohrok Swarms',
  },
];
