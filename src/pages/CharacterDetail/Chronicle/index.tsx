import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useGame } from '../../../context/Game';
import type { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { getCharacterChronicle } from '../../../services/chronicleUtils';
import type { ChronicleEntryWithState } from '../../../types/Chronicle';
import './index.scss';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../../motion/transitions';

type CharacterChronicleProps = {
  matoran: BaseMatoran & RecruitedCharacterData;
};

type SectionGroup = {
  section: string;
  entries: ChronicleEntryWithState[];
};

const DEFAULT_SECTION_LABEL = 'Chronicle';

export function CharacterChronicle({ matoran }: CharacterChronicleProps) {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const accordionTransition = buildTransition(
    {
      duration: MOTION_DURATION.base,
      ease: MOTION_EASING.standard,
    },
    shouldReduceMotion
  );
  const { completedQuests } = useGame();

  const chronicleEntries = useMemo(
    () => getCharacterChronicle(matoran.id, { completedQuests }),
    [matoran.id, completedQuests]
  );

  const sections = useMemo<SectionGroup[]>(() => {
    const map = new Map<string, ChronicleEntryWithState[]>();

    chronicleEntries.forEach((entry) => {
      const key = entry.section || DEFAULT_SECTION_LABEL;
      const existing = map.get(key) ?? [];
      existing.push(entry);
      map.set(key, existing);
    });

    return Array.from(map.entries()).map(([section, entries]) => ({
      section,
      entries,
    }));
  }, [chronicleEntries]);

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  useEffect(() => {
    if (!sections.length) return;

    setExpandedSections((prev) => {
      if (Object.keys(prev).length) return prev;
      const initial: Record<string, boolean> = {};
      sections.forEach((section) => {
        const hasUnlocked = section.entries.some((e) => e.isUnlocked);
        initial[section.section] = hasUnlocked;
      });
      return initial;
    });
  }, [sections]);

  const handleEntryClick = (entry: ChronicleEntryWithState) => {
    if (!entry.isUnlocked) return;

    setExpandedEntryId((current) => (current === entry.id ? null : entry.id));
  };

  if (!chronicleEntries.length) {
    return (
      <div className="character-chronicle">
        <p className="character-chronicle__empty">
          No chronicle entries are available for this character yet.
        </p>
      </div>
    );
  }

  return (
    <div className="character-chronicle">
      {sections.map((section) => {
        const isSectionExpanded = expandedSections[section.section] ?? true;

        return (
          <div key={section.section} className="chronicle-section">
            <button
              type="button"
              className="chronicle-section__header"
              onClick={() =>
                setExpandedSections((prev) => ({
                  ...prev,
                  [section.section]: !isSectionExpanded,
                }))
              }
            >
              <div className="chronicle-section__title">{section.section}</div>
              <div className="chronicle-section__meta">
                <span className="chronicle-section__count">
                  {section.entries.filter((e) => e.isUnlocked).length}/{section.entries.length}{' '}
                  unlocked
                </span>
                <span className="chronicle-section__chevron" aria-hidden="true">
                  {isSectionExpanded ? (
                    <ChevronDown size={18} strokeWidth={2.5} />
                  ) : (
                    <ChevronRight size={18} strokeWidth={2.5} />
                  )}
                </span>
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isSectionExpanded && (
                <motion.div
                  className="chronicle-section__body"
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={accordionTransition}
                  style={{ overflow: 'hidden' }}
                >
                  {section.entries.map((entry) => {
                    const isExpandedInline = expandedEntryId === entry.id;

                    return (
                      <div
                        key={entry.id}
                        className={`chronicle-entry ${entry.isUnlocked ? 'chronicle-entry--unlocked' : 'chronicle-entry--locked'}`}
                      >
                        <button
                          type="button"
                          className="chronicle-entry__header"
                          onClick={() => handleEntryClick(entry)}
                        >
                          <span
                            className={`chronicle-entry__checkbox ${
                              entry.isUnlocked ? 'chronicle-entry__checkbox--checked' : ''
                            }`}
                            aria-hidden="true"
                          >
                            {entry.isUnlocked && (
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="chronicle-entry__check-icon"
                              />
                            )}
                          </span>
                          <div className="chronicle-entry__title">{entry.title}</div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpandedInline && (
                            <motion.div
                              className="chronicle-entry__description"
                              initial={
                                shouldReduceMotion ? { opacity: 1 } : { opacity: 0, height: 0 }
                              }
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={accordionTransition}
                              style={{ overflow: 'hidden' }}
                            >
                              <p>{entry.description}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
