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
import { canMergeAnyKraata } from '../../game/KraataActions';
import { getKraataCompositedColors } from '../../data/kraataColors';
import { KraataPower, KRAATA_POWER_NAMES, KraataCollection } from '../../types/Kraata';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { CompositedImage } from '../../components/CompositedImage';
import { RahkshiArmor } from '../../types/Rahkshi';
import { LegoColor } from '../../types/Colors';

const CHARACTERS_TAB_KEY = 'characters-tab';

type TabId = 'matoran' | 'toa' | 'other' | 'rahkshi';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters, kraataCollection, rahkshi, mergeAllKraata } =
    useGame();
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
    if (hasCollectedKraata || rahkshi.length > 0) {
      base.push('rahkshi');
    }
    if (recruitedCharacters.some((m) => isBohrokOrKal(getEffectiveMatoran(m)))) {
      base.push('other');
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
        <RahkshiTabContent
          rahkshi={rahkshi}
          collectedKraata={collectedKraata}
          kraataCollection={kraataCollection}
          mergeAllKraata={mergeAllKraata}
          shouldReduceMotion={shouldReduceMotion}
        />
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

type CollectedKraataItem = { power: KraataPower; stage: number; name: string; count: number };

function RahkshiTabContent({
  rahkshi,
  collectedKraata,
  kraataCollection,
  mergeAllKraata,
  shouldReduceMotion,
}: {
  rahkshi: RahkshiArmor[];
  collectedKraata: CollectedKraataItem[];
  kraataCollection: KraataCollection;
  mergeAllKraata: () => void;
  shouldReduceMotion: boolean;
}) {
  const canMergeAny = useMemo(() => canMergeAnyKraata(kraataCollection), [kraataCollection]);

  return (
    <>
      {rahkshi.length > 0 && (
        <>
          <h3 className="rahkshi-section__title">Rahkshi</h3>
          <div className="rahkshi-grid">
            {rahkshi
              .sort((a, b) => a.power.localeCompare(b.power))
              .map((armor) => (
                <RahkshiArmorCard key={armor.id} armor={armor} shouldReduceMotion={shouldReduceMotion} />
              ))}
          </div>
        </>
      )}
      <div className="rahkshi-section__kraata-header">
        <h3 className="rahkshi-section__title">Kraata</h3>
        {collectedKraata.length > 0 && (
          <button
            type="button"
            className="merge-all-button"
            disabled={!canMergeAny}
            onClick={mergeAllKraata}
          >
            Merge All
          </button>
        )}
      </div>
      {collectedKraata.length === 0 && (
        <p className="rahkshi-section__empty">No Kraata collected</p>
      )}
      <div className="kraata-grid">
        {collectedKraata.map(({ power, stage, name, count }) => (
          <Link key={`${power}-${stage}`} to={`/kraata/${power}/${stage}`}>
            <motion.div
              className="kraata-card"
              layoutId={shouldReduceMotion ? undefined : `kraata-${power}-${stage}`}
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
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
            </motion.div>
          </Link>
        ))}
      </div>
    </>
  );
}

function RahkshiArmorCard({ armor, shouldReduceMotion }: { armor: RahkshiArmor; shouldReduceMotion: boolean }) {
  const { armor: armorColor, joint: jointColor } = getRahkshiArmorColors(armor.power);
  const powerName = KRAATA_POWER_NAMES[armor.power] ?? armor.power;
  const isPreparing = armor.status === 'preparing';
  const hasKraata = !!armor.kraata;

  const statusLabel = isPreparing ? 'Forging…' : hasKraata ? 'Active' : 'Empty';

  return (
    <Link to={`/rahkshi/${armor.id}`}>
      <motion.div
        className={`rahkshi-card rahkshi-card--${armor.status}`}
        layoutId={shouldReduceMotion ? undefined : `rahkshi-${armor.id}`}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={
          {
            '--rahkshi-head-color': armorColor,
            '--rahkshi-tail-color': jointColor,
          } as React.CSSProperties
        }
      >
        <CompositedImage
          images={[
            `${import.meta.env.BASE_URL}/avatar/Kraata/Armor_Empty.webp`,
            hasKraata
              ? `${import.meta.env.BASE_URL}/avatar/Kraata/Armor_Glow.webp`
              : `${import.meta.env.BASE_URL}/avatar/Kraata/Armor_Edge.webp`,
          ]}
          colors={[armorColor, LegoColor.White]}
          className="rahkshi-card__image"
        />
        <div className="rahkshi-card__name">{powerName}</div>
        <div
          className={`rahkshi-card__status rahkshi-card__status--${armor.status}${hasKraata ? ' rahkshi-card__status--active' : ''}`}
        >
          {statusLabel}
        </div>
      </motion.div>
    </Link>
  );
}
