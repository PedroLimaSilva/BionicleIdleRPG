import type { Quest } from './Quests';

export type ChronicleUnlockCondition =
  | {
      type: 'QUEST_COMPLETED';
      questId: Quest['id'];
    }
  | {
      type: 'QUESTS_COMPLETED_ALL';
      questIds: Quest['id'][];
    };

export type ChronicleEntry = {
  id: string;
  title: string;
  description: string;
  section?: string;
  unlockCondition: ChronicleUnlockCondition;
};

export type ChronicleEntryWithState = ChronicleEntry & {
  isUnlocked: boolean;
};
