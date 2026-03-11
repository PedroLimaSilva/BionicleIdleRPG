import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { KraataPower, KRAATA_POWER_NAMES, MAX_KRAATA_STAGE } from '../../types/Kraata';
import { KRAATA_SPECIES_COLORS, getKraataCompositedColors } from '../../data/kraataColors';
import { CompositedImage } from '../../components/CompositedImage';
import {
  getKraataCount,
  canMergeKraata,
  canStartKraataArmor,
  getActiveTransformation,
  isTransformationComplete,
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
    kraataTransformations,
    mergeKraata,
    startKraataArmor,
    completeKraataArmor,
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

  const canArmor = useMemo(
    () => canStartKraataArmor(kraataCollection, power, stage),
    [kraataCollection, power, stage]
  );

  const activeTransformation = useMemo(
    () => getActiveTransformation(kraataTransformations, power, stage),
    [kraataTransformations, power, stage]
  );

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!activeTransformation) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [activeTransformation]);

  const transformationComplete = activeTransformation
    ? isTransformationComplete(activeTransformation)
    : false;
  const timeRemaining = activeTransformation ? activeTransformation.endsAt - now : 0;

  const name = KRAATA_POWER_NAMES[power] ?? power;

  const handleMerge = () => {
    if (!mergeable) return;
    mergeKraata(power, stage);
    navigate(`/kraata/${power}/${stage + 1}`, { replace: true });
  };

  const handleStartArmor = () => {
    if (!canArmor || activeTransformation) return;
    startKraataArmor(power, stage);
  };

  const handleCompleteArmor = () => {
    if (!transformationComplete) return;
    completeKraataArmor(power, stage);
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
      <div
        className="kraata-detail-visualization"
        style={
          {
            '--kraata-head-color': colors.head,
            '--kraata-tail-color': colors.tail,
          } as React.CSSProperties
        }
      >
        <Link to="/characters" className="kraata-detail__back">
          &larr; Back
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
      </div>

      <div className="kraata-detail-options">
        <div className="kraata-option">
          <h3>Turn into Armor</h3>
          <p className="kraata-option__desc">
            Submerge this kraata in energized protodermis to forge Rahkshi armor.
          </p>
          {activeTransformation ? (
            transformationComplete ? (
              <button type="button" className="confirm-button" onClick={handleCompleteArmor}>
                Collect Armor
              </button>
            ) : (
              <div className="kraata-option__timer">
                <div className="kraata-option__progress-bar">
                  <div
                    className="kraata-option__progress-fill"
                    style={{
                      width: `${Math.min(100, ((now - activeTransformation.startedAt) / (activeTransformation.endsAt - activeTransformation.startedAt)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="kraata-option__time-remaining">
                  {formatTimeRemaining(timeRemaining)}
                </span>
              </div>
            )
          ) : (
            <button
              type="button"
              disabled={!canArmor}
              onClick={handleStartArmor}
            >
              {canArmor ? 'Start (24h)' : 'No kraata available'}
            </button>
          )}
        </div>

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
            <button
              type="button"
              disabled={!mergeable}
              onClick={handleMerge}
            >
              {mergeable
                ? `Merge → Stage ${stage + 1}`
                : `Need 2× (have ${count})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
