import './index.scss';
import { motion } from 'motion/react';
import { MatoranAvatar } from '../../rendering/2d/MatoranAvatar';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Modal } from '../../components/Modal';
import { useReducedMotion } from 'motion/react';
import { isTestMode } from '../../utils/testMode';
import { getLevelFromExp } from '../../game/characters/Levelling';
import { JobStatusBadge } from '../../components/JobStatusBadge';
import { getJobStatus } from '../../game/jobs/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { getEffectiveMatoran } from '../../services/matoranUtils';
import { isBohrokOrKal, isMatoran, isToa, isVahki } from '../../game/characters/matoranStage';
import { useMemo, useState, useCallback, useLayoutEffect } from 'react';
import {
  consumeCharactersReturnScrollId,
  scrollMainContentElementIntoView,
} from '../../utils/mainContentScroll';
import { Tabs } from '../../components/Tabs';
import { CHARACTER_DEX } from '../../data/dex/index';
import {
  canMergeAnyKraata,
  canStartRahkshiForge,
  getRahkshiPowerCoverage,
  hasRahkshiArmorForPower,
  ACTIVE_RAHKSHI_KRAATA_STAGE,
  RAHKSHI_FORGE_COST,
} from '../../game/kraata/KraataActions';
import { getKraataCompositedColors } from '../../data/kraataColors';
import { KraataPower, KRAATA_POWER_NAMES, KraataCollection } from '../../types/Kraata';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { CompositedImage } from '../../rendering/2d/CompositedImage';
import { Tooltip } from '../../components/Tooltip';
import { RahkshiArmor } from '../../types/Rahkshi';
import { LegoColor } from '../../types/Colors';
import { CREATE_CUSTOM_CHARACTER_ID } from '../../types/Matoran';

const CHARACTERS_TAB_KEY = 'characters-tab';

type TabId = 'matoran' | 'toa' | 'other' | 'rahkshi';

