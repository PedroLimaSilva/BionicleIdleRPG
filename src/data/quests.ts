import { Quest } from '../types/Quests';
import { GameItemId } from './loot';

export const QUESTS: Quest[] = [
  {
    id: 'story_find_canister_beach',
    name: 'The Canister on the shore',
    description:
      'Takua finds a large cylindrical canister that washed ashore. Large footsteps lead from it to Ta-Wahi',
    durationSeconds: 1 * 60, // 1 minute
    requirements: {
      matoran: ['Takua'],
      minLevel: 5,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 5,
          consumed: true,
        },
      ],
    },
    rewards: {
      unlockCharacters: ['Kapura'],
      loot: {
        [GameItemId.Charcoal]: 100,
        [GameItemId.BurnishedAlloy]: 50,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    followUpQuests: ['story_tahu_unlock_01'],
    unlockedAfter: [],
  },
  {
    id: 'story_tahu_unlock_01',
    name: 'A disturbance in the Forest',
    description:
      'Jala and Kapura investigate a strange disturbance deep in the Ta-Wahi forest. Smoke rises where none should be—could the ancient legends be true?',
    durationSeconds: 1 * 60 * 60, // 1 hour
    requirements: {
      matoran: ['Jala', 'Kapura'],
      minLevel: 5,
      items: [
        {
          id: GameItemId.Charcoal,
          amount: 100,
          consumed: true,
        },
        {
          id: GameItemId.BurnishedAlloy,
          amount: 50,
          consumed: true,
        },
      ],
    },
    rewards: {
      unlockCharacters: ['toa_tahu'],
      loot: {
        [GameItemId.Charcoal]: 1000,
        [GameItemId.BurnishedAlloy]: 500,
      },
      xpPerMatoran: 150,
      currency: 500,
    },
    followUpQuests: ['story_tahu_unlock_02'],
    unlockedAfter: ['story_find_canister_beach'],
  },
];
