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
import { isDiminished, isRahkshi, isToaMata } from '../../game/characters/matoranStage';
import {
  RAHKSHI_DEX_DEFAULT_MESH_VARIANT,
  type RahkshiDexMeshVariant,
} from '../../data/dex/rahkshi';
import { resolveToaMataBuildId } from '../../rendering/3d/customMataBuild';
import type { BaseMatoran } from '../../types/Matoran';
import './index.scss';

function supportsTahuBattleLod(base: BaseMatoran): boolean {
  return isToaMata(base) && resolveToaMataBuildId(base) === 'Toa_Tahu';
}

function supportsDiminishedPackedMaps(base: BaseMatoran): boolean {
  return isDiminished(base);
}

export const CharacterDexPreview: React.FC = () => {
  const { id } = useParams();
  const { setScene } = useSceneCanvas();
  const base = id ? CHARACTER_DEX[id] : undefined;
  const [selectedMask, setSelectedMask] = useState<Mask | undefined>(base?.mask);
  const [maskPowerActive, setMaskPowerActive] = useState(false);
  const [meshVariant, setMeshVariant] = useState<RahkshiDexMeshVariant>(
    RAHKSHI_DEX_DEFAULT_MESH_VARIANT
  );
  const [discolorationBakesActive, setDiscolorationBakesActive] = useState(true);
  const [normalMapsActive, setNormalMapsActive] = useState(true);
  const [packedRoughnessActive, setPackedRoughnessActive] = useState(true);
  const [packedMetalnessActive, setPackedMetalnessActive] = useState(true);
  const [sceneGeneration, setSceneGeneration] = useState(0);

  useEffect(() => {
    setSelectedMask(base?.mask);
    setMaskPowerActive(false);
    setMeshVariant(RAHKSHI_DEX_DEFAULT_MESH_VARIANT);
    setDiscolorationBakesActive(true);
    setNormalMapsActive(true);
    setPackedRoughnessActive(true);
    setPackedMetalnessActive(true);
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
      discolorationBakesActive:
        supportsTahuBattleLod(base) || supportsDiminishedPackedMaps(base)
          ? discolorationBakesActive
          : undefined,
      maskOverride: selectedMask ?? base.mask,
      maskPowerActive,
      normalMapsActive: supportsTahuBattleLod(base) ? normalMapsActive : undefined,
      packedMetalnessActive: supportsDiminishedPackedMaps(base) ? packedMetalnessActive : undefined,
      packedRoughnessActive: supportsDiminishedPackedMaps(base) ? packedRoughnessActive : undefined,
      rahkshiMeshVariant: isRahkshi(base) ? meshVariant : undefined,
      tahuMeshVariant: supportsTahuBattleLod(base) ? meshVariant : undefined,
    });
  }, [
    base,
    discolorationBakesActive,
    maskPowerActive,
    meshVariant,
    normalMapsActive,
    packedMetalnessActive,
    packedRoughnessActive,
    selectedMask,
  ]);

  useEffect(() => {
    if (!previewMatoran) {
      setScene(null);
      return;
    }
    setScene(
      <CharacterScene
        key={`${previewMatoran.id}-${sceneGeneration}-${previewMatoran.rahkshiMeshVariant ?? previewMatoran.tahuMeshVariant ?? 'detailed'}`}
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

        {(isRahkshi(base) || supportsTahuBattleLod(base)) && (
          <section className="character-dex-control-block">
            <div className="character-dex-mask-heading">
              <h2>Mesh</h2>
              <div className="character-dex-toggle-row">
                <label className="character-dex-mask-toggle">
                  <span>Battle LOD</span>
                  <button
                    type="button"
                    role="switch"
                    aria-label="Battle LOD mesh"
                    aria-checked={meshVariant === 'battle'}
                    className={`toggle-placeholder ${meshVariant === 'battle' ? 'on' : ''}`}
                    onClick={() =>
                      setMeshVariant((variant) => (variant === 'battle' ? 'detailed' : 'battle'))
                    }
                  />
                </label>
                {supportsTahuBattleLod(base) && (
                  <>
                    <label className="character-dex-mask-toggle">
                      <span>Emissive bakes</span>
                      <button
                        type="button"
                        role="switch"
                        aria-label="Emissive discoloration bakes"
                        aria-checked={discolorationBakesActive}
                        className={`toggle-placeholder ${discolorationBakesActive ? 'on' : ''}`}
                        onClick={() => setDiscolorationBakesActive((active) => !active)}
                      />
                    </label>
                    <label className="character-dex-mask-toggle">
                      <span>Normal maps</span>
                      <button
                        type="button"
                        role="switch"
                        aria-label="Authored normal maps"
                        aria-checked={normalMapsActive}
                        className={`toggle-placeholder ${normalMapsActive ? 'on' : ''}`}
                        onClick={() => setNormalMapsActive((active) => !active)}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
            <p className="character-dex-caption">
              {meshVariant === 'battle'
                ? isRahkshi(base)
                  ? 'Merged battle LOD (`Battle_*` meshes on `Rahkshi`)'
                  : 'Merged battle LOD (`Battle_Body` + `Battle_Brain` on `Tahu`)'
                : isRahkshi(base)
                  ? 'Full kit + baked rig (`Rahkshi`)'
                  : 'Full kit sockets (`Tahu`)'}
            </p>
            {supportsTahuBattleLod(base) && (
              <>
                <p className="character-dex-caption">
                  {discolorationBakesActive
                    ? 'Emissive wear maps mixed on weathered plastics'
                    : 'Emissive wear maps off (noise metalness / roughness only)'}
                </p>
                <p className="character-dex-caption">
                  {normalMapsActive
                    ? 'Tangent normal maps applied on weathered plastics'
                    : 'Tangent normal maps off (smooth geometry)'}
                </p>
              </>
            )}
          </section>
        )}

        {supportsDiminishedPackedMaps(base) && (
          <section className="character-dex-control-block">
            <div className="character-dex-mask-heading">
              <h2>Packed maps</h2>
              <div className="character-dex-toggle-row">
                <label className="character-dex-mask-toggle">
                  <span>Discoloration</span>
                  <button
                    type="button"
                    role="switch"
                    aria-label="Packed discoloration"
                    aria-checked={discolorationBakesActive}
                    className={`toggle-placeholder ${discolorationBakesActive ? 'on' : ''}`}
                    onClick={() => setDiscolorationBakesActive((active) => !active)}
                  />
                </label>
                <label className="character-dex-mask-toggle">
                  <span>Roughness</span>
                  <button
                    type="button"
                    role="switch"
                    aria-label="Packed roughness"
                    aria-checked={packedRoughnessActive}
                    className={`toggle-placeholder ${packedRoughnessActive ? 'on' : ''}`}
                    onClick={() => setPackedRoughnessActive((active) => !active)}
                  />
                </label>
                <label className="character-dex-mask-toggle">
                  <span>Metalness</span>
                  <button
                    type="button"
                    role="switch"
                    aria-label="Packed metalness"
                    aria-checked={packedMetalnessActive}
                    className={`toggle-placeholder ${packedMetalnessActive ? 'on' : ''}`}
                    onClick={() => setPackedMetalnessActive((active) => !active)}
                  />
                </label>
              </div>
            </div>
            <p className="character-dex-caption">
              {discolorationBakesActive
                ? 'Emissive B wear mixed on weathered plastics'
                : 'Discoloration off (flat slot color)'}
            </p>
            <p className="character-dex-caption">
              {packedRoughnessActive
                ? 'Emissive R roughness from the packed bake'
                : 'Roughness off (flat slot roughness)'}
            </p>
            <p className="character-dex-caption">
              {packedMetalnessActive
                ? 'Emissive G metalness from the packed bake'
                : 'Metalness off (flat slot metalness)'}
            </p>
          </section>
        )}

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
