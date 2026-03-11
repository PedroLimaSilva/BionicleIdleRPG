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
import { KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { getKraataCompositedColors, KRAATA_SPECIES_COLORS } from '../../data/kraataColors';
import { CompositedImage } from '../../components/CompositedImage';
import { RahkshiArmor } from '../../types/Rahkshi';

const CHARACTERS_TAB_KEY = 'characters-tab';

type TabId = 'matoran' | 'toa' | 'other' | 'rahkshi';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters, kraataCollection, rahkshi } = useGame();
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const hasCollectedKraata = useMemo(() => {
    return Object.values(kraataCollection).some(
      (stages) => stages && Object.values(stages).some((count) => count && count > 0)
    );
  }, [kraataCollection]);

  const tabs = useMemo(() => {
    const base = ['matoran'];
    if (recruitedCharacters.some((m) => isToa(getEffectiveMatoran(m)))) {
      base.push('toa');
    }
    if (recruitedCharacters.some((m) => isBohrokOrKal(getEffectiveMatoran(m)))) {
      base.push('other');
    }
    if (hasCollectedKraata || rahkshi.length > 0) {
      base.push('rahkshi');
    }
    return base;
  }, [recruitedCharacters, hasCollectedKraata, rahkshi.length]);

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
    const groups: { power: KraataPower; stage: number; name: string; count: number }[] = [];
    for (const [power, stages] of Object.entries(kraataCollection)) {
      if (!stages) continue;
      for (const [stageStr, count] of Object.entries(stages)) {
        if (typeof count !== 'number' || count <= 0) continue;
        const stage = Number(stageStr);
        groups.push({
          power: power as KraataPower,
          stage,
          name: `Kraata of ${KRAATA_POWER_NAMES[power as KraataPower] ?? power}`,
          count,
        });
      }
    }
    groups.sort((a, b) => a.name.localeCompare(b.name) || a.stage - b.stage);
    return groups;
  }, [kraataCollection]);

  return (
    <div className="page-container">
      <div className="character-inventory-tabs">
        <Tabs tabs={tabs} activeTab={effectiveTab} onTabChange={handleTabChange} />
      </div>
      {effectiveTab === 'rahkshi' ? (
        <>
          {rahkshi.length > 0 && (
            <div className="rahkshi-grid">
              {rahkshi.map((armor) => (
                <RahkshiArmorCard key={armor.id} armor={armor} />
              ))}
            </div>
          )}
          <div className="kraata-grid">
            {collectedKraata.map(({ power, stage, name, count }) => (
              <Link key={`${power}-${stage}`} to={`/kraata/${power}/${stage}`}>
                <div className="kraata-card">
                  <CompositedImage
                    images={[
                      `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Base.webp`,
                      `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Head.webp`,
                      `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Tail.webp`,
                    ]}
                    colors={getKraataCompositedColors(power)}
                    className="kraata-card__image"
                  />
                  <div className="kraata-card__name">{name}</div>
                  <div className="kraata-card__stage bionicle-font">{stage}</div>
                  <div className="kraata-card__count">×{count}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
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

function RahkshiArmorCard({ armor }: { armor: RahkshiArmor }) {
  const colors = KRAATA_SPECIES_COLORS[armor.power] ?? { head: '#C2A375', tail: '#D4AF37' };
  const powerName = KRAATA_POWER_NAMES[armor.power] ?? armor.power;
  const isPreparing = armor.armorStage === 'preparing';
  const hasKraata = !!armor.kraata;

  const statusLabel = isPreparing ? 'Forging…' : hasKraata ? 'Active' : 'Empty';

  return (
    <Link to={`/rahkshi/${armor.id}`}>
      <div
        className={`rahkshi-card rahkshi-card--${armor.armorStage}`}
        style={
          {
            '--rahkshi-head-color': colors.head,
            '--rahkshi-tail-color': colors.tail,
          } as React.CSSProperties
        }
      >
        <CompositedImage
          images={[
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Base.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Head.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Tail.webp`,
          ]}
          colors={getKraataCompositedColors(armor.power)}
          className="rahkshi-card__image"
        />
        <div className="rahkshi-card__name">{powerName} Armor</div>
        <div className={`rahkshi-card__status rahkshi-card__status--${armor.armorStage}${hasKraata ? ' rahkshi-card__status--active' : ''}`}>
          {statusLabel}
        </div>
      </div>
    </Link>
  );
}
