import { useParams, Link } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/Game';
import { KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { getKraataPowerDescription } from '../../data/kraataPowerDescriptions';
import { getKraataCompositedColors } from '../../data/kraataColors';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { CompositedImage } from '../../rendering/2d/CompositedImage';
import { isForgeComplete } from '../../game/kraata/KraataActions';
import { useMemo, useState, useEffect } from 'react';
import { useSceneCanvas } from '../../rendering/3d/hooks/useSceneCanvas';
import { RahkshiScene } from '../../rendering/3d/CharacterScene/RahkshiScene';
import { isTestMode } from '../../utils/testMode';
import { buildTransition, MOTION_DURATION, MOTION_EASING } from '../../motion/transitions';

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
  const { setScene } = useSceneCanvas();
  const {
    completeRahkshiForge,
    insertKraataIntoRahkshi,
    kraataCollection,
    rahkshi,
    removeKraataFromRahkshi,
  } = useGame();

  const armor = useMemo(() => rahkshi.find((r) => r.id === id), [rahkshi, id]);
  const armorPower = armor?.power;
  const hasKraata = !!armor?.kraata;

  useEffect(() => {
    if (armor && armorPower !== undefined) {
      setScene(<RahkshiScene kraata={armorPower} hasKraata={hasKraata} />);
    }
    return () => setScene(null);
  }, [armor, armorPower, hasKraata, setScene]);

  const armorColors = useMemo(
    () => (armorPower ? getRahkshiArmorColors(armorPower) : { armor: '#C2A375', joint: '#D4AF37' }),
    [armorPower]
  );

  const isPreparing = armor?.status === 'preparing';
  const isReady = armor?.status === 'ready';

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
        if (power !== armorPower || typeof count !== 'number' || count <= 0) continue;

        entries.push({ count, power: power as KraataPower, stage: Number(stageStr) });
      }
    }

    return entries;
  }, [kraataCollection, isReady, hasKraata, armorPower]);

  const shouldReduceMotion = (useReducedMotion() ?? false) || isTestMode();

  if (!armor) {
    return (
      <div className="page-container">
        <p>Rahkshi armor not found.</p>
        <Link to="/characters">
          <ArrowLeft size={18} aria-hidden /> Back to Characters
        </Link>
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
            '--kraata-head-color': armorColors.armor,
            '--kraata-tail-color': armorColors.joint,
          } as React.CSSProperties
        }
      >
        <Link to="/characters" className="rahkshi-detail__back">
          <ArrowLeft size={18} aria-hidden /> Back
        </Link>
        <div id="rahkshi-model-frame" className="rahkshi-detail__model-frame" />
        <div className="rahkshi-detail-header">
          <h1 className="rahkshi-detail-header__name">
            {hasKraata ? 'Rahkshi of ' : ''}
            {powerName}
            {hasKraata ? '' : ' Armor'}
          </h1>

          <AnimatePresence initial={false}>
            {isPreparing && (
              <span
                className={`rahkshi-detail-header__status rahkshi-detail-header__status--preparing`}
              >
                Forging
              </span>
            )}
            {hasKraata &&
              armor.kraata &&
              getKraataPowerDescription(armor.kraata.power, armor.kraata.stage) && (
                <motion.p
                  key="power-desc"
                  className="rahkshi-detail-header__power-desc"
                  initial={{ height: 0, margin: 0, opacity: 0, y: -8 }}
                  animate={{ height: 'auto', margin: 0, opacity: 1, y: 0 }}
                  exit={{ height: 0, margin: 0, opacity: 0, y: -8 }}
                  transition={buildTransition(
                    { duration: MOTION_DURATION.base, ease: MOTION_EASING.standard },
                    shouldReduceMotion ?? false
                  )}
                >
                  {getKraataPowerDescription(armor.kraata.power, armor.kraata.stage)}
                </motion.p>
              )}
          </AnimatePresence>
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
                {availableKraata.map(({ count, power, stage }) => (
                  <button
                    key={`${power}-${stage}`}
                    type="button"
                    onClick={() => insertKraataIntoRahkshi(armor.id, power, stage)}
                  >
                    Stage {stage} (1/{count})
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
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${armor.kraata.stage}_Base.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${armor.kraata.stage}_Head.webp`,
                  `${import.meta.env.BASE_URL}/avatar/Kraata/${armor.kraata.stage}_Tail.webp`,
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
              <button
                type="button"
                className="rahkshi-section__remove-kraata"
                onClick={() => removeKraataFromRahkshi(armor.id)}
              >
                Remove Kraata
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
