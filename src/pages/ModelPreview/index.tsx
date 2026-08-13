import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { getRecruitedMatoran } from '../../services/matoranUtils';
import { getRahkshiArmorColors } from '../../data/rahkshiArmorColors';
import { CharacterScene } from '../../components/CharacterScene';
import { RahkshiScene } from '../../components/CharacterScene/RahkshiScene';
import {
  registerE2eModelPreviewNavigate,
  unregisterE2eModelPreviewNavigate,
} from '../../utils/e2eModelPreview';
import { isTestMode } from '../../utils/testMode';

import '../CharacterDetail/index.scss';
import '../RahkshiDetail/index.scss';
import './index.scss';

type ModelPreviewKind = 'characters' | 'rahkshi';

function useModelPreviewKind(): ModelPreviewKind | null {
  const { kind } = useParams();
  if (kind === 'characters' || kind === 'rahkshi') return kind;
  return null;
}

/** Test-only route: renders a single character or rahkshi model with no game UI. */
export const ModelPreview: React.FC = () => {
  const { id } = useParams();
  const kind = useModelPreviewKind();
  const navigate = useNavigate();
  const { rahkshi, recruitedCharacters } = useGame();
  const { setScene } = useSceneCanvas();

  useEffect(() => {
    if (!isTestMode()) return;
    registerE2eModelPreviewNavigate((path) => navigate(path, { replace: true }));
    return unregisterE2eModelPreviewNavigate;
  }, [navigate]);

  const matoran = useMemo(() => {
    if (kind !== 'characters' || !id) return null;
    const recruited = recruitedCharacters.find((entry) => entry.id === id);
    if (!recruited) return null;
    return getRecruitedMatoran(id, recruitedCharacters);
  }, [id, kind, recruitedCharacters]);

  const armor = useMemo(() => {
    if (kind !== 'rahkshi' || !id) return null;
    return rahkshi.find((entry) => entry.id === id) ?? null;
  }, [id, kind, rahkshi]);

  const armorColors = useMemo(
    () =>
      armor?.power ? getRahkshiArmorColors(armor.power) : { armor: '#C2A375', joint: '#D4AF37' },
    [armor?.power]
  );

  useEffect(() => {
    if (kind === 'characters' && matoran) {
      setScene(<CharacterScene key={matoran.id} matoran={matoran} />);
      return;
    }

    if (kind === 'rahkshi' && armor?.power !== undefined) {
      setScene(<RahkshiScene key={armor.id} kraata={armor.power} hasKraata={!!armor.kraata} />);
    }
  }, [armor, kind, matoran, setScene]);

  if (!isTestMode()) {
    return <Navigate to="/" replace />;
  }

  if (!kind || !id) {
    return <p data-testid="model-preview-invalid">Invalid model preview route.</p>;
  }

  if (kind === 'characters') {
    if (!matoran) {
      return <p data-testid="model-preview-missing">Character not in save: {id}</p>;
    }

    return (
      <div className={`page-container character-detail model-preview element-${matoran.element}`}>
        <div className="character-detail-visualization">
          <div id="model-frame">
            <div className="divider" />
          </div>
        </div>
        <div className="character-detail-tabs" aria-hidden="true" />
        <div className="character-detail-content" aria-hidden="true" />
      </div>
    );
  }

  if (!armor || armor.power === undefined) {
    return <p data-testid="model-preview-missing">Rahkshi not in save: {id}</p>;
  }

  return (
    <div className="page-container model-preview model-preview--rahkshi">
      <div
        className="rahkshi-detail-visualization"
        style={
          {
            '--kraata-head-color': armorColors.armor,
            '--kraata-tail-color': armorColors.joint,
          } as React.CSSProperties
        }
      >
        <div id="rahkshi-model-frame" className="rahkshi-detail__model-frame" />
      </div>
    </div>
  );
};
