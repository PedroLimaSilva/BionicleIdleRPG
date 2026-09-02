import { AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '../../components/Modal';
import { CharacterScene } from '../../rendering/3d/CharacterScene';
import { useSceneCanvas } from '../../rendering/3d/hooks/useSceneCanvas';
import { useGame } from '../../context/Game';
import { useSettings } from '../../context/useSettings';
import { getRecruitedMatoran } from '../../services/matoranUtils';
import {
  colorPartLabel,
  getActiveTabColor,
  getColorTabSwatch,
  getEditableSlotsForTab,
  getOrderedEditableColorTabs,
  isFlatColorTab,
  normalizeCustomCharacterColorsForStage,
  prefillColorsAfterEvolution,
  setColorTabValue,
  slotLabel,
} from '../../game/characters/customCharacterColorSlots';
import { DEFAULT_CUSTOM_MATA_MODEL_ID } from '../../rendering/3d/customMataBuild';
import {
  CUSTOM_SELECTABLE_METRU_MODEL_IDS,
  CUSTOM_SELECTABLE_NUVA_MODEL_IDS,
  getDefaultCustomToaModelIdForStage,
  getStageForCustomToaModelId,
  type CustomToaArmorFamily,
} from '../../rendering/3d/customToaBuild';
import { CUSTOM_SELECTABLE_MATA_MODEL_IDS } from '../../rendering/3d/customMataBuild';
import { isToa } from '../../game/characters/matoranStage';
import { DEFAULT_CUSTOM_COLORS } from '../../data/dex/partPalettes';
import { CHARACTER_DEX } from '../../data/dex';
import { getSelectableMasksForStage, isTransparentMask } from '../../data/masks';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_COST,
  CUSTOM_CHARACTER_EDIT_COST,
  ElementTribe,
  isCustomCharacterId,
  Mask,
  MatoranStage,
  MatoranTag,
  type ColorTabId,
} from '../../types/Matoran';
import type { BodyPartSlot } from '../../types/KitParts';
import { LegoColor } from '../../types/Colors';

import './index.scss';

/** Placeholder label in the name field; cannot be submitted as the final name. */
const DEFAULT_CUSTOM_MATORAN_NAME = 'New Matoran';

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

/** Stages exposed when "Debug character creation" is on (new characters only). */
const DEBUG_CREATION_STAGES: MatoranStage[] = [
  MatoranStage.Diminished,
  MatoranStage.Rebuilt,
  MatoranStage.Metru,
  MatoranStage.ToaMata,
  MatoranStage.ToaNuva,
  MatoranStage.ToaMetru,
  MatoranStage.Turaga,
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

function readableTextColor(hex: string): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000' : '#fff';
}

type CharacterCreateLocationState = {
  customizeCharacterId?: string;
  evolutionFromStage?: MatoranStage;
  /** Post-evolution editor visit is free; returning from the detail page costs protodermis. */
  freeCustomize?: boolean;
};

const TOA_ARMOR_GROUPS: { family: CustomToaArmorFamily; label: string; ids: readonly string[] }[] =
  [
    { family: 'mata', ids: CUSTOM_SELECTABLE_MATA_MODEL_IDS, label: 'Toa Mata' },
    { family: 'nuva', ids: CUSTOM_SELECTABLE_NUVA_MODEL_IDS, label: 'Toa Nuva' },
    { family: 'metru', ids: CUSTOM_SELECTABLE_METRU_MODEL_IDS, label: 'Toa Metru' },
  ];

function isToaCustomizationStage(stage: MatoranStage): boolean {
  return (
    stage === MatoranStage.ToaMata ||
    stage === MatoranStage.ToaNuva ||
    stage === MatoranStage.ToaMetru
  );
}

