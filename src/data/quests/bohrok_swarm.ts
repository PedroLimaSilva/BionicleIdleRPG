import { Quest } from '../../types/Quests';

// Quest IDs for the Bohrok Swarm arc.
// Keep these in sync with src/data/quests/bohrok_swarm.ts.
// This quest both unlocks battles and starts Krana collection.
export const BOHROK_KRANA_LEGEND_QUEST_ID = 'bohrok_legend_of_krana';
export const BOHROK_EVOLVE_TOA_NUVA_QUEST_ID = 'bohrok_evolve_toa_nuva';

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
      'Having just emerged from the depths after confronting Makuta, the Toa expect peace, but instead find villages under sudden attack from mysterious mechanical swarms. Rushing to Ta-Koro, they clash with the Bohrok for the first time and realize that a new threat has awakened beneath Mata Nui.',
    durationSeconds: 10 * 60, // 10 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1500,
      currency: 2000,
      loot: {},
    },
    // Begins after the original Mangaia / Kini-Nui arc concludes.
    unlockedAfter: ['mnog_return_to_shore'],
  },
  {
    id: 'bohrok_ta_koro_defense',
    name: 'Siege of Ta-Koro',
    description:
      'The Bohrok descend on Ta-Koro in force, shattering stone and fire alike. Tahu leads the defense of the village, pushing the swarm back long enough for the Matoran to evacuate and for a single Bohrok to be captured for study.',
    durationSeconds: 15 * 60, // 15 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Takua'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1800,
      currency: 2200,
      loot: {},
    },
    unlockedAfter: ['bohrok_swarm_intro'],
  },
  {
    id: BOHROK_KRANA_LEGEND_QUEST_ID,
    name: 'Legend of the Krana',
    description:
      'With a captured Bohrok before them, Turaga Vakama reveals the ancient legend of the swarms and the Krana that control them. The Toa learn that only by collecting the Krana from each Bohrok type can they hope to reach the heart of the nests and end the threat to Mata Nui.',
    durationSeconds: 5 * 60, // 5 minutes
    requirements: {
      matoran: ['Takua'],
      minLevel: 12,
      items: [],
    },
    rewards: {
      xpPerMatoran: 800,
      currency: 1000,
      loot: {},
    },
    unlockedAfter: ['bohrok_ta_koro_defense'],
  },
  {
    id: 'bohrok_krana_hunt',
    name: 'Hunt for the Krana',
    description:
      'Heeding Vakama’s warning, the Toa agree to split up once more. Each returns to their own village and region to battle the Bohrok swarms and tear the Krana from their heads, knowing that only a full set of Krana will unlock the path into the Bohrok nests.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 13,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2200,
      currency: 2600,
      loot: {},
    },
    unlockedAfter: ['bohrok_legend_of_krana'],
  },
  {
    id: 'bohrok_into_the_bohrok_nest',
    name: 'Into the Bohrok Nest',
    description:
      'Following the trail of the Bohrok Va, Kopaka discovers a hidden entrance leading deep beneath the island. Reunited, the Toa prepare to descend into the Bohrok nest itself—a final, perilous journey that can only begin once they have gathered the Krana needed to unlock the way forward.',
    durationSeconds: 20 * 60, // 20 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 14,
      items: [],
      // Hard gate: all 48 Krana must be collected before this quest can start.
      requiresAllKrana: true,
    },
    rewards: {
      xpPerMatoran: 2600,
      currency: 3000,
      loot: {},
    },
    unlockedAfter: ['bohrok_krana_hunt'],
  },
  {
    id: 'bohrok_evolve_toa_nuva',
    name: 'Dawn of the Toa Nuva',
    description:
      'Deep within the Bohrok nest, the Toa don the Exo-Toa armor and confront the Bahrag, queens of the swarm. By combining their elemental powers, they imprison the twins in a cage of solid protodermis—only to be plunged into energized protodermis themselves. Transformed into the Toa Nuva, they emerge with newfound strength and a world forever changed.',
    durationSeconds: 25 * 60, // 25 minutes
    requirements: {
      matoran: ['Toa_Tahu', 'Toa_Gali', 'Toa_Kopaka', 'Toa_Lewa', 'Toa_Onua', 'Toa_Pohatu'],
      minLevel: 16,
      items: [],
    },
    rewards: {
      xpPerMatoran: 4000,
      currency: 5000,
      loot: {},
      evolution: {
        Toa_Tahu: 'Toa_Tahu_Nuva',
        Toa_Gali: 'Toa_Gali_Nuva',
        Toa_Pohatu: 'Toa_Pohatu_Nuva',
        Toa_Onua: 'Toa_Onua_Nuva',
        Toa_Kopaka: 'Toa_Kopaka_Nuva',
        Toa_Lewa: 'Toa_Lewa_Nuva',
      },
    },
    unlockedAfter: ['bohrok_into_the_bohrok_nest'],
  },
];
