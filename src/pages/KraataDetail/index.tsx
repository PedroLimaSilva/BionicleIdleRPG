import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/Game';
import { isTestMode } from '../../utils/testMode';
import { KraataPower, KRAATA_POWER_NAMES, MAX_KRAATA_STAGE } from '../../types/Kraata';
import { KRAATA_SPECIES_COLORS, getKraataCompositedColors } from '../../data/kraataColors';
import { CompositedImage } from '../../components/CompositedImage';
import {
  getKraataCount,
  canMergeKraata,
  canStartRahkshiForge,
  getPreparingRahkshi,
  getReadyRahkshiWithoutKraata,
  isForgeComplete,
  RAHKSHI_FORGE_COST,
} from '../../game/KraataActions';
import { useMemo, useState, useEffect } from 'react';

import './index.scss';

function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return 'Ready!';
  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export const KraataDetail: React.FC = () => {
  const { power: powerParam, stage: stageParam } = useParams();
  const navigate = useNavigate();
  const {
    kraataCollection,
    rahkshi,
    protodermis,
    mergeKraata,
    startRahkshiForge,
    completeRahkshiForge,
    insertKraataIntoRahkshi,
  } = useGame();

  const power = powerParam as KraataPower;
  const stage = Number(stageParam);

  const colors = useMemo(() => {
    const c = KRAATA_SPECIES_COLORS[power];
    return c ?? { head: '#C2A375', tail: '#D4AF37' };
  }, [power]);

  const compositedColors = useMemo(() => getKraataCompositedColors(power), [power]);

  const count = useMemo(
    () => getKraataCount(kraataCollection, power, stage),
    [kraataCollection, power, stage]
  );

  const mergeable = useMemo(
    () => canMergeKraata(kraataCollection, power, stage),
    [kraataCollection, power, stage]
  );

  const canForge = useMemo(
    () => canStartRahkshiForge(kraataCollection, power, stage, protodermis),
    [kraataCollection, power, stage, protodermis]
  );

  const preparingArmors = useMemo(
    () => getPreparingRahkshi(rahkshi, power),
    [rahkshi, power, stage]
  );

  const emptyReadyArmors = useMemo(
    () => getReadyRahkshiWithoutKraata(rahkshi).filter((a) => a.power === power),
    [rahkshi, power]
  );

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (preparingArmors.length === 0) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [preparingArmors.length]);

  const name = KRAATA_POWER_NAMES[power] ?? power;
  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  const handleMerge = () => {
    if (!mergeable) return;
    mergeKraata(power, stage);
    navigate(`/kraata/${power}/${stage + 1}`, { replace: true });
  };

  const handleStartForge = () => {
    if (!canForge) return;
    startRahkshiForge(power, stage);
  };

  const handleCompleteForge = (rahkshiId: string) => {
    completeRahkshiForge(rahkshiId);
  };

  const handleInsertKraata = (rahkshiId: string) => {
    if (count < 1) return;
    insertKraataIntoRahkshi(rahkshiId, power, stage);
  };

  if (!KRAATA_POWER_NAMES[power]) {
    return (
      <div className="page-container">
        <p>Unknown kraata power.</p>
      </div>
    );
  }

  return (
    <div className="page-container kraata-detail">
      <motion.div
        className="kraata-detail-visualization"
        layoutId={shouldReduceMotion ? undefined : `kraata-${power}-${stage}`}
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={
          {
            '--kraata-head-color': colors.head,
            '--kraata-tail-color': colors.tail,
          } as React.CSSProperties
        }
      >
        <Link to="/characters" className="kraata-detail__back">
          <ArrowLeft size={18} aria-hidden /> Back
        </Link>
        <CompositedImage
          images={[
            `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Base.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Head.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/${stage}_Tail.webp`,
          ]}
          colors={compositedColors}
          className="kraata-detail__image"
        />
        <h1 className="kraata-detail__name">Kraata of {name}</h1>
        <div className="kraata-detail__meta">
          <span className="kraata-detail__stage bionicle-font">{stage}</span>
          <span className="kraata-detail__count">×{count}</span>
        </div>
      </motion.div>

      <div className="kraata-detail-options">
        <div className="kraata-option">
          <h3>Merge</h3>
          <p className="kraata-option__desc">
            Combine two kraata of the same power and stage to create a stronger one.
          </p>
          {stage >= MAX_KRAATA_STAGE ? (
            <button type="button" disabled>
              Maximum stage
            </button>
          ) : (
            <button type="button" disabled={!mergeable} onClick={handleMerge}>
              {mergeable ? `Merge → Stage ${stage + 1}` : `Need 2× (have ${count})`}
            </button>
          )}
        </div>

        <div className="kraata-option">
          <h3>Turn into Armor</h3>
          <p className="kraata-option__desc">
            Submerge this kraata in energized protodermis to forge Rahkshi armor.
          </p>
          <button type="button" disabled={!canForge} onClick={handleStartForge}>
            {stage !== 1
              ? 'Only stage 1 kraata can be forged'
              : count < 1
                ? 'No kraata available'
                : canForge
                  ? `Start Forging — ${RAHKSHI_FORGE_COST} protodermis (24h)`
                  : `Need ${RAHKSHI_FORGE_COST} protodermis (have ${protodermis})`}
          </button>
          {preparingArmors.map((armor) => {
            const complete = isForgeComplete(armor);
            const remaining = (armor.endsAt ?? 0) - now;
            const elapsed = now - (armor.startedAt ?? 0);
            const total = (armor.endsAt ?? 0) - (armor.startedAt ?? 0);
            const progress = total > 0 ? Math.min(100, (elapsed / total) * 100) : 0;

            return (
              <div key={armor.id} className="kraata-option__forge-item">
                {complete ? (
                  <button
                    type="button"
                    className="confirm-button"
                    onClick={() => handleCompleteForge(armor.id)}
                  >
                    Collect Armor
                  </button>
                ) : (
                  <div className="kraata-option__timer">
                    <div className="kraata-option__progress-bar">
                      <div
                        className="kraata-option__progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="kraata-option__time-remaining">
                      {formatTimeRemaining(remaining)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {count > 0 && emptyReadyArmors.length > 0 && (
          <div className="kraata-option">
            <h3>Insert into Armor</h3>
            <p className="kraata-option__desc">
              Place this kraata inside a ready Rahkshi armor to awaken it.
            </p>
            <button type="button" onClick={() => handleInsertKraata(emptyReadyArmors[0].id)}>
              Insert into {KRAATA_POWER_NAMES[power]} Armor
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
