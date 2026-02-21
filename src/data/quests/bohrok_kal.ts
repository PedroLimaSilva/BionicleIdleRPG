import { Quest } from '../../types/Quests';
import {
  BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
  BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
} from '../../game/nuvaSymbols';

export { BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID, BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID };

// Bohrok Kal arc (after Toa Nuva evolution).
// Elite Bohrok empowered by the stolen Nuva symbols; Toa Nuva are weakened until the final triumph.
export const BOHROK_KAL_QUEST_LINE: Quest[] = [
  {
    id: BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID,
    name: 'The Stolen Symbols',
    description:
      'The peace after the Bahrag is brief. Six elite Bohrok—the Bohrok Kal—awaken and strike without warning. They steal the Nuva symbols from the Toa, the very source of their newfound power. Weakened and reeling, the Toa Nuva watch as the Kal vanish with their strength, and a new shadow falls over Mata Nui.',
    durationSeconds: 5 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva', 'Toa_Onua_Nuva', 'Toa_Pohatu_Nuva'],
      minLevel: 18,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2000,
      currency: 3000,
      loot: {},
    },
    unlockedAfter: ['bohrok_assistants'],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_first_strikes',
    name: 'First Strikes',
    description:
      'The Bohrok Kal strike at villages across Mata Nui. The Toa Nuva rush to defend their people, but weakened and outmatched, they are driven back at every turn. Each Kal seems invincible—and the Toa begin to understand the scale of the threat they face.',
    durationSeconds: 12 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva'],
      minLevel: 18,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2200,
      currency: 3500,
      loot: {},
    },
    unlockedAfter: [BOHROK_KAL_STOLEN_SYMBOLS_QUEST_ID],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_scattered',
    name: 'Scattered',
    description:
      'The Toa split up to protect their villages, each facing a Bohrok Kal alone. Tahu confronts Tahnok Kal and is overwhelmed. Gali falls back before Gahlok Kal. Across Mata Nui, the Toa are forced to retreat—but they refuse to surrender.',
    durationSeconds: 18 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva', 'Toa_Onua_Nuva', 'Toa_Pohatu_Nuva'],
      minLevel: 19,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2500,
      currency: 4000,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_first_strikes'],
    section: 'Bohrok Kal',
  },
  {
    id: 'bohrok_kal_gathering_strength',
    name: 'Gathering Strength',
    description:
      'Reunited at Kini-Nui, the Toa share what they have learned. The Kal are vulnerable only when their stolen symbols are reclaimed—and that can only happen if the Toa stand together. They form a new plan: one final confrontation, all six Toa against all six Kal.',
    durationSeconds: 15 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva', 'Toa_Onua_Nuva', 'Toa_Pohatu_Nuva'],
      minLevel: 20,
      items: [],
    },
    rewards: {
      xpPerMatoran: 2800,
      currency: 4500,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_scattered'],
    section: 'Bohrok Kal',
  },
  {
    id: BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID,
    name: 'The Final Confrontation',
    description:
      'At the heart of the island, the Toa Nuva face the Bohrok Kal in one decisive battle. Through Unity, Duty, and Destiny, they push back—and at last reclaim the Nuva symbols. The Kal fall. Mata Nui is safe once more.',
    durationSeconds: 25 * 60,
    requirements: {
      matoran: ['Toa_Tahu_Nuva', 'Toa_Gali_Nuva', 'Toa_Kopaka_Nuva', 'Toa_Lewa_Nuva', 'Toa_Onua_Nuva', 'Toa_Pohatu_Nuva'],
      minLevel: 20,
      items: [],
    },
    rewards: {
      xpPerMatoran: 5000,
      currency: 6000,
      loot: {},
    },
    unlockedAfter: ['bohrok_kal_gathering_strength'],
    section: 'Bohrok Kal',
  },
];