export const CharacterInventory: React.FC = () => {
  const {
    buyableCharacters,
    kraataCollection,
    mergeAllKraata,
    protodermis,
    rahkshi,
    recruitedCharacters,
    startRahkshiForge,
  } = useGame();
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
    if (
      recruitedCharacters.some((m) => {
        const effective = getEffectiveMatoran(m);
        return isBohrokOrKal(effective) || isVahki(effective);
      })
    ) {
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

  useLayoutEffect(() => {
    const returnScrollId = consumeCharactersReturnScrollId();
    if (!returnScrollId) return;

    const card = document.querySelector<HTMLElement>(
      `[data-character-id="${CSS.escape(returnScrollId)}"]`
    );
    if (!card) return;

    scrollMainContentElementIntoView(card);
  }, [effectiveTab, characters]);

  const collectedKraata = useMemo(() => {
    const groups: { power: KraataPower; stage: number; name: string; count: number }[] = [];
    for (const [power, stages] of Object.entries(kraataCollection)) {
      if (!stages) continue;
      for (const [stageStr, count] of Object.entries(stages)) {
        if (typeof count !== 'number' || count <= 0) continue;
        const stage = Number(stageStr);
        groups.push({
          count,
          name: `Kraata of ${KRAATA_POWER_NAMES[power as KraataPower] ?? power}`,
          power: power as KraataPower,
          stage,
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
          protodermis={protodermis}
          startRahkshiForge={startRahkshiForge}
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
                  data-character-id={matoran.id}
                  className={`character-card element-${effective.element}`}
                  layoutId={shouldReduceMotion ? undefined : `character-${matoran.id}`}
                  layout
                  transition={{ damping: 30, stiffness: 400, type: 'spring' }}
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
      {effectiveTab !== 'rahkshi' && (
        <div className="recruit-button">
          <Link to="/recruitment">
            <button type="button" className="recruitment-button">
              {buyableCharacters.some((c) => c.id !== CREATE_CUSTOM_CHARACTER_ID)
                ? 'Recruit More'
                : 'Create Matoran'}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

type CollectedKraataItem = { power: KraataPower; stage: number; name: string; count: number };

function RahkshiTabContent({
  collectedKraata,
  kraataCollection,
  mergeAllKraata,
  protodermis,
  rahkshi,
  shouldReduceMotion,
  startRahkshiForge,
}: {
  rahkshi: RahkshiArmor[];
  collectedKraata: CollectedKraataItem[];
  kraataCollection: KraataCollection;
  mergeAllKraata: () => void;
  protodermis: number;
  startRahkshiForge: (power: KraataPower, stage: number) => void;
  shouldReduceMotion: boolean;
}) {
  const canMergeAny = useMemo(() => canMergeAnyKraata(kraataCollection), [kraataCollection]);
  const rahkshiCoverage = useMemo(() => getRahkshiPowerCoverage(rahkshi), [rahkshi]);
  const [forgeModalPower, setForgeModalPower] = useState<KraataPower | null>(null);

  const canForgeSelected = useMemo(() => {
    if (forgeModalPower === null) return false;
    return canStartRahkshiForge(kraataCollection, forgeModalPower, 1, protodermis);
  }, [forgeModalPower, kraataCollection, protodermis]);

  const handleConfirmForge = () => {
    if (forgeModalPower === null || !canForgeSelected) return;
    startRahkshiForge(forgeModalPower, 1);
    setForgeModalPower(null);
  };

  return (
    <>
      {rahkshi.length > 0 && (
        <>
          <h3 className="rahkshi-section__title">
            Rahkshi{' '}
            <Tooltip
              content={`Powers with ready Rahkshi armor and a stage ${ACTIVE_RAHKSHI_KRAATA_STAGE}+ kraata installed.`}
            >
              <span className="rahkshi-section__counter">
                {rahkshiCoverage.covered}/{rahkshiCoverage.total}
              </span>
            </Tooltip>
          </h3>
          <div className="rahkshi-grid">
            {rahkshi
              .sort((a, b) => a.power.localeCompare(b.power))
              .map((armor) => (
                <RahkshiArmorCard
                  key={armor.id}
                  armor={armor}
                  shouldReduceMotion={shouldReduceMotion}
                />
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
        {collectedKraata.map(({ count, name, power, stage }) => {
          const cardInner = (
            <>
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
              {hasRahkshiArmorForPower(rahkshi, power) && (
                <div
                  className="kraata-card__armor-badge"
                  title="You already have Rahkshi armor of this power"
                >
                  Armor Created
                </div>
              )}
              <div className="kraata-card__stage bionicle-font">{stage}</div>
              <div className="kraata-card__count">×{count}</div>
            </>
          );

          if (stage === 1) {
            return (
              <motion.button
                key={`${power}-${stage}`}
                type="button"
                className="kraata-card kraata-card--forgeable"
                layoutId={shouldReduceMotion ? undefined : `kraata-${power}-${stage}`}
                layout
                transition={{ damping: 30, stiffness: 400, type: 'spring' }}
                onClick={() => setForgeModalPower(power)}
                aria-label={`Forge Rahkshi armor from ${name}`}
              >
                {cardInner}
              </motion.button>
            );
          }

          return (
            <motion.div
              key={`${power}-${stage}`}
              className="kraata-card kraata-card--display"
              layoutId={shouldReduceMotion ? undefined : `kraata-${power}-${stage}`}
              layout
              transition={{ damping: 30, stiffness: 400, type: 'spring' }}
            >
              {cardInner}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {forgeModalPower !== null && (
          <Modal onClose={() => setForgeModalPower(null)} classNames="kraata-forge-modal">
            <div className="kraata-forge-modal__inner">
              <h2 className="kraata-forge-modal__title">
                Forge armor — Kraata of {KRAATA_POWER_NAMES[forgeModalPower] ?? forgeModalPower}?
              </h2>
              <p className="kraata-forge-modal__body">
                Submerge this stage 1 kraata in energized protodermis to forge empty Rahkshi armor
                matching its power. This costs {RAHKSHI_FORGE_COST.toLocaleString()} protodermis and
                takes 24 hours. Track forging and collect the armor from that Rahkshi’s detail page.
              </p>
              {hasRahkshiArmorForPower(rahkshi, forgeModalPower) && (
                <p className="kraata-forge-modal__armor-note">
                  You already have Rahkshi armor of this power.
                </p>
              )}
              {!canForgeSelected && (
                <p className="kraata-forge-modal__hint" role="status">
                  {protodermis < RAHKSHI_FORGE_COST
                    ? `Need ${RAHKSHI_FORGE_COST.toLocaleString()} protodermis (have ${protodermis.toLocaleString()}).`
                    : 'No stage 1 kraata available for this power.'}
                </p>
              )}
              <div className="kraata-forge-modal__actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setForgeModalPower(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  disabled={!canForgeSelected}
                  onClick={handleConfirmForge}
                >
                  Start forging
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function RahkshiArmorCard({
  armor,
  shouldReduceMotion,
}: {
  armor: RahkshiArmor;
  shouldReduceMotion: boolean;
}) {
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
        transition={{ damping: 30, stiffness: 400, type: 'spring' }}
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
