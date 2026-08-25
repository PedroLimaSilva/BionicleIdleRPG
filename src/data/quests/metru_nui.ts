import { Quest } from '../../types/Quests';

/** Gates custom-character Toa evolution and unlocks the Metru Nui saga. */
export const METRU_NUI_SAGA_BEGIN_QUEST_ID = 'story_metru_nui_saga_begin';

/** Unlocks recruitment of the future Toa Metru Matoran (non–Great Disk carriers). */
export const METRU_TOA_STONES_QUEST_ID = 'metru_toa_stones_for_new_generation';

/** Vakama's encounter with Turaga Dume and the map to the Great Temple. */
export const METRU_VAKAMA_DUME_QUEST_ID = 'metru_vakama_dume_and_the_great_temple';

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
      'With Lhikan gone, Turaga Dume announces his disappearance across Metru Nui and visits Vakama in his Ta-Metru forge—demanding the Mask of Time while Vahki stand watch. Vakama must hide the Toa Stone, endure the Turaga’s scrutiny, and decipher the map hidden in Lhikan’s wrapping before destiny calls him to the Great Temple.',
    durationSeconds: 20 * 60,
    id: METRU_VAKAMA_DUME_QUEST_ID,
    name: 'The Turaga’s Visit',
    requirements: { matoran: ['Vakama'], minLevel: 26 },
    rewards: {
      currency: 6500,
      cutscene: { cutsceneId: 'metru_vakama_dume_visit', type: 'visual_novel' },
      xpPerMatoran: 5500,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_TOA_STONES_QUEST_ID],
  },
];
