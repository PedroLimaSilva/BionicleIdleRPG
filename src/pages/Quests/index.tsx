import { AvailableQuests } from '../../components/AvailableQuests';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { QuestProgress } from '../../types/Quests';
import './index.scss';

export const QuestsPage = () => {
  const {
    activeQuests,
    completedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
    recruitedCharacters,
    inventory,
  } = useGame();

  const getQuestById = (id: string) => QUESTS.find((q) => q.id === id);

  const formatTimeRemaining = (end: number) => {
    const secondsLeft = end - Math.floor(Date.now() / 1000);
    if (secondsLeft <= 0) return 'Complete!';
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}m ${secs}s`;
  };

  const canComplete = (quest: QuestProgress) => {
    const secondsLeft = quest.endsAt - Math.floor(Date.now() / 1000);
    if (secondsLeft <= 0) return true;
    return false;
  };

  return (
    <div className='page-container quests-page'>
      <h2 className='quests-page__title'>Ongoing Quests</h2>
      {activeQuests.length === 0 ? (
        <p className='quests-page__empty'>No active quests right now.</p>
      ) : (
        <ul className='quests-page__list'>
          {activeQuests.map((progress) => {
            const quest = getQuestById(progress.questId);
            if (!quest) return null;

            return (
              <li key={progress.questId} className='quests-page__item'>
                <h3 className='quests-page__item-title'>{quest.name}</h3>
                <p className='quests-page__item-desc'>{quest.description}</p>
                <p className='quests-page__item-meta'>
                  Time Remaining: {formatTimeRemaining(progress.endsAt)}
                </p>
                <p className='quests-page__item-meta'>
                  Assigned Matoran: {progress.assignedMatoran.join(', ')}
                </p>

                <div className='quests-page__button-container'>
                  <button
                    className='quests-page__cancel'
                    onClick={() => cancelQuest(progress.questId)}
                  >
                    Cancel Quest
                  </button>
                  <button
                    className='quests-page__complete'
                    disabled={!canComplete(progress)}
                    onClick={() => completeQuest(quest)}
                  >
                    Complete Quest
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className='quests-page__title'>Available Quests</h2>
      <AvailableQuests
        allQuests={QUESTS}
        activeQuestIds={activeQuests.map((aq) => aq.questId)}
        completedQuestIds={completedQuests}
        recruitedCharacters={recruitedCharacters}
        inventory={inventory}
        startQuest={startQuest}
      />

      <h2 className='quests-page__title'>Completed Quests</h2>
      {completedQuests.length === 0 ? (
        <p className='quests-page__empty'>
          You haven't completed any quests yet.
        </p>
      ) : (
        <ul className='quests-page__list quests-page__completed'>
          {completedQuests.map((id) => {
            const quest = getQuestById(id);
            return (
              <li key={id} className='quests-page__item'>
                <h3 className='quests-page__item-title'>{quest?.name || id}</h3>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
