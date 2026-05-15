import { AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '../../components/Modal';
import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { useGame } from '../../context/Game';
import { getRecruitedMatoran } from '../../services/matoranUtils';
import {
  getOrderedEditableColorTabs,
  normalizeCustomCharacterColorsForStage,
  prefillColorsAfterEvolution,
} from '../../game/customCharacterColorSlots';
import {
  CUSTOM_SELECTABLE_MATA_MODEL_IDS,
  DEFAULT_CUSTOM_MATA_MODEL_ID,
  mataModelUsesKitPlayerPalette,
} from '../../game/customMataBuild';
import { CHARACTER_DEX } from '../../data/dex';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_COST,
  ElementTribe,
  isCustomCharacterId,
  Mask,
  MatoranStage,
  MatoranTag,
} from '../../types/Matoran';
import type { MatoranPaletteKey } from '../../types/KitParts';
import { LegoColor } from '../../types/Colors';

import './index.scss';

/** Placeholder label in the name field; cannot be submitted as the final name. */
const DEFAULT_CUSTOM_MATORAN_NAME = 'New Matoran';

/** The 12 standard Kanohi available to custom characters (Matoran-tier masks). */
const SELECTABLE_MASKS: Mask[] = [
  Mask.Akaku,
  Mask.Hau,
  Mask.Huna,
  Mask.Kakama,
  Mask.Kaukau,
  Mask.Komau,
  Mask.Mahiki,
  Mask.Matatu,
  Mask.Miru,
  Mask.Pakari,
  Mask.Rau,
  Mask.Ruru,
];

const SELECTABLE_ELEMENTS: ElementTribe[] = [
  ElementTribe.Fire,
  ElementTribe.Water,
  ElementTribe.Air,
  ElementTribe.Ice,
  ElementTribe.Stone,
  ElementTribe.Earth,
  ElementTribe.Light,
  ElementTribe.Shadow,
];

/** Subset of LegoColors useful as body/armor colors for a custom character. */
const BODY_COLOR_PALETTE: LegoColor[] = [
  LegoColor.Black,
  LegoColor.Brown,
  LegoColor.Green,
  LegoColor.DarkTurquoise,
  LegoColor.Red,
  LegoColor.Lime,
  LegoColor.Yellow,
  LegoColor.White,
  LegoColor.LightGray,
  LegoColor.Blue,
  LegoColor.MediumBlue,
  LegoColor.Orange,
  LegoColor.DarkGray,
  LegoColor.DarkOrange,
  LegoColor.SandBlue,
  LegoColor.PearlGold,
  LegoColor.Purple,
  LegoColor.FlatDarkGold,
  LegoColor.Tan,
];

const EYE_COLOR_PALETTE: LegoColor[] = [
  LegoColor.TransDarkBlue,
  LegoColor.TransMediumBlue,
  LegoColor.TransNeonYellow,
  LegoColor.TransGreen,
  LegoColor.TransNeonOrange,
  LegoColor.TransNeonGreen,
  LegoColor.TransNeonRed,
  LegoColor.TransNeonPink,
];

/** Default starting palette: gray clear-parts placeholder, neon-orange eyes. */
const DEFAULT_COLORS = {
  arms: LegoColor.LightGray,
  body: LegoColor.LightGray,
  eyes: LegoColor.TransNeonOrange,
  face: LegoColor.DarkGray,
  feet: LegoColor.LightGray,
  mask: LegoColor.LightGray,
  weaponGlow: LegoColor.TransNeonYellow,
};

function readableTextColor(hex: string): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000' : '#fff';
}

function colorPartLabel(part: MatoranPaletteKey, stage: MatoranStage): string {
  if (part === 'feet' && stage === MatoranStage.Rebuilt) {
    return 'feet & hands';
  }
  if (part === 'weaponGlow') {
    return 'weapon glow';
  }
  return part;
}

type CharacterCreateLocationState = {
  customizeAfterEvolution?: string;
  evolutionFromStage?: MatoranStage;
};

