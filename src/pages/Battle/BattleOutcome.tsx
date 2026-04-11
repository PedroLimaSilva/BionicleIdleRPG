import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { BattlePhase } from '../../hooks/useBattleState';
import { useGame } from '../../context/Game';
import { KRAATA_POWER_NAMES, KraataReward } from '../../types/Kraata';
import { KranaReward } from '../../types/GameState';
import type { Combatant } from '../../types/Combat';
import type { BaseMatoran, RecruitedCharacterData } from '../../types/Matoran';
import { ELEMENT_TO_KRANA_COLOR, ELEMENT_TO_KRANA_COLOR_HEX } from '../../game/Krana';
import { computeBattleExpPerParticipant } from '../../game/BattleRewards';
import { getKraataCompositedColors } from '../../data/kraataColors';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import { isTestMode } from '../../utils/testMode';
import { CompositedImage } from '../../components/CompositedImage';
import { CHARACTER_DEX } from '../../data/dex/index';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { getLevelFromExp } from '../../game/Levelling';

import './BattleOutcome.scss';

interface BattleOutcomeProps {
  phase: BattlePhase;
  enemiesDefeated: number;
  expTotal: number;
  team: Combatant[];
  kranaRewards: KranaReward[];
  kraataRewards: KraataReward[];
  onCollect: () => void;
}

function OutcomeTitle({ phase }: { phase: BattlePhase }) {
  const label =
    phase === BattlePhase.Victory
      ? 'Victory!'
      : phase === BattlePhase.Defeat
        ? 'Defeat'
        : 'Retreated';

  const className =
    phase === BattlePhase.Victory
      ? 'battle-outcome__title battle-outcome__title--victory'
      : phase === BattlePhase.Defeat
        ? 'battle-outcome__title battle-outcome__title--defeat'
        : 'battle-outcome__title battle-outcome__title--retreat';

  return <h1 className={className}>{label}</h1>;
}

