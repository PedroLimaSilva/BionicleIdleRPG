import { Quest } from '../../types/Quests';

/** Gates custom-character Toa evolution and unlocks the Metru Nui saga. */
export const METRU_NUI_SAGA_BEGIN_QUEST_ID = 'story_metru_nui_saga_begin';

/** Vakama's encounter with Turaga Dume and the map to the Great Temple. */
export const METRU_VAKAMA_DUME_QUEST_ID = 'metru_vakama_dume_and_the_great_temple';

/** The six Matoran answer Lhikan's call at the Great Temple and become Toa Metru. */
export const METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID = 'metru_great_temple_transformation';

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
      'At Kini-Nui, Turaga Vakama gathers the Toa around the Amaja Circle. He tells how Toa Lhikan sealed the Toa Stones, delivered them to six Matoran across Metru Nui, and was taken by the Dark Hunters—leaving Vakama with a stone and a vision of horror.',
    durationSeconds: 15 * 60,
    id: METRU_NUI_SAGA_BEGIN_QUEST_ID,
    name: 'Tales of the Lost City',
    requirements: { matoran: ['Takanuva', 'Hahli', 'Jaller'], minLevel: 24 },
    rewards: {
      currency: 5500,
      cutscene: { cutsceneId: 'metru_vakama_lhikan_story', type: 'visual_novel' },
      unlockCharacters: [
        { cost: 3000, id: 'Toa_Lhikan' },
        ...METRU_TOA_CANDIDATE_RECRUIT_IDS.map((id) => ({ cost: 1500, id })),
      ],
      xpPerMatoran: 4500,
    },
    section: 'Metru Nui',
    unlockedAfter: ['mol_rediscovery_of_metru_nui'],
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
    unlockedAfter: [METRU_NUI_SAGA_BEGIN_QUEST_ID],
  },
  {
    description:
      'Following the map on Lhikan’s wrapping, Vakama journeys to the Great Temple in Ga-Metru. Five other Matoran arrive with Toa Stones of their own. At the Toa Suva, Lhikan’s final message reaches them—and six Matoran become Toa Metru.',
    durationSeconds: 22 * 60,
    id: METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID,
    name: 'Destiny at the Great Temple',
    requirements: { matoran: [...METRU_TOA_CANDIDATE_RECRUIT_IDS], minLevel: 27 },
    rewards: {
      currency: 7000,
      cutscene: { cutsceneId: 'metru_great_temple_transformation', type: 'visual_novel' },
      xpPerMatoran: 6000,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_VAKAMA_DUME_QUEST_ID],
  },
];
