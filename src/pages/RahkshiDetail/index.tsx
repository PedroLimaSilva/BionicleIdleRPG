import { useParams, Link } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { KRAATA_SPECIES_COLORS, getKraataCompositedColors } from '../../data/kraataColors';
import { CompositedImage } from '../../components/CompositedImage';
import { isForgeComplete } from '../../game/KraataActions';
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

export const RahkshiDetail: React.FC = () => {
  const { id } = useParams();
  const {
    rahkshi,
    kraataCollection,
    completeRahkshiForge,
    insertKraataIntoRahkshi,
  } = useGame();

  const armor = useMemo(() => rahkshi.find((r) => r.id === id), [rahkshi, id]);

  const colors = useMemo(() => {
    if (!armor) return { head: '#C2A375', tail: '#D4AF37' };
    return KRAATA_SPECIES_COLORS[armor.power] ?? { head: '#C2A375', tail: '#D4AF37' };
  }, [armor]);

  const compositedColors = useMemo(
    () => (armor ? getKraataCompositedColors(armor.power) : (['#C2A375', '#C2A375', '#D4AF37'] as [string, string, string])),
    [armor]
  );

  const isPreparing = armor?.armorStage === 'preparing';
  const isReady = armor?.armorStage === 'ready';
  const hasKraata = !!armor?.kraata;

  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!isPreparing) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isPreparing]);

  const forgeComplete = armor && isPreparing ? isForgeComplete(armor) : false;

  const availableKraata = useMemo(() => {
    if (!isReady || hasKraata) return [];
    const entries: { power: KraataPower; stage: number; count: number }[] = [];
    for (const [power, stages] of Object.entries(kraataCollection)) {
      if (!stages) continue;
      for (const [stageStr, count] of Object.entries(stages)) {
        if (typeof count !== 'number' || count <= 0) continue;
        entries.push({ power: power as KraataPower, stage: Number(stageStr), count });
      }
    }
    entries.sort((a, b) => {
      const nameA = KRAATA_POWER_NAMES[a.power] ?? a.power;
      const nameB = KRAATA_POWER_NAMES[b.power] ?? b.power;
      return nameA.localeCompare(nameB) || a.stage - b.stage;
    });
    return entries;
  }, [kraataCollection, isReady, hasKraata]);

  if (!armor) {
    return (
      <div className="page-container">
        <p>Rahkshi armor not found.</p>
        <Link to="/characters">&larr; Back to Characters</Link>
      </div>
    );
  }

  const powerName = KRAATA_POWER_NAMES[armor.power] ?? armor.power;

  return (
    <div className="page-container rahkshi-detail">
      <div
        className="rahkshi-detail-visualization"
        style={
          {
            '--kraata-head-color': colors.head,
            '--kraata-tail-color': colors.tail,
          } as React.CSSProperties
        }
      >
        <Link to="/characters" className="rahkshi-detail__back">
          &larr; Back
        </Link>
        <CompositedImage
          images={[
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Base.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Head.webp`,
            `${import.meta.env.BASE_URL}/avatar/Kraata/1_Tail.webp`,
          ]}
          colors={compositedColors}
          className="rahkshi-detail__image"
        />
        <h1 className="rahkshi-detail__name">{powerName} Armor</h1>
        <div className="rahkshi-detail__meta">
          <span className={`rahkshi-detail__status rahkshi-detail__status--${armor.armorStage}${hasKraata ? ' rahkshi-detail__status--active' : ''}`}>
            {isPreparing ? 'Forging' : hasKraata ? 'Active' : 'Ready'}
          </span>
        </div>
      </div>

      <div className="rahkshi-detail-content">
        {isPreparing && armor.startedAt != null && armor.endsAt != null && (
          <div className="rahkshi-section">
            <h3>Forging Progress</h3>
            {forgeComplete ? (
              <button
                type="button"
                className="confirm-button"
                onClick={() => completeRahkshiForge(armor.id)}
              >
                Collect Armor
              </button>
            ) : (
              <div className="rahkshi-section__timer">
                <div className="rahkshi-section__progress-bar">
                  <div
                    className="rahkshi-section__progress-fill"
                    style={{
                      width: `${Math.min(100, ((now - armor.startedAt) / (armor.endsAt - armor.startedAt)) * 100)}%`,
                    }}
                  />
                </div>
                <span className="rahkshi-section__time-remaining">
                  {formatTimeRemaining(armor.endsAt - now)}
                </span>
              </div>
            )}
          </div>
        )}

        {isReady && !hasKraata && (
          <div className="rahkshi-section">
            <h3>Insert Kraata</h3>
            <p className="rahkshi-section__desc">
              This armor is empty. Place a kraata inside to awaken the Rahkshi.
            </p>
            {availableKraata.length > 0 ? (
              <div className="rahkshi-section__kraata-list">
                {availableKraata.map(({ power, stage, count }) => (
                  <button
                    key={`${power}-${stage}`}
                    type="button"
                    onClick={() => insertKraataIntoRahkshi(armor.id, power, stage)}
                  >
                    {KRAATA_POWER_NAMES[power]} (Stage {stage}) ×{count}
                  </button>
                ))}
              </div>
            ) : (
              <p className="rahkshi-section__empty">No kraata available to insert.</p>
            )}
          </div>
        )}

        {isReady && hasKraata && armor.kraata && (
          <div className="rahkshi-section">
            <h3>Installed Kraata</h3>
            <div className="rahkshi-section__installed">
              <CompositedImage
                images={[
                  `${import.meta.env.BASE_URL}/avatar/Kraata/1_Base.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/1_Head.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/1_Tail.webp`,
                ]}
                colors={getKraataCompositedColors(armor.kraata.power)}
                className="rahkshi-section__kraata-image"
              />
              <div className="rahkshi-section__kraata-info">
                <span className="rahkshi-section__kraata-name">
                  Kraata of {KRAATA_POWER_NAMES[armor.kraata.power]}
                </span>
                <span className="rahkshi-section__kraata-stage bionicle-font">
                  {armor.kraata.stage}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
