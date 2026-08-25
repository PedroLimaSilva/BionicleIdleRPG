import { Quest } from '../../types/Quests';

/** Gates custom-character Toa evolution and unlocks the Metru Nui saga. */
export const METRU_NUI_SAGA_BEGIN_QUEST_ID = 'story_metru_nui_saga_begin';

/** Unlocks recruitment of the future Toa Metru Matoran (non–Great Disk carriers). */
export const METRU_TOA_STONES_QUEST_ID = 'metru_toa_stones_for_new_generation';

/** Unlocks Ta-, Ga-, Le-, and Po-Metru day jobs (mask maker, teacher, chute test driver, carver). */
export const SETTLE_METRU_NUI_QUEST_ID = 'settle_metru_nui';

/** Unlocks Ko-Metru knowledge tower jobs. */
export const ACTIVATE_KNOWLEDGE_TOWERS_QUEST_ID = 'activate_knowledge_towers';

/** Unlocks Onu-Metru Archives jobs. */
export const UNLOCK_ARCHIVES_QUEST_ID = 'unlock_archives';

/** Future Toa Metru Matoran — no Kanoka disk launcher on the rig. */
const METRU_TOA_CANDIDATE_RECRUIT_IDS = [
  'Matau',
  'Nokama',
  'Nuju',
  'Onewa',
  'Vakama',
  'Whenua',
] as const;

export const METRU_NUI_QUEST_LINE: Quest[] = [
  {
    description:
      'At Kini-Nui, Turaga Vakama gathers the Toa around the Amaja Circle. He warns that the tales of Metru Nui are tales of sacrifice, betrayal, and heroes—and begins the first tale: how Toa Lhikan sealed the Toa Stones and delivered them across the city, even as the Dark Hunters closed in.',
    durationSeconds: 15 * 60,
    id: METRU_NUI_SAGA_BEGIN_QUEST_ID,
    name: 'Tales of the Lost City',
    requirements: { matoran: ['Takanuva', 'Hahli', 'Jaller'], minLevel: 24 },
    rewards: {
      currency: 5500,
      cutscene: { cutsceneId: 'metru_vakama_lhikan_story', type: 'visual_novel' },
      unlockCharacters: [{ cost: 3000, id: 'Toa_Lhikan' }],
      xpPerMatoran: 4500,
    },
    section: 'Metru Nui',
    unlockedAfter: ['mol_rediscovery_of_metru_nui'],
  },
  {
    description:
      'The first tale ends with Lhikan taken and Vakama left with a stone and a vision of horror. Turaga Vakama speaks of the six Matoran who received the stones—craftsmen and scholars in Ta-Metru, Ga-Metru, Le-Metru, Po-Metru, Ko-Metru, and Onu-Metru—and how their ordinary lives were about to change forever.',
    durationSeconds: 18 * 60,
    id: METRU_TOA_STONES_QUEST_ID,
    name: 'Toa Stones for a New Generation',
    requirements: { matoran: ['Takanuva', 'Toa_Tahu_Nuva', 'Toa_Gali_Nuva'], minLevel: 25 },
    rewards: {
      currency: 6000,
      unlockCharacters: METRU_TOA_CANDIDATE_RECRUIT_IDS.map((id) => ({ cost: 1500, id })),
      xpPerMatoran: 5000,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_NUI_SAGA_BEGIN_QUEST_ID],
  },
  {
    description:
      'The Toa Metru Matoran return to their districts and resume the work they knew before the stones found them—mask forging in Ta-Metru, teaching in Ga-Metru, chute testing in Le-Metru, and carving in Po-Metru.',
    durationSeconds: 20 * 60,
    id: SETTLE_METRU_NUI_QUEST_ID,
    name: 'Settling Back Into Metru Nui',
    requirements: { matoran: ['Vakama', 'Nokama', 'Matau', 'Onewa'], minLevel: 26 },
    rewards: {
      currency: 6500,
      xpPerMatoran: 5500,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_TOA_STONES_QUEST_ID],
  },
  {
    description:
      'Nuju reports to the Knowledge Towers of Ko-Metru, resuming his work transcribing prophecies and cataloguing research alongside the city’s scholars.',
    durationSeconds: 22 * 60,
    id: ACTIVATE_KNOWLEDGE_TOWERS_QUEST_ID,
    name: 'Knowledge Towers Reopened',
    requirements: { matoran: ['Nuju'], minLevel: 27 },
    rewards: {
      currency: 7000,
      xpPerMatoran: 6000,
    },
    section: 'Metru Nui',
    unlockedAfter: [SETTLE_METRU_NUI_QUEST_ID],
  },
  {
    description:
      'Whenua descends into the Archives beneath Onu-Metru, returning to his duties as archivist—sorting artifacts, updating records, and tending the stasis chambers.',
    durationSeconds: 22 * 60,
    id: UNLOCK_ARCHIVES_QUEST_ID,
    name: 'Archives Reopened',
    requirements: { matoran: ['Whenua'], minLevel: 27 },
    rewards: {
      currency: 7000,
      xpPerMatoran: 6000,
    },
    section: 'Metru Nui',
    unlockedAfter: [SETTLE_METRU_NUI_QUEST_ID],
  },
];
