import { useGame } from '../../context/Game';
import { AvailableQuests } from '../../components/AvailableQuests';
import { QUESTS } from '../../data/quests';

export function QuestsPage() {
  const { activeQuests, completedQuests, inventory, recruitedCharacters } =
    useGame();

  return (
    <div className='page-container'>
      <AvailableQuests
        allQuests={QUESTS}
        activeQuestIds={activeQuests.map((q) => q.questId)}
        completedQuestIds={completedQuests}
        inventory={inventory}
        recruitedCharacters={recruitedCharacters}
        startQuest={() => {}}
      />
    </div>
  );
}
