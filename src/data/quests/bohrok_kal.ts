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
      'The Toa Nuva agree to split up and help their villages with the reconstruction. Each returns to their Koro—Tahu to Ta-Koro, Gali to Ga-Koro, Kopaka to Ko-Koro, Lewa to Le-Wahi, Onua to Onu-Koro, Pohatu to Po-Koro—to lend their newfound strength to the effort.',
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
      "The Bohrok Kal—six elite Bohrok—steal the Nuva symbols from the Suvas. The Toa Nuva's elemental power vanishes. Kopaka falls from an ice bridge without his power. Tahu is buried by rubble when he tries to stop one of the Kal. Lewa's airborne display is cut short miles above Mata Nui—Kongu rescues him on a Gukko. Gali is nearly drowned by a tidal wave she can no longer control. The Toa are scattered and helpless.",
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
      'The Toa Nuva race to the Bohrok nest, hoping to reach it before the Kal. They plan to use the Exo-Toa armor to stop the Bohrok Kal from placing the Nuva symbols on the Nuva Cube—the key to releasing the Bahrag.',
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
      "At the last moment, Tahu summons the Vahi and slows time around the Kal. Their Krana-Kal turn silver and project an impenetrable force field. With no other choice, the Toa reach out mentally to the symbols, feeding power to the Kal. The Kal's own powers spiral out of control—each destroyed by their own element. Nuhvok-Kal collapses into a black hole. Pahrak-Kal melts through the earth. Gahlok-Kal is crushed by Exo-Toa debris. Lehvak-Kal is blasted into space. Tahnok-Kal is imprisoned by electricity. Kohrak-Kal disintegrates from sound. The symbols are reclaimed. The Toa's power returns. The Bahrag remain imprisoned.",
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
      'After the Bohrok-Kal were defeated, the Turaga gather the Matoran population at Kini-Nui. There, they reveal Takua and Jala—rebuilt into taller forms—and the Matoran cheer. The Turaga teach the villagers how to rebuild themselves to better prepare for any upcoming threats. A Naming Day ceremony follows: Jala becomes Jaller, Maku becomes Macku, and Huki becomes Hewkii, honored for their heroism during the crisis. All who attended are rebuilt into stronger forms.',
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
      xpPerMatoran: 1500,
      currency: 2000,
      loot: {},
    },
    unlockedAfter: [BOHROK_KAL_FINAL_CONFRONTATION_QUEST_ID],
    section: 'Bohrok Kal',
  },
];
