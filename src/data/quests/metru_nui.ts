import { Quest } from '../../types/Quests';

/** Gates custom-character Toa evolution and unlocks the Metru Nui saga. */
export const METRU_NUI_SAGA_BEGIN_QUEST_ID = 'story_metru_nui_saga_begin';

/** Unlocks recruitment of the future Toa Metru Matoran (non–Great Disk carriers). */
export const METRU_TOA_STONES_QUEST_ID = 'metru_toa_stones_for_new_generation';

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
];
