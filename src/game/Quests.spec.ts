import { getAvailableQuests } from './Quests';
import { Quest } from '../types/Quests';

describe('Quests', () => {
  describe('getAvailableQuests', () => {
    const mockQuests: Quest[] = [
      {
        description: 'A starting quest',
        durationSeconds: 60,
        id: 'quest1',
        name: 'First Quest',
        requirements: {},
        rewards: {},
      },
      {
        description: 'Unlocked after quest1',
        durationSeconds: 120,
        id: 'quest2',
        name: 'Second Quest',
        requirements: {},
        rewards: {},
        unlockedAfter: ['quest1'],
      },
      {
        description: 'Unlocked after quest1 and quest2',
        durationSeconds: 180,
        id: 'quest3',
        name: 'Third Quest',
        requirements: {},
        rewards: {},
        unlockedAfter: ['quest1', 'quest2'],
      },
      {
        description: 'No prerequisites',
        durationSeconds: 90,
        id: 'quest4',
        name: 'Independent Quest',
        requirements: {},
        rewards: {},
      },
    ];

    test('returns all quests with no prerequisites when nothing is completed', () => {
      const available = getAvailableQuests(mockQuests, [], []);

      expect(available).toHaveLength(2);
      expect(available.map((q) => q.id)).toContain('quest1');
      expect(available.map((q) => q.id)).toContain('quest4');
    });

    test('unlocks quest2 after quest1 is completed', () => {
      const available = getAvailableQuests(mockQuests, ['quest1'], []);

      expect(available.map((q) => q.id)).toContain('quest2');
      expect(available.map((q) => q.id)).toContain('quest4');
      expect(available.map((q) => q.id)).not.toContain('quest1'); // already completed
    });

    test('unlocks quest3 only after both quest1 and quest2 are completed', () => {
      const availableAfterQuest1 = getAvailableQuests(mockQuests, ['quest1'], []);
      expect(availableAfterQuest1.map((q) => q.id)).not.toContain('quest3');

      const availableAfterBoth = getAvailableQuests(mockQuests, ['quest1', 'quest2'], []);
      expect(availableAfterBoth.map((q) => q.id)).toContain('quest3');
    });

    test('excludes active quests from available list', () => {
      const available = getAvailableQuests(mockQuests, [], ['quest1']);

      expect(available.map((q) => q.id)).not.toContain('quest1');
      expect(available.map((q) => q.id)).toContain('quest4');
    });

    test('excludes completed quests from available list', () => {
      const available = getAvailableQuests(mockQuests, ['quest1'], []);

      expect(available.map((q) => q.id)).not.toContain('quest1');
    });

    test('excludes both active and completed quests', () => {
      const available = getAvailableQuests(mockQuests, ['quest1'], ['quest2', 'quest4']);

      expect(available).toHaveLength(0);
    });

    test('returns empty array when all quests are completed', () => {
      const available = getAvailableQuests(
        mockQuests,
        ['quest1', 'quest2', 'quest3', 'quest4'],
        []
      );

      expect(available).toHaveLength(0);
    });

    test('returns empty array when all quests are active', () => {
      const available = getAvailableQuests(
        mockQuests,
        [],
        ['quest1', 'quest2', 'quest3', 'quest4']
      );

      expect(available).toHaveLength(0);
    });

    test('handles empty quest list', () => {
      const available = getAvailableQuests([], [], []);

      expect(available).toHaveLength(0);
    });

    test('handles quest with multiple prerequisites correctly', () => {
      const available = getAvailableQuests(
        mockQuests,
        ['quest1'], // only quest1 completed
        []
      );

      // quest3 requires both quest1 AND quest2, so it should not be available
      expect(available.map((q) => q.id)).not.toContain('quest3');
    });
  });
});
