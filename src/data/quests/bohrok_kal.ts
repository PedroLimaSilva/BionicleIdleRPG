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
    description:
      'While the Ta-Matoran repair the damage to Ta-Koro, a strange symbol appears on the Toa Suva shrine. Turaga Vakama recognizes it and requests a private conversation with Tahu.',
    durationSeconds: 8 * 60,
    id: 'bohrok_kal_reconstruction',
    name: 'Reconstruction',
    requirements: {
      matoran: ['Toa_Tahu_Nuva'],
      minLevel: 18,
    },
    rewards: {
      currency: 2500,
      cutscene: { cutsceneId: 'bohrok_kal_reconstruction', type: 'visual_novel' },
      xpPerMatoran: 1500,
    },
    section: 'Bohrok Kal',
    unlockedAfter: ['bohrok_assistants'],
  },
  {
    description:
      'Newly transformed and more powerful than ever, the Toa Nuva agree to split up and return to their villages to help with reconstruction.',
    durationSeconds: 10 * 60,
    id: 'bohrok_kal_scattered_aid',
    name: 'Scattered to the Villages',
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
    },
    rewards: {
      currency: 3000,
      cutscene: { cutsceneId: 'bohrok_kal_scattered_aid', type: 'visual_novel' },
      xpPerMatoran: 1800,
    },
    section: 'Bohrok Kal',
    unlockedAfter: ['bohrok_kal_reconstruction'],
  },
  {
    description:
      'Without warning, six elite Bohrok—the Bohrok-Kal—strike the Suva shrines across Mata Nui and steal the Nuva Symbols. Instantly, the Toa Nuva’s elemental powers vanish.',
    durationSeconds: 15 * 60,
    id: BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
    name: 'The Stolen Symbols',
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
    },
    rewards: {
      currency: 3500,
      cutscene: { cutsceneId: 'bohrok_kal_stolen_symbols', type: 'visual_novel' },
      xpPerMatoran: 2000,
    },
    section: 'Bohrok Kal',
    unlockedAfter: ['bohrok_kal_scattered_aid'],
  },
  {
    description:
      'Gali reveals that two Bohrok-Kal were seen in Po-Wahi. The Toa give chase. Tahu orders them to split into two groups: one to pursue the Kal, the other to investigate what has happened to the Bahrag. In their confrontations, the Kal speak of finding the Bahrag and freeing them from their prison.',
    durationSeconds: 12 * 60,
    id: 'bohrok_kal_sighting',
    name: 'Sighting in Po-Wahi',
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
    },
    rewards: {
      currency: 4000,
      cutscene: { cutsceneId: 'bohrok_kal_sighting', type: 'visual_novel' },
      xpPerMatoran: 2400,
    },
    section: 'Bohrok Kal',
    unlockedAfter: [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID],
  },
  {
    description:
      'The Bohrok-Kal are closing in on the Bahrag’s prison. The Toa Nuva race to the nest, hoping to reach it first. Their plan: use the abandoned Exo-Toa armor to compensate for their missing elemental powers.',
    durationSeconds: 18 * 60,
    id: 'bohrok_kal_race_to_nest',
    name: 'Race to the Nest',
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
    },
    rewards: {
      currency: 4500,
      cutscene: { cutsceneId: 'bohrok_kal_race_to_nest', type: 'visual_novel' },
      xpPerMatoran: 3000,
    },
    section: 'Bohrok Kal',
    unlockedAfter: ['bohrok_kal_sighting'],
  },
  {
    description:
      'The Toa Nuva arrive at the Nuva Cube too late. The six Bohrok-Kal already disabled the Exo-Toa and stand before the Nuva Cube, symbols in hand, ready to free the Bahrag.',
    durationSeconds: 25 * 60,
    id: BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
    name: 'At the Nuva Cube',
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
    },
    rewards: {
      currency: 6000,
      cutscene: { cutsceneId: 'bohrok_kal_final_confrontation', type: 'visual_novel' },
      xpPerMatoran: 5000,
    },
    section: 'Bohrok Kal',
    unlockedAfter: ['bohrok_kal_race_to_nest'],
  },
  {
    description:
      'With the Bohrok-Kal defeated and peace restored, the Turaga gather every Matoran on Mata Nui at Kini-Nui for a great ceremony—a Naming Day, to honor those who stood bravest during the crisis.',
    durationSeconds: 12 * 60,
    id: 'bohrok_kal_naming_day',
    name: 'The Naming Day',
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
    },
    rewards: {
      currency: 2000,
      cutscene: { cutsceneId: 'bohrok_kal_naming_day', type: 'visual_novel' },
      xpPerMatoran: 1500,
    },
    section: 'Bohrok Kal',
    unlockedAfter: [BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID],
  },
];
