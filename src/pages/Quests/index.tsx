import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AvailableQuests } from '../../components/AvailableQuests';
import { VisualNovelCutscene } from '../../components/VisualNovelCutscene';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { VISUAL_NOVEL_CUTSCENES } from '../../data/cutscenes';
import { QuestProgress } from '../../types/Quests';
import type { VisualNovelCutsceneRef } from '../../types/Cutscenes';
import './index.scss';
import { MATORAN_DEX } from '../../data/matoran';
import { MOTION_DURATION, MOTION_EASING, buildTransition } from '../../motion/transitions';

const DEFAULT_SECTION_LABEL = 'Other Quests';

const SECTION_ORDER: Record<string, number> = {
  'Arrival of the Toa': 0,
  "The Cronicler's Journey": 1,
  'Bohrok Swarms': 2,
  [DEFAULT_SECTION_LABEL]: 3,
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

  const [activeCutscene, setActiveCutscene] = useState<VisualNovelCutsceneRef | null>(null);
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const shouldReduceMotion = useReducedMotion() ?? false;
  const accordionTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.standard,
    },
    shouldReduceMotion
  );

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

  const handleCutscene = (ref: VisualNovelCutsceneRef) => {
    setActiveCutscene(ref);
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
                <AnimatePresence initial={false}>
                  {isSectionExpanded && (
                    <motion.ul
                      key={`${sec.section}-completed-list`}
                      className="quests-page__list quests-page__completed"
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={accordionTransition}
                      style={{ overflow: 'hidden' }}
                    >
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
                            <AnimatePresence initial={false}>
                              {isExpanded && (
                                <motion.div
                                  key={`${id}-content`}
                                  className="quests-page__accordion-content quests-page__accordion-content--expanded"
                                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={accordionTransition}
                                  style={{ overflow: 'hidden' }}
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
      {activeCutscene && VISUAL_NOVEL_CUTSCENES[activeCutscene.cutsceneId] && (
        <VisualNovelCutscene
          cutscene={VISUAL_NOVEL_CUTSCENES[activeCutscene.cutsceneId]!}
          onClose={() => setActiveCutscene(null)}
        />
      )}
    </div>
  );
};
