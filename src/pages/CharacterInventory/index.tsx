import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { getLevelFromExp } from '../../game/Levelling';
import { JobStatusBadge } from '../../components/JobStatusBadge';
import { getJobStatus } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { useGame } from '../../context/Game';
import { MATORAN_DEX } from '../../data/matoran';
import { QUESTS } from '../../data/quests';
import { isBohrok, isMatoran, isToa } from '../../services/matoranUtils';
import { useMemo, useState, useCallback } from 'react';
import { Tabs } from '../../components/Tabs';

const CHARACTERS_TAB_KEY = 'characters-tab';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters } = useGame();

  const tabs = useMemo(() => {
    const base = ['matoran'];
    if (recruitedCharacters.some((matoran) => isToa(MATORAN_DEX[matoran.id]))) {
      base.push('toa');
    }
    if (recruitedCharacters.some((matoran) => isBohrok(MATORAN_DEX[matoran.id]))) {
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
      if (effectiveTab === 'matoran') {
        return isMatoran(MATORAN_DEX[matoran.id]);
      }
      return isToa(MATORAN_DEX[matoran.id]);
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

          const matoran_dex = MATORAN_DEX[matoran.id];

          return (
            <Link key={matoran.id} to={`/characters/${matoran.id}`}>
              <div className={`character-card element-${matoran_dex.element}`}>
                <MatoranAvatar
                  matoran={{ ...matoran_dex, ...matoran }}
                  styles={'matoran-avatar model-preview'}
                />
                <div className="card-header">
                  {'  ' + matoran_dex.name}
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
              </div>
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
