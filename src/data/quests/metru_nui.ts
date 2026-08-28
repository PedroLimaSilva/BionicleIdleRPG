import { Quest } from '../../types/Quests';

/** Gates custom-character Toa evolution and unlocks the Metru Nui saga. */
export const METRU_NUI_SAGA_BEGIN_QUEST_ID = 'story_metru_nui_saga_begin';

/** Kapura witnesses the Morbuzakh vines destroy an abandoned Ta-Metru forge. */
export const METRU_KAPURA_MORBUZAKH_QUEST_ID = 'metru_kapura_morbuzakh';

/** Vakama's encounter with Turaga Dume and the map to the Great Temple. */
export const METRU_VAKAMA_DUME_QUEST_ID = 'metru_vakama_dume_and_the_great_temple';

/** The six Matoran answer Lhikan's call at the Great Temple and become Toa Metru. */
export const METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID = 'metru_great_temple_transformation';

/** The Toa Metru claim their tools, learn of the Great Disks, and set out to find six Matoran. */
export const METRU_SEEK_GREAT_DISKS_QUEST_ID = 'metru_seek_the_great_disks';

/** Toa Nokama tracks down Vhisola and the Ga-Metru Great Disk. */
export const METRU_NOKAMA_GREAT_DISK_QUEST_ID = 'metru_nokama_great_disk';

/** Toa Vakama tracks down Nuhrii and the Ta-Metru Great Disk. */
export const METRU_VAKAMA_GREAT_DISK_QUEST_ID = 'metru_vakama_great_disk';

/** Toa Whenua tracks down Tehutti and the Onu-Metru Great Disk. */
export const METRU_WHENUA_GREAT_DISK_QUEST_ID = 'metru_whenua_great_disk';

/** Future Toa Metru Matoran — no Kanoka disk launcher on the rig. */
const METRU_TOA_CANDIDATE_RECRUIT_IDS = [
  'Matau',
  'Nokama',
  'Nuju',
  'Onewa',
  'Vakama',
  'Whenua',
] as const;

/** Evolved Toa Metru — required for the Great Disks quest line. */
const METRU_TOA_RECRUIT_IDS = [
  'Toa_Matau',
  'Toa_Nokama',
  'Toa_Nuju',
  'Toa_Onewa',
  'Toa_Vakama',
  'Toa_Whenua',
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
        { cost: 750, id: 'Kapura' },
      ],
      xpPerMatoran: 4500,
    },
    section: 'Metru Nui',
    unlockedAfter: ['mol_rediscovery_of_metru_nui'],
  },
  {
    description:
      'While Toa Lhikan delivers the Toa Stones across Metru Nui, Kapura patrols the abandoned outskirts of Ta-Metru—checking forsaken forges and factories for anything left behind. Workers have been vanishing, and something far worse than rumor is stirring in the shadows.',
    durationSeconds: 18 * 60,
    id: METRU_KAPURA_MORBUZAKH_QUEST_ID,
    name: 'Morbuzakh',
    requirements: { matoran: ['Kapura'], minLevel: 26 },
    rewards: {
      currency: 6000,
      cutscene: { cutsceneId: 'metru_kapura_morbuzakh', type: 'visual_novel' },
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
      unlockCharacters: [
        { cost: 500, id: 'bordakh' },
        { cost: 500, id: 'nuurakh' },
        { cost: 500, id: 'vorzakh' },
        { cost: 500, id: 'zadakh' },
        { cost: 500, id: 'rorzakh' },
        { cost: 500, id: 'keerakh' },
      ],
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
  {
    description:
      'Newly transformed at the Great Temple, the Toa Metru claim their tools from the Toa Suva and discover six Kanoka disks bearing their own masks. Vakama’s vision of Metru Nui in ruin points to the Great Disks—and six Matoran who can help find them before a four-legged Dark Hunter strikes.',
    durationSeconds: 20 * 60,
    id: METRU_SEEK_GREAT_DISKS_QUEST_ID,
    name: 'Search for the Great Disks',
    requirements: { matoran: [...METRU_TOA_RECRUIT_IDS], minLevel: 28 },
    rewards: {
      currency: 7500,
      cutscene: { cutsceneId: 'metru_seek_the_great_disks', type: 'visual_novel' },
      xpPerMatoran: 6500,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_GREAT_TEMPLE_TRANSFORMATION_QUEST_ID],
  },
  {
    description:
      'Toa Nokama returns to Ga-Metru to find her old student Vhisola—one of six Matoran who can lead the Toa to the Great Disks. But Vhisola has vanished, Vahki patrol the canals, and a four-legged hunter has already struck the Archives lab.',
    durationSeconds: 25 * 60,
    id: METRU_NOKAMA_GREAT_DISK_QUEST_ID,
    name: 'The Ga-Metru Great Disk',
    requirements: { matoran: ['Toa_Nokama'], minLevel: 28 },
    rewards: {
      currency: 8000,
      cutscene: { cutsceneId: 'metru_nokama_great_disk', type: 'visual_novel' },
      unlockCharacters: [{ cost: 1200, id: 'Vhisola' }],
      xpPerMatoran: 7000,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_SEEK_GREAT_DISKS_QUEST_ID],
  },
  {
    description:
      'Toa Vakama returns to Ta-Metru searching for the mask maker Nuhrii—one of six Matoran who can lead the Toa to the Great Disks. Morbuzakh vines attack a protodermis vat, a four-legged hunter has sabotaged the forges, and Nuhrii has vanished into the abandoned northern reaches.',
    durationSeconds: 25 * 60,
    id: METRU_VAKAMA_GREAT_DISK_QUEST_ID,
    name: 'The Ta-Metru Great Disk',
    requirements: { matoran: ['Toa_Vakama'], minLevel: 28 },
    rewards: {
      currency: 8000,
      cutscene: { cutsceneId: 'metru_vakama_great_disk', type: 'visual_novel' },
      unlockCharacters: [{ cost: 1200, id: 'Nuhrii' }],
      xpPerMatoran: 7000,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_SEEK_GREAT_DISKS_QUEST_ID],
  },
  {
    description:
      'Toa Whenua returns to the Onu-Metru Archives searching for Tehutti—one of six Matoran who can lead the Toa to the Great Disks. A forged Nui-Jaga trade lured the archivist underground, a Rahkshi stalks the deepest levels, and a four-legged hunter waits in the shadows.',
    durationSeconds: 25 * 60,
    id: METRU_WHENUA_GREAT_DISK_QUEST_ID,
    name: 'The Onu-Metru Great Disk',
    requirements: { matoran: ['Toa_Whenua'], minLevel: 28 },
    rewards: {
      currency: 8000,
      cutscene: { cutsceneId: 'metru_whenua_great_disk', type: 'visual_novel' },
      unlockCharacters: [{ cost: 1200, id: 'Tehutti' }],
      xpPerMatoran: 7000,
    },
    section: 'Metru Nui',
    unlockedAfter: [METRU_SEEK_GREAT_DISKS_QUEST_ID],
  },
];
