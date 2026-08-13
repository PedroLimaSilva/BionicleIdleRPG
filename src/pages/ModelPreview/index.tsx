import { useEffect, useMemo } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { getRecruitedMatoran } from '../../services/matoranUtils';
import { CharacterScene } from '../../components/CharacterScene';
import { RahkshiScene } from '../../components/CharacterScene/RahkshiScene';
import {
  registerE2eModelPreviewNavigate,
  unregisterE2eModelPreviewNavigate,
} from '../../utils/e2eModelPreview';
import { isTestMode } from '../../utils/testMode';

type ModelPreviewKind = 'characters' | 'rahkshi';

function useModelPreviewKind(): ModelPreviewKind | null {
  const { kind } = useParams();
  if (kind === 'characters' || kind === 'rahkshi') return kind;
  return null;
}

/** Test-only route: mounts a 3D scene into the shared canvas with no page chrome. */
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

  useEffect(() => {
    if (kind === 'characters' && matoran) {
      setScene(<CharacterScene key={matoran.id} matoran={matoran} />);
      return;
    }

    if (kind === 'rahkshi' && armor?.power !== undefined) {
      setScene(<RahkshiScene key={armor.id} kraata={armor.power} hasKraata={!!armor.kraata} />);
      return;
    }

    setScene(null);
  }, [armor, kind, matoran, setScene]);

  if (!isTestMode()) {
    return <Navigate to="/" replace />;
  }

  return null;
};
