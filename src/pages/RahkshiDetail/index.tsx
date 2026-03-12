import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/Game';
import { KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { getKraataCompositedColors } from '../../data/kraataColors';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { CompositedImage } from '../../components/CompositedImage';
import { isForgeComplete } from '../../game/KraataActions';
import { useMemo, useState, useEffect, Suspense } from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, PresentationControls } from '@react-three/drei';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { RahkshiModel } from '../../components/CharacterScene/Rahkshi';
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from '../../components/CharacterScene/BoundsCylinder';

import './index.scss';

const CENTER_Y = CYLINDER_HEIGHT / 2;

function RahkshiFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  useEffect(() => {
    if (camera.type !== 'OrthographicCamera') return;
    if (size.width <= 0 || size.height <= 0) return;
    camera.position.set(0, CENTER_Y, 100);
    camera.lookAt(0, CENTER_Y, 0);
    camera.near = 0.1;
    camera.far = 1000;
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function RahkshiDetailScene({ kraata }: { kraata: KraataPower }) {
  return (
    <>
      <RahkshiFraming />
      <Environment preset="city" />
      <ambientLight intensity={0.05} />
      <directionalLight
        position={[3, CENTER_Y + 8, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-CYLINDER_RADIUS * 2}
        shadow-camera-right={CYLINDER_RADIUS * 2}
        shadow-camera-top={CYLINDER_HEIGHT * 0.75}
        shadow-camera-bottom={-CYLINDER_HEIGHT * 0.75}
      />
      <directionalLight position={[-3, CENTER_Y + 2, -2]} intensity={0.15} />
      <PresentationControls
        global
        snap={false}
        speed={2}
        zoom={1}
        polar={[0, 0]}
        config={{ mass: 0.5, tension: 170, friction: 26 }}
      >
        <Suspense fallback={null}>
          <RahkshiModel kraata={kraata} />
        </Suspense>
      </PresentationControls>
    </>
  );
}

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
    rahkshi,
    kraataCollection,
    completeRahkshiForge,
    insertKraataIntoRahkshi,
    removeKraataFromRahkshi,
  } = useGame();

  const armor = useMemo(() => rahkshi.find((r) => r.id === id), [rahkshi, id]);
  const armorPower = armor?.power;

  useEffect(() => {
    if (armor && armorPower) {
      setScene(<RahkshiDetailScene kraata={armorPower} />);
    }
    return () => setScene(null);
  }, [armor, armorPower, setScene]);

  const armorColors = useMemo(
    () => (armorPower ? getRahkshiArmorColors(armorPower) : { armor: '#C2A375', joint: '#D4AF37' }),
    [armorPower]
  );

  const hasKraata = !!armor?.kraata;

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

        entries.push({ power: power as KraataPower, stage: Number(stageStr), count });
      }
    }

    return entries;
  }, [kraataCollection, isReady, hasKraata, armorPower]);

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
        <h1 className="rahkshi-detail__name">{powerName} Armor</h1>
        <div className="rahkshi-detail__meta">
          <span
            className={`rahkshi-detail__status rahkshi-detail__status--${armor.status}${hasKraata ? ' rahkshi-detail__status--active' : ''}`}
          >
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