export const CharacterCreation: React.FC = () => {
  const {
    createCustomCharacter,
    customCharacters,
    protodermis,
    recruitedCharacters,
    updateCustomCharacter,
  } = useGame();
  const { setScene } = useSceneCanvas();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as CharacterCreateLocationState | null;
  const customizeId = locationState?.customizeAfterEvolution;
  const evolutionFromStage = locationState?.evolutionFromStage;

  const isEditMode = useMemo(
    () =>
      Boolean(
        customizeId &&
        isCustomCharacterId(customizeId) &&
        customCharacters.some((c) => c.id === customizeId) &&
        recruitedCharacters.some((r) => r.id === customizeId)
      ),
    [customCharacters, customizeId, recruitedCharacters]
  );

  const creationStage = useMemo(() => {
    if (isEditMode && customizeId) {
      return getRecruitedMatoran(customizeId, recruitedCharacters).stage;
    }
    return MatoranStage.Diminished;
  }, [customizeId, isEditMode, recruitedCharacters]);

  const [name, setName] = useState(DEFAULT_CUSTOM_MATORAN_NAME);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [mask, setMask] = useState<Mask>(Mask.Hau);
  const [element, setElement] = useState<ElementTribe>(ElementTribe.Fire);
  const [colors, setColors] = useState<BaseMatoran['colors']>(() => ({ ...DEFAULT_COLORS }));
  const [activePart, setActivePart] = useState<MatoranPaletteKey>('mask');
  const [mataBuildId, setMataBuildId] = useState<string>(DEFAULT_CUSTOM_MATA_MODEL_ID);

  const colorTabs = useMemo(
    () =>
      getOrderedEditableColorTabs(
        creationStage,
        creationStage === MatoranStage.ToaMata ? mataBuildId : undefined
      ),
    [creationStage, mataBuildId]
  );

  const lastFormInitKeyRef = useRef('');

  useEffect(() => {
    if (!colorTabs.includes(activePart)) {
      setActivePart(colorTabs[0] ?? 'mask');
    }
  }, [activePart, colorTabs]);

  useEffect(() => {
    if (!customizeId) return;
    if (isEditMode) return;
    navigate('/recruitment', { replace: true });
  }, [customizeId, isEditMode, navigate]);

  useEffect(() => {
    if (!customizeId || !isEditMode) {
      lastFormInitKeyRef.current = '';
      return;
    }
    const full = getRecruitedMatoran(customizeId, recruitedCharacters);
    const initKey = `${customizeId}|${full.stage}|${evolutionFromStage ?? 'none'}`;
    if (lastFormInitKeyRef.current === initKey) return;
    lastFormInitKeyRef.current = initKey;

    setName(full.name);
    setMask(full.maskOverride ?? full.mask);
    setElement(full.element);
    let nextColors = { ...full.colors };
    if (evolutionFromStage !== undefined) {
      nextColors = prefillColorsAfterEvolution(evolutionFromStage, full.stage, nextColors);
    }
    setColors(normalizeCustomCharacterColorsForStage(full.stage, nextColors));
    setMataBuildId(full.customMataModelId ?? DEFAULT_CUSTOM_MATA_MODEL_ID);
  }, [customizeId, evolutionFromStage, isEditMode, recruitedCharacters]);

  // Only the Kaukau is canonically transparent in the dex; mirror that for custom matoran.
  const isMaskTransparent = mask === Mask.Kaukau;

  const trimmedName = name.trim();
  const nameAllowed = trimmedName.length > 0 && trimmedName !== DEFAULT_CUSTOM_MATORAN_NAME;
  const canAfford = protodermis >= CUSTOM_CHARACTER_COST;
  const canCreate = isEditMode ? nameAllowed : canAfford && nameAllowed;
  const displayColors = useMemo(() => {
    const base = normalizeCustomCharacterColorsForStage(creationStage, colors);
    if (
      creationStage === MatoranStage.ToaMata &&
      mataBuildId &&
      mataModelUsesKitPlayerPalette(mataBuildId) &&
      base.weaponGlow === undefined
    ) {
      return { ...base, weaponGlow: LegoColor.TransNeonYellow };
    }
    return base;
  }, [colors, creationStage, mataBuildId]);

  const previewBase = useMemo<BaseMatoran>(
    () => ({
      colors: displayColors,
      element,
      id: 'custom_preview',
      isMaskTransparent,
      mask,
      name: name.trim() || DEFAULT_CUSTOM_MATORAN_NAME,
      stage: creationStage,
      tags: [MatoranTag.Custom],
    }),
    [creationStage, displayColors, element, isMaskTransparent, mask, name]
  );

  // Debounced preview matoran. The 3D `CharacterScene` recreates Three.js materials whenever
  // `matoran.colors` (a new object) is passed in. Pushing that on every keystroke / color pick
  // creates many short-lived WebGL materials in quick succession, which has been observed to
  // exhaust the GL context in dev (manifesting as "Context Lost" + "Cannot read properties of
  // null (alpha)" from the postprocessing EffectComposer on the next page). Throttling the
  // prop updates lets rapid edits coalesce into a single material re-application.
  const [livePreview, setLivePreview] = useState<BaseMatoran>(previewBase);
  const previewTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (previewTimerRef.current !== null) {
      window.clearTimeout(previewTimerRef.current);
    }
    previewTimerRef.current = window.setTimeout(() => {
      setLivePreview(previewBase);
      previewTimerRef.current = null;
    }, 400);
    return () => {
      if (previewTimerRef.current !== null) {
        window.clearTimeout(previewTimerRef.current);
        previewTimerRef.current = null;
      }
    };
  }, [previewBase]);

  // Mount the 3D scene with a stable key shared with `CharacterDetail`. When the user
  // confirms creation and navigates to /characters/:id, the new page re-uses the same key
  // and React reconciles into the existing `CharacterScene` instance instead of tearing
  // it (and its postprocessing EffectComposer) down. We deliberately do NOT null the scene
  // on unmount: the route we navigate to next either replaces it (CharacterDetail, back to
  // Recruitment) or — for arbitrary navigations away (e.g. nav-bar to /quests) — the global
  // route-aware cleanup in `SceneCanvasProvider` handles tearing it down.
  useEffect(() => {
    setScene(
      <CharacterScene
        key="character-preview"
        matoran={{
          ...livePreview,
          exp: 0,
          ...(creationStage === MatoranStage.ToaMata ? { customMataModelId: mataBuildId } : {}),
        }}
      />
    );
  }, [creationStage, livePreview, mataBuildId, setScene]);

  const palette =
    activePart === 'eyes' || activePart === 'weaponGlow' ? EYE_COLOR_PALETTE : BODY_COLOR_PALETTE;

  const performCreate = () => {
    if (!canCreate) return;
    if (isEditMode && customizeId) {
      const stage = getRecruitedMatoran(customizeId, recruitedCharacters).stage;
      const resolvedColors = normalizeCustomCharacterColorsForStage(stage, colors);
      const ok = updateCustomCharacter(
        customizeId,
        {
          colors: resolvedColors,
          element,
          isMaskTransparent,
          mask,
          name: trimmedName,
          stage,
          tags: [MatoranTag.Custom],
        },
        stage === MatoranStage.ToaMata ? { customMataModelId: mataBuildId } : undefined
      );
      if (ok) {
        navigate(`/characters/${customizeId}`);
      }
      return;
    }
    const resolvedColors = normalizeCustomCharacterColorsForStage(MatoranStage.Diminished, colors);
    const id = createCustomCharacter({
      colors: resolvedColors,
      element,
      isMaskTransparent,
      mask,
      name: trimmedName,
      stage: MatoranStage.Diminished,
      tags: [MatoranTag.Custom],
    });
    if (id) {
      setShowCreateConfirm(false);
      navigate(`/characters/${id}`);
    }
  };

  const onCreateClick = () => {
    if (!canCreate) return;
    if (isEditMode) {
      performCreate();
      return;
    }
    setShowCreateConfirm(true);
  };

  return (
    <div className={`character-creation element-${element}`}>
      <div className="character-creation-preview" />
      <div className="character-creation-form">
        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="field-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            aria-invalid={!nameAllowed}
          />
        </label>

        <div className="field">
          <span className="field-label">Element</span>
          <div className="chip-row">
            {SELECTABLE_ELEMENTS.map((el) => (
              <button
                type="button"
                key={el}
                className={`chip element-${el}${element === el ? ' chip--selected' : ''}`}
                onClick={() => setElement(el)}
              >
                {el}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Kanohi (Mask)</span>
          <div className="mask-grid">
            {SELECTABLE_MASKS.map((m) => (
              <button
                type="button"
                key={m}
                className={`mask-tile${mask === m ? ' mask-tile--selected' : ''}`}
                onClick={() => setMask(m)}
                title={m}
              >
                <img src={`${import.meta.env.BASE_URL}/avatar/Kanohi/${m}.webp`} alt={m} />
              </button>
            ))}
          </div>
        </div>

        {isEditMode && creationStage === MatoranStage.ToaMata && (
          <label className="field">
            <span className="field-label">Toa build (model)</span>
            <select
              className="field-input"
              value={mataBuildId}
              onChange={(e) => setMataBuildId(e.target.value)}
            >
              {CUSTOM_SELECTABLE_MATA_MODEL_IDS.map((mid) => (
                <option key={mid} value={mid}>
                  {CHARACTER_DEX[mid]?.name ?? mid}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="field">
          <span className="field-label">Color Scheme</span>
          <div className="part-tabs">
            {colorTabs.map((p) => (
              <button
                type="button"
                key={p}
                className={`part-tab${activePart === p ? ' part-tab--selected' : ''}`}
                onClick={() => setActivePart(p)}
              >
                <span
                  className="part-tab-swatch"
                  style={{ backgroundColor: displayColors[p] }}
                  aria-hidden
                />
                <span>{colorPartLabel(p, creationStage)}</span>
              </button>
            ))}
          </div>
          <div className="color-grid">
            {palette.map((c) => (
              <div
                key={c}
                className={`color-swatch${displayColors[activePart] === c ? ' color-swatch--selected' : ''}`}
                style={{ background: c, color: readableTextColor(c) }}
                onClick={() => setColors((prev) => ({ ...prev, [activePart]: c }))}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="creation-actions">
          {!isEditMode && (
            <div className={`creation-cost ${canAfford ? 'has-enough' : 'not-enough'}`}>
              {canAfford ? '✅' : '❌'} {CUSTOM_CHARACTER_COST} protodermis
            </div>
          )}
          <button
            type="button"
            className={`elemental-btn element-${element}${canCreate ? '' : ' disabled'}`}
            onClick={onCreateClick}
          >
            {isEditMode ? `Save ${trimmedName || 'Matoran'}` : `Create ${trimmedName || 'Matoran'}`}
          </button>
          <button
            type="button"
            className="creation-cancel"
            onClick={() =>
              isEditMode && customizeId
                ? navigate(`/characters/${customizeId}`)
                : navigate('/recruitment')
            }
          >
            Cancel
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showCreateConfirm && (
          <Modal
            classNames="character-create-confirm-modal"
            onClose={() => setShowCreateConfirm(false)}
          >
            <div
              className="character-create-confirm-modal__inner"
              data-testid="create-matoran-confirm-modal"
            >
              <h2
                className="character-create-confirm-modal__title"
                id="create-matoran-confirm-title"
              >
                Create {trimmedName}?
              </h2>
              <p className="character-create-confirm-modal__body">
                This spends {CUSTOM_CHARACTER_COST} protodermis. After creation, you cannot change
                their name, mask, element, or colors.
              </p>
              <div className="character-create-confirm-modal__actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="confirm-button"
                  data-testid="create-matoran-confirm-submit"
                  onClick={performCreate}
                >
                  Confirm creation
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};
