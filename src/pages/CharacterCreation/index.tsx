import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { useGame } from '../../context/Game';
import {
  BaseMatoran,
  CUSTOM_CHARACTER_COST,
  ElementTribe,
  Mask,
  MatoranStage,
  MatoranTag,
} from '../../types/Matoran';
import { LegoColor } from '../../types/Colors';

import './index.scss';

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
};

function readableTextColor(hex: string): string {
  const v = hex.replace('#', '');
  const r = parseInt(v.substring(0, 2), 16);
  const g = parseInt(v.substring(2, 4), 16);
  const b = parseInt(v.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#000' : '#fff';
}

type ColorPart = 'mask' | 'body' | 'arms' | 'feet' | 'eyes';

export const CharacterCreation: React.FC = () => {
  const { createCustomCharacter, protodermis } = useGame();
  const { setScene } = useSceneCanvas();
  const navigate = useNavigate();

  const [name, setName] = useState('New Matoran');
  const [mask, setMask] = useState<Mask>(Mask.Hau);
  const [element, setElement] = useState<ElementTribe>(ElementTribe.Fire);
  const [colors, setColors] = useState({ ...DEFAULT_COLORS });
  const [isMaskTransparent, setIsMaskTransparent] = useState(false);
  const [activePart, setActivePart] = useState<ColorPart>('mask');

  const canAfford = protodermis >= CUSTOM_CHARACTER_COST;
  const nameValid = name.trim().length > 0;
  const canCreate = canAfford && nameValid;

  const previewBase = useMemo<BaseMatoran>(
    () => ({
      colors,
      element,
      id: 'custom_preview',
      isMaskTransparent,
      mask,
      name: name.trim() || 'New Matoran',
      stage: MatoranStage.Diminished,
      tags: [MatoranTag.Custom],
    }),
    [colors, element, isMaskTransparent, mask, name]
  );

  useEffect(() => {
    // Key by previewBase.id (constant during creation) so React only remounts the scene when
    // the character identity changes, not on every color/name keystroke. Remounting on
    // every keystroke would tear down + re-create the postprocessing EffectComposer and can
    // race with WebGL context setup ("Cannot read properties of null (alpha)").
    setScene(
      <CharacterScene
        key={previewBase.id}
        matoran={{ ...previewBase, exp: 0 }}
      />
    );
    return () => setScene(null);
  }, [previewBase, setScene]);

  const palette = activePart === 'eyes' ? EYE_COLOR_PALETTE : BODY_COLOR_PALETTE;

  const onConfirm = () => {
    if (!canCreate) return;
    const id = createCustomCharacter({
      colors,
      element,
      isMaskTransparent,
      mask,
      name: name.trim(),
      stage: MatoranStage.Diminished,
      tags: [MatoranTag.Custom],
    });
    if (id) {
      navigate(`/characters/${id}`);
    }
  };

  return (
    <div className={`character-creation element-${element}`}>
      <div className="character-creation-preview" />
      <div className="character-creation-form">
        <h1 className="character-creation-title">Forge a New Matoran</h1>

        <label className="field">
          <span className="field-label">Name</span>
          <input
            className="field-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
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
                <img
                  src={`${import.meta.env.BASE_URL}/avatar/Kanohi/${m}.webp`}
                  alt={m}
                  style={{ filter: isMaskTransparent ? 'opacity(0.6)' : undefined }}
                />
              </button>
            ))}
          </div>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={isMaskTransparent}
              onChange={(e) => setIsMaskTransparent(e.target.checked)}
            />
            <span>Transparent mask</span>
          </label>
        </div>

        <div className="field">
          <span className="field-label">Color Scheme</span>
          <div className="part-tabs">
            {(['mask', 'body', 'arms', 'feet', 'eyes'] as ColorPart[]).map((p) => (
              <button
                type="button"
                key={p}
                className={`part-tab${activePart === p ? ' part-tab--selected' : ''}`}
                onClick={() => setActivePart(p)}
              >
                <span
                  className="part-tab-swatch"
                  style={{ backgroundColor: colors[p] }}
                  aria-hidden
                />
                <span>{p}</span>
              </button>
            ))}
          </div>
          <div className="color-grid">
            {palette.map((c) => (
              <button
                type="button"
                key={c}
                className={`color-swatch${colors[activePart] === c ? ' color-swatch--selected' : ''}`}
                style={{ backgroundColor: c, color: readableTextColor(c) }}
                onClick={() => setColors((prev) => ({ ...prev, [activePart]: c }))}
                aria-label={c}
              />
            ))}
          </div>
        </div>

        <div className="creation-actions">
          <div className={`creation-cost ${canAfford ? 'has-enough' : 'not-enough'}`}>
            {canAfford ? '✅' : '❌'} {CUSTOM_CHARACTER_COST} protodermis
          </div>
          <button
            type="button"
            className={`elemental-btn element-${element}${canCreate ? '' : ' disabled'}`}
            onClick={onConfirm}
          >
            Create {name.trim() || 'Matoran'}
          </button>
          <button
            type="button"
            className="creation-cancel"
            onClick={() => navigate('/recruitment')}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
