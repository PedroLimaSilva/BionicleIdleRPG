import { Quest } from '../../types/Quests';
import { GameItemId } from '../loot';

export const MASK_HUNT: Quest[] = [
  {
    id: 'story_toa_arrival',
    name: 'The Arrival of the Toa',
    description:
      'After a thousand years of waiting, six mysterious canisters crash upon the shores of Mata Nui. From within emerge six powerful beings—heroes foretold in prophecy. With no memory of their past, each Toa seeks out their Turaga, who reveals their destiny: to find the Masks of Power and unite against the shadow of Makuta.',
    durationSeconds: 60,
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      cutscene: 'Fk47EDfWK10',
      unlockCharacters: [
        { id: 'Toa_Tahu', cost: 0, requiredItems: [] },
        { id: 'Toa_Gali', cost: 0, requiredItems: [] },
        { id: 'Toa_Kopaka', cost: 0, requiredItems: [] },
        { id: 'Toa_Lewa', cost: 0, requiredItems: [] },
        { id: 'Toa_Onua', cost: 0, requiredItems: [] },
        { id: 'Toa_Pohatu', cost: 0, requiredItems: [] },
      ],
      xpPerMatoran: 100,
      currency: 1000,
      loot: {},
    },
    unlockedAfter: [],
  },
  {
    id: 'maskhunt_kopaka_pohatu_icecliff',
    name: 'The Cliffside Encounter',
    description:
      'As Kopaka explores the frozen drifts of Ko-Wahi, he unexpectedly crosses paths with Pohatu, who arrived chasing a Rahi sighting from the desert’s edge. Though their temperaments clash, the two agree to investigate a nearby crevasse said to conceal an Kanohi Mask. There, they must work together to survive an avalanche and fend off ambushing Rahi to retrieve the Mask of Shielding.',
    durationSeconds: 480, // 8 minutes
    requirements: {
      matoran: ['Toa_Kopaka', 'Toa_Pohatu'],
      minLevel: 1,
      items: [],
    },
    rewards: {
      xpPerMatoran: 450,
      currency: 800,
      loot: {
        [GameItemId.IceChip]: 100,
        [GameItemId.StoneBlock]: 100,
      },
    },
    unlockedAfter: ['story_toa_arrival'],
  },
  {
    id: 'story_toa_council',
    name: 'The Toa Council',
    description:
      'Following a chance encounter between Kopaka and Pohatu, they find the other four Toa gathered near the slops of Mount Ihu. Though tensions arise between their differing personalities and priorities, they come to a shared understanding: each must search for the scattered Kanohi and grow stronger in preparation for the battle against Makuta. They part ways with a mutual vow to reunite when the time is right.',
    durationSeconds: 30 * 60, // 2 minutes
    requirements: {
      matoran: [
        'Toa_Tahu',
        'Toa_Gali',
        'Toa_Kopaka',
        'Toa_Lewa',
        'Toa_Onua',
        'Toa_Pohatu',
      ],
      minLevel: 1,
      items: [],
    },
    rewards: {
      xpPerMatoran: 1000,
      currency: 500,
      loot: {},
    },
    unlockedAfter: ['maskhunt_kopaka_pohatu_icecliff'],
  },
  {
    id: 'maskhunt_tahu_cave_akaku',
    name: 'The Shadows Below',
    description:
      'After the Toa Council, Tahu ventures alone and Jala tells him of a deep Onu-Wahi cave rumored to house the Mask of X-Ray Vision. Within the darkness, he faces vicious Rahi corrupted by Makuta’s influence. He must fight alone, his flame the only light against the shadows.',
    durationSeconds: 30 * 60, // 30 minutes
    requirements: {
      matoran: ['Toa_Tahu'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      xpPerMatoran: 400,
      currency: 700,
      loot: {
        [GameItemId.LightStone]: 100,
        [GameItemId.BurnishedAlloy]: 50,
      },
    },
    unlockedAfter: ['mnog_tahu_unlock_01', 'story_toa_council'],
  },
  {
    id: 'maskhunt_lewa_pakari',
    name: 'Strength Below the Surface',
    description:
      'Against the better judgment of his peers, Lewa dives into the caverns of Onu-Wahi, drawn by rumors of a powerful Kanohi hidden deep within. In the oppressive darkness, he finds not only the Pakari but also a hulking Rahi warped by Makuta’s corruption. With agility and cunning as his only allies, Lewa must overcome brute force to claim the Mask of Strength.',
    durationSeconds: 540, // 9 minutes
    requirements: {
      matoran: ['Toa_Lewa'],
      minLevel: 5,
      items: [],
    },
    rewards: {
      xpPerMatoran: 500,
      currency: 900,
      loot: {
        [GameItemId.LightStone]: 60,
        [GameItemId.BiolumeThread]: 30,
      },
    },
    unlockedAfter: ['story_toa_council'],
  }
];
