import { motion, useReducedMotion } from 'motion/react';
import { useMemo } from 'react';
import { BattlePhase } from '../../hooks/useBattleState';
import { KRAATA_POWER_NAMES, KraataReward } from '../../types/Kraata';
import { KranaReward } from '../../types/GameState';
import { ELEMENT_TO_KRANA_COLOR } from '../../game/Krana';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';
import { isTestMode } from '../../utils/testMode';

import './BattleOutcome.scss';

interface BattleOutcomeProps {
  phase: BattlePhase;
  enemiesDefeated: number;
  expTotal: number;
  participantCount: number;
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

function ExpBar({
  expTotal,
  participantCount,
  reduceMotion,
}: {
  expTotal: number;
  participantCount: number;
  reduceMotion: boolean;
}) {
  const perToa = participantCount > 0 ? Math.floor(expTotal / participantCount) : 0;
  const transition = buildTransition(
    { duration: MOTION_DURATION.verySlow, ease: MOTION_EASING.standard },
    reduceMotion
  );

  return (
    <div className="battle-outcome__exp-section">
      <div className="battle-outcome__exp-header">
        <span className="battle-outcome__exp-label">EXP earned</span>
        <span className="battle-outcome__exp-value">
          {expTotal > 0 ? (
            <>
              +{expTotal}{' '}
              {participantCount > 0 && (
                <span className="battle-outcome__exp-per-toa">({perToa} per Toa)</span>
              )}
            </>
          ) : (
            <span className="battle-outcome__empty">0</span>
          )}
        </span>
      </div>
      {expTotal > 0 && (
        <div className="battle-outcome__exp-track">
          <motion.div
            className="battle-outcome__exp-fill"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={transition}
          />
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
      <img
        src={`${import.meta.env.BASE_URL}/avatar/Krana/${reward.kranaId}.webp`}
        alt={`Krana ${reward.kranaId}`}
        className="battle-outcome__loot-img"
      />
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
      <span className="battle-outcome__loot-icon">🐛</span>
      <span className="battle-outcome__loot-label">
        Kraata of {label}
        {reward.qty > 1 && <span className="battle-outcome__loot-qty">x{reward.qty}</span>}
      </span>
    </motion.div>
  );
}

export function BattleOutcome({
  phase,
  enemiesDefeated,
  expTotal,
  participantCount,
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

        <ExpBar
          expTotal={expTotal}
          participantCount={participantCount}
          reduceMotion={shouldReduceMotion}
        />

        {hasLoot && (
          <div className="battle-outcome__loot-section">
            <p className="battle-outcome__loot-heading">Loot</p>
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
                  key={`kraata-${r.power}`}
                  reward={r}
                  index={i}
                  startOffset={kranaRewards.length}
                  reduceMotion={shouldReduceMotion}
                />
              ))}
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
