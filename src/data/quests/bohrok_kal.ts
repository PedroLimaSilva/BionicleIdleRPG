import { Quest } from '../../types/Quests';
import {
  BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
  BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
} from '../../game/nuvaSymbols';

export { BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID, BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID };

// Bohrok Kal arc — follows BIONICLE Chronicles 3.
// Bohrok serve Matoran, symbols appear in Suvas. Kal steal them; Toa lose power.
// Kal seek the Bahrag. Toa race to the nest, use Exo-Toa and Vahi.
// Kal destroyed by their own powers; symbols reclaimed.
export const BOHROK_KAL_QUEST_LINE: Quest[] = [
  {
    id: 'bohrok_kal_reconstruction',
    name: 'Reconstruction',
    description:
      'While the Ta-Matoran were repairing the damage to Ta-Koro, a strange symbol appeared on the Toa Suva shrine. Turaga Vakama recognizes what it is and requests a private conversation with Tahu. He then gives him the Vahi—the Mask of Time—and asks him to keep its existence secret, and to use it only in the direst emergency.',
    durationSeconds: 8 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva'],
      minLevel: 18,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1500,
      currency: 2500,
      loot: {},
    },
    unlockedAfter: ['bohrok_assistants'],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_scattered_aid',
    name: 'Scattered to the Villages',
    description:
      'Newly transformed and more powerful than ever, the Toa Nuva agree to split up and return to their villages to help with reconstruction.',
    durationSeconds: 10 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 18,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_scattered_aid' },
      xpPerMatoran: 1800,
      currency: 3000,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_reconstruction'],
    section: 'Bohrok Kal',
  },
  {
    id: BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
    name: 'The Stolen Symbols',
    description:
      'Without warning, six elite Bohrok—the Bohrok-Kal—strike the Suva shrines across Mata Nui and steal the Nuva Symbols. Instantly, the Toa Nuva’s elemental powers vanish.',
    durationSeconds: 15 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 18,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_stolen_symbols' },
      xpPerMatoran: 2000,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_scattered_aid'],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_sighting',
    name: 'Sighting in Po-Wahi',
    description:
      'Gali reveals that two Bohrok Kal were seen in Po-Wahi. The Toa give chase. Tahu orders them to split into two groups: one to pursue the Kal, the other to investigate what has happened to the Bahrag. In their confrontations, the Kal speak of finding the Bahrag and freeing them from their prison.',
    durationSeconds: 12 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 19,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_sighting' },
      xpPerMatoran: 2400,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_race_to_nest',
    name: 'Race to the Nest',
    description:
      'The Bohrok-Kal are closing in on the Bahrag’s prison. The Toa Nuva race to the nest, hoping to reach it first. Their plan: use the abandoned Exo-Toa armor to compensate for their missing elemental powers.',
    durationSeconds: 18 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 19,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_race_to_nest' },
      xpPerMatoran: 3000,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_sighting'],
    section: 'Bohrok Kal',
  },
  {
    id: BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
    name: 'At the Nuva Cube',
    description:
      'The Toa Nuva arrive at the Nuva Cube—too late. The six Bohrok-Kal stand before it, symbols in hand, ready to free the Bahrag. The Exo-Toa weapons prove useless against the Kal’s power.',
    durationSeconds: 25 * 60,
    requirements: {
      matoran: [
        'Toa_Tahu_Nuva',
        'Toa_Gali_Nuva',
        'Toa_Kopaka_Nuva',
        'Toa_Lewa_Nuva',
        'Toa_Onua_Nuva',
        'Toa_Pohatu_Nuva',
      ],
      minLevel: 20,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_final_confrontation' },
      xpPerMatoran: 5000,
      currency: 6000,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_race_to_nest'],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_naming_day',
    name: 'The Naming Day',
    description:
      'With the Bohrok-Kal defeated and peace restored, the Turaga gather every Matoran on Mata Nui at Kini-Nui for a great ceremony—a Naming Day, to honor those who stood bravest during the crisis.',
    durationSeconds: 12 * 60,
    requirements: {
      matoran: [
        'Kapura',
        'Takua',
        'Jala',
        'Hahli',
        'Huki',
        'Nuparu',
        'Onepu',
        'Kongu',
        'Matoro',
        'Maku',
        'Lumi',
        'Kivi',
        'Taipu',
        'Tamaru',
        'Kopeke',
        'Hafu',
      ],
      minLevel: 1,
      items: [],
    },
    rewards: {
      cutscene: { type: 'visual_novel', cutsceneId: 'bohrok_kal_naming_day' },
      xpPerMatoran: 1500,
      currency: 2000,
      loot: {},
    },
    unlockedAfter: [BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID],
    section: 'Bohrok Kal',
  },
];