function ToaExpCard({
  dex,
  recruited,
  expEach,
  expTotal,
  index,
  reduceMotion,
}: {
  dex: BaseMatoran;
  recruited: RecruitedCharacterData;
  expEach: number;
  expTotal: number;
  index: number;
  reduceMotion: boolean;
}) {
  const barTransition = buildTransition(
    {
      duration: MOTION_DURATION.verySlow,
      ease: MOTION_EASING.standard,
      delay: 0.12 + index * 0.08,
    },
    reduceMotion
  );
  const cardTransition = buildTransition(
    { duration: MOTION_DURATION.slow, ease: MOTION_EASING.emphasized, delay: 0.05 + index * 0.06 },
    reduceMotion
  );

  return (
    <motion.div
      className={`character-card battle-outcome__exp-toa-card element-${dex.element}`}
      initial={reduceMotion ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={cardTransition}
    >
      <MatoranAvatar
        matoran={{ ...dex, ...recruited }}
        styles="matoran-avatar model-preview battle-outcome__exp-toa-avatar"
      />
      <div className="card-header battle-outcome__exp-toa-header">
        {dex.name}
        <div className="level-label">Level {getLevelFromExp(recruited.exp)}</div>
      </div>
      <div className="battle-outcome__exp-toa-footer">
        <span className="battle-outcome__exp-toa-amount">
          {expEach > 0 ? `+${expEach}` : expTotal > 0 ? '+0' : '—'}
        </span>
        {expEach > 0 && (
          <div className="battle-outcome__exp-toa-track">
            <motion.div
              className="battle-outcome__exp-toa-fill"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={barTransition}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ToaExpSection({
  team,
  expTotal,
  reduceMotion,
}: {
  team: Combatant[];
  expTotal: number;
  reduceMotion: boolean;
}) {
  const { recruitedCharacters } = useGame();
  const expEach = useMemo(() => computeBattleExpPerParticipant(team, expTotal), [team, expTotal]);

  return (
    <div className="battle-outcome__exp-section">
      <div className="battle-outcome__exp-header">
        <span className="battle-outcome__exp-label">EXP earned</span>
        <span className="battle-outcome__exp-value">
          {expTotal > 0 ? <>+{expTotal}</> : <span className="battle-outcome__empty">0</span>}
        </span>
      </div>
      {team.length > 0 && (
        <div className="battle-outcome__exp-team">
          {team.map((combatant, index) => {
            const recruited = recruitedCharacters.find((r) => r.id === combatant.id);
            const dex = CHARACTER_DEX[combatant.id];
            if (!dex || !recruited) return null;
            return (
              <ToaExpCard
                key={`${combatant.id}-${index}`}
                dex={dex}
                recruited={recruited}
                expEach={expEach}
                expTotal={expTotal}
                index={index}
                reduceMotion={reduceMotion}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function KranaRewardCard({
  reward,
  index,
  reduceMotion,
}: {
  reward: KranaReward;
  index: number;
  reduceMotion: boolean;
}) {
  const color = ELEMENT_TO_KRANA_COLOR[reward.element];
  const transition = buildTransition(
    {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASING.emphasized,
      delay: 0.3 + index * 0.12,
    },
    reduceMotion
  );

  return (
    <motion.div
      className={`battle-outcome__loot-card krana-color--${color}`}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transition}
    >
      <div className="battle-outcome__loot-krana-img-wrap">
        <CompositedImage
          images={[`${import.meta.env.BASE_URL}/avatar/Krana/${reward.kranaId}.webp`]}
          colors={[ELEMENT_TO_KRANA_COLOR_HEX[reward.element]]}
          className="battle-outcome__loot-img"
        />
      </div>
      <span className="battle-outcome__loot-label">
        Krana {reward.kranaId}
        <span className="battle-outcome__loot-element">{reward.element}</span>
      </span>
    </motion.div>
  );
}

function KraataRewardCard({
  reward,
  index,
  startOffset,
  reduceMotion,
}: {
  reward: KraataReward;
  index: number;
  startOffset: number;
  reduceMotion: boolean;
}) {
  const label = KRAATA_POWER_NAMES[reward.power] ?? reward.power;
  const transition = buildTransition(
    {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASING.emphasized,
      delay: 0.3 + (startOffset + index) * 0.12,
    },
    reduceMotion
  );

  return (
    <motion.div
      className="battle-outcome__loot-card battle-outcome__loot-card--kraata"
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={transition}
    >
      <CompositedImage
        images={[
          `${import.meta.env.BASE_URL}/avatar/Kraata/${reward.stage}_Base.webp`,
          `${import.meta.env.BASE_URL}/avatar/Kraata/${reward.stage}_Head.webp`,
          `${import.meta.env.BASE_URL}/avatar/Kraata/${reward.stage}_Tail.webp`,
        ]}
        colors={getKraataCompositedColors(reward.power)}
        className="battle-outcome__loot-kraata"
      />
      <span className="battle-outcome__loot-label">
        <span className="battle-outcome__loot-kraata-title">{label}</span>
        <span className="battle-outcome__loot-kraata-meta">
          <span className="battle-outcome__loot-kraata-stage bionicle-font">{reward.stage}</span>
          {reward.qty > 1 && <span className="battle-outcome__loot-qty">×{reward.qty}</span>}
        </span>
      </span>
    </motion.div>
  );
}

export function BattleOutcome({
  phase,
  enemiesDefeated,
  expTotal,
  team,
  kranaRewards,
  kraataRewards,
  onCollect,
}: BattleOutcomeProps) {
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const hasLoot = kranaRewards.length > 0 || kraataRewards.length > 0;
  const lootDelay = 0.3 + (kranaRewards.length + kraataRewards.length) * 0.12;

  const panelTransition = useMemo(
    () =>
      buildTransition(
        { duration: MOTION_DURATION.slow, ease: MOTION_EASING.standard },
        shouldReduceMotion
      ),
    [shouldReduceMotion]
  );

  const collectTransition = useMemo(
    () =>
      buildTransition(
        {
          duration: MOTION_DURATION.base,
          ease: MOTION_EASING.standard,
          delay: hasLoot ? lootDelay + 0.15 : 0.6,
        },
        shouldReduceMotion
      ),
    [shouldReduceMotion, hasLoot, lootDelay]
  );

  return (
    <>
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={panelTransition}
      >
        <OutcomeTitle phase={phase} />
      </motion.div>

      <div className="battle-arena"></div>

      <div className="battle-outcome__panel">
        <motion.div
          className="battle-outcome__stats"
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={buildTransition(
            { duration: MOTION_DURATION.base, ease: MOTION_EASING.standard, delay: 0.15 },
            shouldReduceMotion
          )}
        >
          <p className="battle-outcome__stat-row">
            <span className="battle-outcome__stat-label">Enemies defeated</span>
            <span className="battle-outcome__stat-value">{enemiesDefeated}</span>
          </p>
        </motion.div>

        <ToaExpSection team={team} expTotal={expTotal} reduceMotion={shouldReduceMotion} />

        {hasLoot && (
          <div className="battle-outcome__loot-section">
            <p className="battle-outcome__loot-heading">Loot</p>
            <div className="battle-outcome__loot-scroll">
              <div className="battle-outcome__loot-grid">
                {kranaRewards.map((r, i) => (
                  <KranaRewardCard
                    key={`krana-${r.kranaId}-${r.element}`}
                    reward={r}
                    index={i}
                    reduceMotion={shouldReduceMotion}
                  />
                ))}
                {kraataRewards.map((r, i) => (
                  <KraataRewardCard
                    key={`kraata-${r.power}-${r.stage}-${i}`}
                    reward={r}
                    index={i}
                    startOffset={kranaRewards.length}
                    reduceMotion={shouldReduceMotion}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {!hasLoot && (
          <motion.p
            className="battle-outcome__no-loot"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={buildTransition(
              { duration: MOTION_DURATION.base, ease: MOTION_EASING.standard, delay: 0.35 },
              shouldReduceMotion
            )}
          >
            No loot this time
          </motion.p>
        )}

        <motion.button
          className="confirm-button battle-outcome__collect"
          onClick={onCollect}
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={collectTransition}
        >
          Collect Rewards
        </motion.button>
      </div>
    </>
  );
}
