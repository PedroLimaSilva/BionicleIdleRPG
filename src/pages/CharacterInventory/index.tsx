import './index.scss';
import { motion } from 'motion/react';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'motion/react';
import { isTestMode } from '../../utils/testMode';
import { getLevelFromExp } from '../../game/Levelling';
import { JobStatusBadge } from '../../components/JobStatusBadge';
import { getJobStatus } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { getEffectiveMatoran } from '../../services/matoranUtils';
import { isBohrokOrKal, isMatoran, isToa } from '../../game/matoranStage';
import { useMemo, useState, useCallback } from 'react';
import { Tabs } from '../../components/Tabs';
import { CHARACTER_DEX } from '../../data/dex/index';

const CHARACTERS_TAB_KEY = 'characters-tab';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters } = useGame();
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const tabs = useMemo(() => {
    const base = ['matoran'];
    if (recruitedCharacters.some((m) => isToa(getEffectiveMatoran(m)))) {
      base.push('toa');
    }
    if (recruitedCharacters.some((m) => isBohrokOrKal(getEffectiveMatoran(m)))) {
      base.push('other');
    }
    return base;
  }, [recruitedCharacters]);

  const [activeTab, setActiveTab] = useState<'matoran' | 'toa' | 'other'>(() => {
    try {
      const stored = sessionStorage.getItem(CHARACTERS_TAB_KEY) as
        | 'matoran'
        | 'toa'
        | 'other'
        | null;
      if (stored === 'matoran' || stored === 'toa' || stored === 'other') {
        return stored;
      }
    } catch {
      /* ignore storage errors */
    }
    return 'matoran';
  });

  const handleTabChange = useCallback((tab: string) => {
    const value = tab as 'matoran' | 'toa' | 'other';
    setActiveTab(value);
    try {
      sessionStorage.setItem(CHARACTERS_TAB_KEY, value);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // If stored tab isn't available (e.g. toa tab hidden when no Toa recruited), fall back to matoran
  const effectiveTab = tabs.includes(activeTab) ? activeTab : 'matoran';

  const characters = useMemo(() => {
    return recruitedCharacters.filter((matoran) => {
      if (!CHARACTER_DEX[matoran.id]) {
        return false;
      }
      const effective = getEffectiveMatoran(matoran);
      if (effectiveTab === 'matoran') {
        return isMatoran(effective);
      }
      if (effectiveTab === 'toa') {
        return isToa(effective);
      }
      return !isToa(effective) && !isMatoran(effective);
    });
  }, [recruitedCharacters, effectiveTab]);

  return (
    <div className="page-container">
      <div className="character-inventory-tabs">
        <Tabs tabs={tabs} activeTab={effectiveTab} onTabChange={handleTabChange} />
      </div>
      <div className="character-grid">
        {characters.map((matoran) => {
          const jobStatus = getJobStatus(matoran);

          const effective = getEffectiveMatoran(matoran);

          return (
            <Link key={matoran.id} to={`/characters/${matoran.id}`}>
              <motion.div
                className={`character-card element-${effective.element}`}
                layoutId={shouldReduceMotion ? undefined : `character-${matoran.id}`}
                layout
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              >
                <MatoranAvatar matoran={effective} styles={'matoran-avatar model-preview'} />
                <div className="card-header">
                  {'  ' + effective.name}
                  <div className="level-label">Level {getLevelFromExp(matoran.exp)}</div>
                  <JobStatusBadge
                    label={
                      matoran.assignment?.job
                        ? JOB_DETAILS[matoran.assignment?.job].label
                        : QUESTS.find((q) => q.id === matoran.quest)?.name || jobStatus
                    }
                    status={jobStatus}
                  />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
      {buyableCharacters.length !== 0 && (
        <div className="recruit-button">
          <Link to="/recruitment">
            <button type="button" className="recruitment-button">
              Recruit More
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