export const CharacterCreation: React.FC = () => {
  const {
    createCustomCharacter,
    customCharacters,
    protodermis,
    recruitedCharacters,
    updateCustomCharacter,
  } = useGame();
  const { setScene } = useSceneCanvas();
  const { debugCharacterCreation } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as CharacterCreateLocationState | null;
  const customizeId = locationState?.customizeCharacterId;
  const evolutionFromStage = locationState?.evolutionFromStage;
  const freeCustomize = locationState?.freeCustomize ?? false;

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

  const [debugStartingStage, setDebugStartingStage] = useState<MatoranStage>(
    MatoranStage.Diminished
  );

  const creationStage = useMemo(() => {
    if (isEditMode && customizeId) {
      return getRecruitedMatoran(customizeId, recruitedCharacters).stage;
    }
    if (debugCharacterCreation) {
      return debugStartingStage;
    }
    return MatoranStage.Diminished;
  }, [debugCharacterCreation, customizeId, debugStartingStage, isEditMode, recruitedCharacters]);

  const [name, setName] = useState(DEFAULT_CUSTOM_MATORAN_NAME);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [mask, setMask] = useState<Mask>(Mask.Hau);
  const [element, setElement] = useState<ElementTribe>(ElementTribe.Fire);
  const [colors, setColors] = useState<BaseMatoran['colors']>(() => ({
    ...DEFAULT_CUSTOM_COLORS,
  }));
  const [activePart, setActivePart] = useState<ColorTabId>('mask');
  const [activeSlot, setActiveSlot] = useState<BodyPartSlot>('main');
  const [toaBuildId, setToaBuildId] = useState<string>(DEFAULT_CUSTOM_MATA_MODEL_ID);

  const recruitedCustom = useMemo(
    () =>
      customizeId && isCustomCharacterId(customizeId)
        ? getRecruitedMatoran(customizeId, recruitedCharacters)
        : null,
    [customizeId, recruitedCharacters]
  );

  const paidToaCustomize = Boolean(
    isEditMode && recruitedCustom && isToa(recruitedCustom) && !freeCustomize
  );

  const previewStage = useMemo(() => {
    if (isEditMode && isToaCustomizationStage(creationStage)) {
      return getStageForCustomToaModelId(toaBuildId) ?? creationStage;
    }
    if (debugCharacterCreation && isToaCustomizationStage(creationStage)) {
      return getStageForCustomToaModelId(toaBuildId) ?? creationStage;
    }
    return creationStage;
  }, [creationStage, debugCharacterCreation, isEditMode, toaBuildId]);

  const selectableMasks = useMemo(() => getSelectableMasksForStage(previewStage), [previewStage]);

  useEffect(() => {
    if (!selectableMasks.includes(mask)) {
      setMask(selectableMasks[0] ?? Mask.Hau);
    }
  }, [mask, selectableMasks]);

  const colorTabs = useMemo(
    () =>
      getOrderedEditableColorTabs(
        previewStage,
        isToaCustomizationStage(previewStage) ? toaBuildId : undefined
      ),
    [previewStage, toaBuildId]
  );

  const lastFormInitKeyRef = useRef('');
  const lastCreationStageRef = useRef(creationStage);

  useEffect(() => {
    if (isEditMode) return;
    if (lastCreationStageRef.current === creationStage) return;
    const fromStage = lastCreationStageRef.current;
    lastCreationStageRef.current = creationStage;
    setColors((prev) => prefillColorsAfterEvolution(fromStage, creationStage, prev));
  }, [creationStage, isEditMode]);

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
    setToaBuildId(full.customMataModelId ?? getDefaultCustomToaModelIdForStage(full.stage));
  }, [customizeId, evolutionFromStage, isEditMode, recruitedCharacters]);

  // Mirror the dex, where only the Kaukau sculpts are flagged as transparent.
  const isMaskTransparent = isTransparentMask(mask);

  const trimmedName = name.trim();
  const nameAllowed = trimmedName.length > 0 && trimmedName !== DEFAULT_CUSTOM_MATORAN_NAME;
  const editCost = paidToaCustomize ? CUSTOM_CHARACTER_EDIT_COST : 0;
  const canAfford = isEditMode
    ? paidToaCustomize
      ? protodermis >= editCost
      : true
    : protodermis >= CUSTOM_CHARACTER_COST;
  const canCreate = isEditMode
    ? paidToaCustomize
      ? canAfford
      : nameAllowed
    : canAfford && nameAllowed;
  const displayColors = useMemo(
    () => normalizeCustomCharacterColorsForStage(previewStage, colors),
    [colors, previewStage]
  );

  const partSlots = useMemo(
    () => getEditableSlotsForTab(previewStage, activePart),
    [activePart, previewStage]
  );

  useEffect(() => {
    if (isFlatColorTab(activePart)) return;
    if (!partSlots.includes(activeSlot)) {
      setActiveSlot(partSlots[0] ?? 'main');
    }
  }, [activePart, activeSlot, partSlots]);

  const previewBase = useMemo<BaseMatoran>(
    () => ({
      colors: displayColors,
      element,
      id: 'custom_preview',
      isMaskTransparent,
      mask,
      name: name.trim() || DEFAULT_CUSTOM_MATORAN_NAME,
      stage: previewStage,
      tags: [MatoranTag.Custom],
    }),
    [element, isMaskTransparent, mask, name, previewStage, displayColors]
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
          ...(isToaCustomizationStage(previewStage)
            ? { customMataModelId: toaBuildId, stage: previewStage }
            : {}),
        }}
      />
    );
  }, [livePreview, previewStage, setScene, toaBuildId]);

  const handleToaBuildChange = (nextBuildId: string) => {
    const prevStage = getStageForCustomToaModelId(toaBuildId) ?? previewStage;
    const nextStage = getStageForCustomToaModelId(nextBuildId);
    setToaBuildId(nextBuildId);
    if (nextStage && nextStage !== prevStage) {
      setColors((prev) => prefillColorsAfterEvolution(prevStage, nextStage, prev));
    }
  };

  const editingGlow = !isFlatColorTab(activePart) && activeSlot === 'glow';
  const palette = activePart === 'eyes' || editingGlow ? EYE_COLOR_PALETTE : BODY_COLOR_PALETTE;
  const currentColor = getActiveTabColor(
    displayColors,
    activePart,
    isFlatColorTab(activePart) ? 'main' : activeSlot
  );

  const colorsForSave = (stage: MatoranStage, raw: BaseMatoran['colors']): BaseMatoran['colors'] =>
    normalizeCustomCharacterColorsForStage(stage, raw);

  const performCreate = () => {
    if (!canCreate) return;
    if (isEditMode && customizeId) {
      const recruited = getRecruitedMatoran(customizeId, recruitedCharacters);
      const saveStage = isToaCustomizationStage(previewStage)
        ? (getStageForCustomToaModelId(toaBuildId) ?? recruited.stage)
        : recruited.stage;
      const resolvedColors = colorsForSave(saveStage, colors);
      const ok = updateCustomCharacter(
        customizeId,
        {
          colors: resolvedColors,
          element: paidToaCustomize ? recruited.element : element,
          isMaskTransparent: paidToaCustomize ? recruited.isMaskTransparent : isMaskTransparent,
          mask: paidToaCustomize ? (recruited.maskOverride ?? recruited.mask) : mask,
          name: paidToaCustomize ? recruited.name : trimmedName,
          stage: saveStage,
          tags: [MatoranTag.Custom],
        },
        isToaCustomizationStage(saveStage) ? { customMataModelId: toaBuildId } : undefined,
        paidToaCustomize ? { protodermisCost: CUSTOM_CHARACTER_EDIT_COST } : undefined
      );
      if (ok) {
        navigate(`/characters/${customizeId}`);
      }
      return;
    }
    const resolvedColors = colorsForSave(previewStage, colors);
    const id = createCustomCharacter(
      {
        colors: resolvedColors,
        element,
        isMaskTransparent,
        mask,
        name: trimmedName,
        stage: previewStage,
        tags: [MatoranTag.Custom],
      },
      isToaCustomizationStage(previewStage) ? { customMataModelId: toaBuildId } : undefined
    );
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
        {debugCharacterCreation && !isEditMode && (
          <label className="field">
            <span className="field-label">Stage (debug)</span>
            <select
              className="field-input"
              value={debugStartingStage}
              onChange={(e) => setDebugStartingStage(e.target.value as MatoranStage)}
            >
              {DEBUG_CREATION_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}

        {!paidToaCustomize && (
          <>
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
                {selectableMasks.map((m) => (
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
          </>
        )}

        {(isEditMode || debugCharacterCreation) && isToaCustomizationStage(previewStage) && (
          <label className="field">
            <span className="field-label">Toa armor</span>
            <select
              className="field-input"
              value={toaBuildId}
              onChange={(e) => handleToaBuildChange(e.target.value)}
            >
              {TOA_ARMOR_GROUPS.map((group) => (
                <optgroup key={group.family} label={group.label}>
                  {group.ids.map((mid) => (
                    <option key={mid} value={mid}>
                      {CHARACTER_DEX[mid]?.name ?? mid}
                    </option>
                  ))}
                </optgroup>
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
                  style={{ backgroundColor: getColorTabSwatch(displayColors, p) }}
                  aria-hidden
                />
                <span>{colorPartLabel(p, previewStage)}</span>
              </button>
            ))}
          </div>
          {partSlots.length > 1 && (
            <div className="slot-tabs" data-testid="part-slots">
              {partSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  className={`part-tab${activeSlot === slot ? ' part-tab--selected' : ''}`}
                  onClick={() => setActiveSlot(slot)}
                >
                  <span
                    className="part-tab-swatch"
                    style={{
                      backgroundColor: getActiveTabColor(displayColors, activePart, slot),
                    }}
                    aria-hidden
                  />
                  <span>{slotLabel(slot)}</span>
                </button>
              ))}
            </div>
          )}
          <div className="color-grid">
            {palette.map((c) => (
              <div
                key={c}
                className={`color-swatch${currentColor === c ? ' color-swatch--selected' : ''}`}
                style={{ background: c, color: readableTextColor(c) }}
                onClick={() =>
                  setColors((prev) =>
                    setColorTabValue(
                      normalizeCustomCharacterColorsForStage(previewStage, prev),
                      activePart,
                      c,
                      isFlatColorTab(activePart) ? 'main' : activeSlot
                    )
                  )
                }
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
          {paidToaCustomize && (
            <div className={`creation-cost ${canAfford ? 'has-enough' : 'not-enough'}`}>
              {canAfford ? '✅' : '❌'} {CUSTOM_CHARACTER_EDIT_COST} protodermis
            </div>
          )}
          <button
            type="button"
            className={`elemental-btn element-${element}${canCreate ? '' : ' disabled'}`}
            onClick={onCreateClick}
          >
            {isEditMode
              ? paidToaCustomize
                ? 'Save appearance'
                : `Save ${trimmedName || 'Matoran'}`
              : `Create ${trimmedName || 'Matoran'}`}
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
