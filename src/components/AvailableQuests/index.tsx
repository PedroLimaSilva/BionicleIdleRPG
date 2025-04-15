import { GameItemId, ITEM_DICTIONARY } from '../../data/loot';
import { MATORAN_DEX } from '../../data/matoran';
import { getLevelFromExp } from '../../game/Levelling';
import { getAvailableQuests } from '../../game/Quests';
import { Inventory } from '../../services/inventoryUtils';
import { RecruitedCharacterData } from '../../types/Matoran';
import { Quest, QuestItemRequirement } from '../../types/Quests';
import './index.scss';

interface AvailableQuestsProps {
  allQuests: Quest[];
  completedQuestIds: string[];
  activeQuestIds: string[];
  recruitedCharacters: RecruitedCharacterData[];
  inventory: Inventory;
  startQuest: (
    quest: Quest,
    assignedMatoran: RecruitedCharacterData['id'][]
  ) => void;
}

export const AvailableQuests: React.FC<AvailableQuestsProps> = ({
  allQuests,
  completedQuestIds,
  activeQuestIds,
  recruitedCharacters,
  inventory,
  startQuest,
}) => {
  const available = getAvailableQuests(
    allQuests,
    completedQuestIds,
    activeQuestIds
  );

  const hasMatoran = (requiredIds: string[] = [], minLevel: number = 1) =>
    requiredIds.every((id) =>
      recruitedCharacters.some(
        (m) => m.id === id && getLevelFromExp(m.exp) >= minLevel
      )
    );

  const hasItems = (items: QuestItemRequirement[] = []) =>
    items.every((req) => (inventory[req.id] || 0) >= req.amount);

  const isRequirementMet = (quest: Quest) =>
    hasMatoran(quest.requirements.matoran, quest.requirements.minLevel) &&
    hasItems(quest.requirements.items);

  return (
    <div className='available-quests'>
      {available.length === 0 ? (
        <p className='available-quests__empty'>
          No quests are available right now.
        </p>
      ) : (
        <ul className='available-quests__list'>
          {available.map((quest: Quest) => {
            const canStart = isRequirementMet(quest);
            return (
              <li key={quest.id} className='available-quests__item'>
                <h3 className='available-quests__item-title'>{quest.name}</h3>
                <p className='available-quests__item-desc'>
                  {quest.description}
                </p>
                <p className='available-quests__item-meta'>
                  Duration: {Math.floor(quest.durationSeconds / 60)} minutes
                </p>

                <div className='available-quests__req'>
                  <strong>Matoran:</strong>
                  <br />
                  {quest.requirements.matoran?.map((id) => {
                    const has = recruitedCharacters.some(
                      (m) =>
                        m.id === id &&
                        getLevelFromExp(m.exp) >=
                          (quest.requirements.minLevel ?? 1)
                    );
                    return (
                      <span
                        key={id}
                        className={`requirement-chip ${
                          has ? 'met' : 'missing'
                        }`}
                      >
                        {MATORAN_DEX[id].name}
                      </span>
                    );
                  })}
                  {quest.requirements.minLevel && (
                    <p className='available-quests__item-meta'>
                      All characters must be at lvl{' '}
                      {quest.requirements.minLevel} or higher
                    </p>
                  )}
                </div>

                <div className='available-quests__req'>
                  <strong>Items:</strong>
                  <br />
                  {quest.requirements.items?.map(({ id, amount }) => {
                    const has = (inventory[id] || 0) >= amount;
                    return (
                      <span
                        key={id}
                        className={`requirement-chip ${
                          has ? 'met' : 'missing'
                        }`}
                      >
                        {amount} × {id}
                      </span>
                    );
                  })}
                </div>

                <div className='available-quests__rewards'>
                  <strong>Rewards:</strong>
                  <ul>
                    {quest.rewards.currency && (
                      <li>
                        <span className='reward-label'>Currency:</span>{' '}
                        {quest.rewards.currency}
                      </li>
                    )}
                    {quest.rewards.loot &&
                      Object.entries(quest.rewards.loot).map(
                        ([itemId, amount]) => (
                          <li key={itemId}>
                            <span className='reward-label'>Item:</span> {amount}{' '}
                            × {ITEM_DICTIONARY[itemId as GameItemId].name}
                          </li>
                        )
                      )}
                    {quest.rewards.xpPerMatoran && (
                      <li>
                        <span className='reward-label'>XP/Matoran:</span>{' '}
                        {quest.rewards.xpPerMatoran}
                      </li>
                    )}
                    {quest.rewards.unlockCharacters &&
                      quest.rewards.unlockCharacters.length > 0 && (
                        <li>
                          <span className='reward-label'>Unlocks:</span>{' '}
                          {quest.rewards.unlockCharacters
                            .map((char) => MATORAN_DEX[char.id].name)
                            .join(', ')}
                        </li>
                      )}
                  </ul>
                </div>

                <button
                  className='available-quests__start'
                  disabled={!canStart}
                  onClick={() =>
                    quest.requirements.matoran &&
                    startQuest(quest, quest.requirements.matoran)
                  }
                >
                  Start Quest
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
