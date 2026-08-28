import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHARACTER_DEX } from '../../data/dex';
import { getDexPreviewMasks } from '../../data/masks';
import { MASK_POWERS } from '../../data/combat';
import { Mask } from '../../types/Matoran';
import { CharacterScene } from '../../rendering/3d/CharacterScene';
import { useSceneCanvas } from '../../rendering/3d/hooks/useSceneCanvas';
import { playCharacterPreviewAnimation } from '../../rendering/3d/utils/characterPreviewControls';
import { ElementTag } from '../../components/ElementTag';
import { getAdjacentDexIds, PREVIEW_ANIMATIONS, toDexPreviewMatoran } from './dexEntries';
import './index.scss';

export const CharacterDexPreview: React.FC = () => {
  const { id } = useParams();
  const { setScene } = useSceneCanvas();
  const base = id ? CHARACTER_DEX[id] : undefined;
  const [selectedMask, setSelectedMask] = useState<Mask | undefined>(base?.mask);
  const [maskPowerActive, setMaskPowerActive] = useState(false);
  const [sceneGeneration, setSceneGeneration] = useState(0);

  useEffect(() => {
    setSelectedMask(base?.mask);
    setMaskPowerActive(false);
    setSceneGeneration(0);
  }, [base?.id, base?.mask]);

  const previewMasks = useMemo(
    () => (base ? getDexPreviewMasks(base.stage, base.mask) : []),
    [base]
  );

  const neighbors = useMemo(() => (id ? getAdjacentDexIds(id) : null), [id]);

  const previewMatoran = useMemo(() => {
    if (!base) return null;
    return toDexPreviewMatoran(base, {
      maskOverride: selectedMask ?? base.mask,
      maskPowerActive,
    });
  }, [base, maskPowerActive, selectedMask]);

  useEffect(() => {
    if (!previewMatoran) {
      setScene(null);
      return;
    }
    setScene(
      <CharacterScene
        key={`${previewMatoran.id}-${sceneGeneration}`}
        enablePreviewControls
        matoran={previewMatoran}
      />
    );
  }, [previewMatoran, sceneGeneration, setScene]);

  if (!id || !base || !previewMatoran) {
    return <Navigate to="/test/dex" replace />;
  }

  const wornMask = selectedMask ?? base.mask;
  const canChangeMask = previewMasks.length > 0;

  return (
    <div className={`page-container character-dex-preview element-${base.element}`}>
      <div className="character-dex-preview-nav">
        <Link to="/test/dex" className="character-dex-back">
          <ArrowLeft size={18} aria-hidden /> All characters
        </Link>
        {neighbors && (
          <div className="character-dex-preview-siblings">
            <Link
              to={`/test/dex/${neighbors.prevId}`}
              className="character-dex-preview-sibling"
              aria-label="Previous character"
            >
              <ChevronLeft size={18} aria-hidden />
              {CHARACTER_DEX[neighbors.prevId]?.name ?? neighbors.prevId}
            </Link>
            <Link
              to={`/test/dex/${neighbors.nextId}`}
              className="character-dex-preview-sibling"
              aria-label="Next character"
            >
              {CHARACTER_DEX[neighbors.nextId]?.name ?? neighbors.nextId}
              <ChevronRight size={18} aria-hidden />
            </Link>
          </div>
        )}
      </div>

      <div className="character-detail-visualization">
        <div className="character-header">
          <h1 className="character-name">{base.name}</h1>
          <p className="character-dex-preview-stage">{base.stage}</p>
          <ElementTag element={base.element} />
        </div>
        <div id="model-frame">
          <div className="divider"></div>
        </div>
      </div>

      <div className="character-dex-controls">
        <section className="character-dex-control-block">
          <h2>Combat animations</h2>
          <div className="character-dex-anim-row" role="group" aria-label="Combat animations">
            {PREVIEW_ANIMATIONS.map((animation) => (
              <button
                key={animation}
                type="button"
                className="character-dex-anim-btn"
                onClick={() => {
                  void playCharacterPreviewAnimation(animation);
                }}
              >
                {animation}
              </button>
            ))}
            <button
              type="button"
              className="character-dex-anim-btn"
              onClick={() => setSceneGeneration((n) => n + 1)}
            >
              Reset
            </button>
          </div>
        </section>

        {canChangeMask && (
          <section className="character-dex-control-block">
            <div className="character-dex-mask-heading">
              <h2>Mask</h2>
              <label className="character-dex-mask-toggle">
                <span>Mask power</span>
                <button
                  type="button"
                  role="switch"
                  aria-label="Mask power"
                  aria-checked={maskPowerActive}
                  className={`toggle-placeholder ${maskPowerActive ? 'on' : ''}`}
                  onClick={() => setMaskPowerActive((active) => !active)}
                />
              </label>
            </div>
            <p className="character-dex-mask-name">
              {MASK_POWERS[wornMask]?.longName ?? wornMask.replace(/_/g, ' ')}
            </p>
            <div className="character-dex-mask-grid" role="listbox" aria-label="Change mask">
              {previewMasks.map((mask) => (
                <button
                  type="button"
                  key={mask}
                  role="option"
                  aria-selected={mask === wornMask}
                  className={`character-dex-mask-tile${mask === wornMask ? ' character-dex-mask-tile--selected' : ''}`}
                  onClick={() => setSelectedMask(mask)}
                  title={MASK_POWERS[mask]?.longName ?? mask}
                >
                  <img
                    src={`${import.meta.env.BASE_URL}/avatar/Kanohi/${mask}.webp`}
                    alt={MASK_POWERS[mask]?.shortName ?? mask}
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
