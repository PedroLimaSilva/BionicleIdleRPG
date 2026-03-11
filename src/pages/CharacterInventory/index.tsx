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
import { GameItemId, ITEM_DICTIONARY, isKraataItem } from '../../data/loot';
import { CompositedImage } from '../../components/CompositedImage';
import { LegoColor } from '../../types/Colors';

const CHARACTERS_TAB_KEY = 'characters-tab';

type TabId = 'matoran' | 'toa' | 'other' | 'rahkshi';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters, inventory } = useGame();
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const hasCollectedKraata = useMemo(() => {
    return Object.entries(inventory).some(
      ([id, qty]) => isKraataItem(id) && typeof qty === 'number' && qty > 0
    );
  }, [inventory]);

  const tabs = useMemo(() => {
    const base = ['matoran'];
    if (recruitedCharacters.some((m) => isToa(getEffectiveMatoran(m)))) {
      base.push('toa');
    }
    if (recruitedCharacters.some((m) => isBohrokOrKal(getEffectiveMatoran(m)))) {
      base.push('other');
    }
    if (hasCollectedKraata) {
      base.push('rahkshi');
    }
    return base;
  }, [recruitedCharacters, hasCollectedKraata]);

  const [activeTab, setActiveTab] = useState<TabId>(() => {
    try {
      const stored = sessionStorage.getItem(CHARACTERS_TAB_KEY) as TabId | null;
      if (stored === 'matoran' || stored === 'toa' || stored === 'other' || stored === 'rahkshi') {
        return stored;
      }
    } catch {
      /* ignore storage errors */
    }
    return 'matoran';
  });

  const handleTabChange = useCallback((tab: string) => {
    const value = tab as TabId;
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
      if (effectiveTab === 'rahkshi') {
        return false;
      }
      return !isToa(effective) && !isMatoran(effective);
    });
  }, [recruitedCharacters, effectiveTab]);

  const collectedKraata = useMemo(() => {
    const groups: { id: GameItemId; stage: number; name: string; count: number }[] = [];
    for (const [id, qty] of Object.entries(inventory)) {
      if (!isKraataItem(id) || typeof qty !== 'number' || qty <= 0) continue;
      const item = ITEM_DICTIONARY[id as GameItemId];
      if (!item) continue;
      const stage = item.stage ?? 1;
      groups.push({
        id: id as GameItemId,
        stage,
        name: item.name,
        count: qty,
      });
    }
    groups.sort((a, b) => a.name.localeCompare(b.name));
    return groups;
  }, [inventory]);

  return (
    <div className="page-container">
      <div className="character-inventory-tabs">
        <Tabs tabs={tabs} activeTab={effectiveTab} onTabChange={handleTabChange} />
      </div>
      {effectiveTab === 'rahkshi' ? (
        <div className="kraata-grid">
          {collectedKraata.map(({ id, stage, name, count }) => (
            <div key={`${id}-${stage}`} className="kraata-card">
              <CompositedImage
                images={[
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Base.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Tail.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Head.webp`,
                ]}
                colors={[LegoColor.Green, LegoColor.Green, LegoColor.PearlGold]}
                className="kraata-card__image"
              />
              <div className="kraata-card__name">{name}</div>
              <div className="kraata-card__stage bionicle-font">{stage}</div>
              <div className="kraata-card__count">×{count}</div>
            </div>
          ))}
        </div>
      ) : (
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
      )}
      {buyableCharacters.length !== 0 && effectiveTab !== 'rahkshi' && (
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
