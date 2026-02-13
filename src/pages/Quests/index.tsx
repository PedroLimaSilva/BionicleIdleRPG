import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AvailableQuests } from '../../components/AvailableQuests';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { QuestProgress } from '../../types/Quests';
import './index.scss';
import { MATORAN_DEX } from '../../data/matoran';

const DEFAULT_SECTION_LABEL = 'Other Quests';

const SECTION_ORDER: Record<string, number> = {
  'Infected Rahi / Hunt for the Masks': 0,
  'Bohrok Swarms': 1,
  [DEFAULT_SECTION_LABEL]: 2,
};

type SectionGroup = {
  section: string;
  questIds: string[];
};

export const QuestsPage = () => {
  const {
    activeQuests,
    completedQuests,
    startQuest,
    cancelQuest,
    completeQuest,
    recruitedCharacters,
    inventory,
    collectedKrana,
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

  const [cutsceneUrl, setCutsceneUrl] = useState<string | null>(null);
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const completedSections = useMemo<SectionGroup[]>(() => {
    const questOrder = new Map(QUESTS.map((q, i) => [q.id, i]));
    const map = new Map<string, string[]>();

    completedQuests.forEach((id) => {
      const quest = getQuestById(id);
      const section = quest?.section ?? DEFAULT_SECTION_LABEL;
      const existing = map.get(section) ?? [];
      existing.push(id);
      map.set(section, existing);
    });

    return Array.from(map.entries())
      .map(([section, questIds]) => ({
        section,
        questIds: questIds.sort((a, b) => (questOrder.get(a) ?? 0) - (questOrder.get(b) ?? 0)),
      }))
      .sort(
        (a, b) =>
          (SECTION_ORDER[a.section] ?? 99) - (SECTION_ORDER[b.section] ?? 99) ||
          a.section.localeCompare(b.section)
      );
  }, [completedQuests]);

  useEffect(() => {
    if (!completedSections.length) return;
    setExpandedSections((prev) => {
      if (Object.keys(prev).length) return prev;
      const initial: Record<string, boolean> = {};
      completedSections.forEach((s) => {
        initial[s.section] = true;
      });
      return initial;
    });
  }, [completedSections]);

  const handleCutscene = (cutscene: string) => {
    setCutsceneUrl(cutscene);
  };

  return (
    <div className="page-container quests-page">
      <h2 className="quests-page__title">Ongoing Quests</h2>
      {activeQuests.length === 0 ? (
        <p className="quests-page__empty">No active quests right now.</p>
      ) : (
        <ul className="quests-page__list">
          {activeQuests.map((progress) => {
            const quest = getQuestById(progress.questId);
            if (!quest) return null;

            return (
              <li key={progress.questId} className="quests-page__item">
                <h3 className="quests-page__item-title">{quest.name}</h3>
                <p className="quests-page__item-desc">{quest.description}</p>
                <p className="quests-page__item-meta">
                  Time Remaining: {formatTimeRemaining(progress.endsAt)}
                </p>
                <p className="quests-page__item-meta">
                  Assigned Characters:{' '}
                  {progress.assignedMatoran.map((m) => MATORAN_DEX[m].name).join(', ')}
                </p>

                <div className="quests-page__button-container">
                  <button
                    className="quests-page__cancel"
                    onClick={() => cancelQuest(progress.questId)}
                  >
                    Cancel Quest
                  </button>
                  <button
                    className="quests-page__complete"
                    disabled={!canComplete(progress)}
                    onClick={() => {
                      completeQuest(quest);
                      if (quest.rewards.cutscene) handleCutscene(quest.rewards.cutscene);
                    }}
                  >
                    Complete Quest
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="quests-page__title">Available Quests</h2>
      <AvailableQuests
        allQuests={QUESTS}
        activeQuestIds={activeQuests.map((aq) => aq.questId)}
        completedQuestIds={completedQuests}
        recruitedCharacters={recruitedCharacters}
        inventory={inventory}
        collectedKrana={collectedKrana}
        startQuest={startQuest}
      />

      <h2 className="quests-page__title">Completed Quests</h2>
      {completedQuests.length === 0 ? (
        <p className="quests-page__empty">You haven't completed any quests yet.</p>
      ) : (
        <div className="quests-page__sections">
          {completedSections.map((sec) => {
            const isSectionExpanded = expandedSections[sec.section] ?? true;
            return (
              <div key={sec.section} className="quests-page__section">
                <button
                  type="button"
                  className="quests-page__section-header"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      [sec.section]: !isSectionExpanded,
                    }))
                  }
                >
                  <span className="quests-page__section-title">{sec.section}</span>
                  <span className="quests-page__section-meta">
                    {sec.questIds.length} quest{sec.questIds.length !== 1 ? 's' : ''}
                    <span className="quests-page__section-chevron" aria-hidden="true">
                      {isSectionExpanded ? (
                        <ChevronDown size={18} strokeWidth={2.5} />
                      ) : (
                        <ChevronRight size={18} strokeWidth={2.5} />
                      )}
                    </span>
                  </span>
                </button>
                {isSectionExpanded && (
                  <ul className="quests-page__list quests-page__completed">
                    {sec.questIds.map((id) => {
                      const quest = getQuestById(id);
                      const isExpanded = expandedQuestId === id;

                      if (!quest) return null;

                      return (
                        <li key={id} className="quests-page__item">
                          <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => setExpandedQuestId(isExpanded ? null : id)}
                          >
                            <h3 className="quests-page__item-title">{quest.name}</h3>
                          </div>
                          <div
                            className={`quests-page__accordion-content ${
                              isExpanded ? 'quests-page__accordion-content--expanded' : ''
                            }`}
                          >
                            <p className="quests-page__item-desc">{quest.description}</p>
                            {quest.rewards.cutscene && (
                              <button
                                className="quests-page__complete"
                                onClick={() => handleCutscene(quest.rewards.cutscene!)}
                              >
                                Replay Cutscene
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
      {cutsceneUrl && (
        <div className="modal-overlay" onClick={() => setCutsceneUrl(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setCutsceneUrl(null)}>
              ✖
            </button>
            <div className="modal-video-wrapper">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${cutsceneUrl}?si=nxWcOaAKDqTtrf2b&amp`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
