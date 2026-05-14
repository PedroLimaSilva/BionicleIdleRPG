import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.scss';
import {
  BaseMatoran,
  CREATE_CUSTOM_CHARACTER_ID,
  ElementTribe,
  isCustomCharacterId,
  ListedCharacterData,
  Mask,
  MatoranStage,
} from '../../types/Matoran';
import { LegoColor } from '../../types/Colors';
import { useGame } from '../../context/Game';
import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { CHARACTER_DEX } from '../../data/dex/index';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { RecruitmentCelebration } from '../../components/RecruitmentCelebration';

/**
 * Placeholder BaseMatoran shown in the recruitment carousel for the "create a new matoran" slot.
 * Made of light-gray clear parts to convey it's a blank template.
 */
const CREATE_PLACEHOLDER: BaseMatoran = {
  colors: {
    arms: LegoColor.LightGray,
    body: LegoColor.LightGray,
    eyes: LegoColor.TransNeonOrange,
    face: LegoColor.DarkGray,
    feet: LegoColor.LightGray,
    mask: LegoColor.LightGray,
  },
  element: ElementTribe.Light,
  id: CREATE_CUSTOM_CHARACTER_ID,
  isMaskTransparent: true,
  mask: Mask.Hau,
  name: 'New Matoran',
  stage: MatoranStage.Diminished,
};

export const Recruitment: React.FC = () => {
  const {
    buyableCharacters,
    customCharacters,
    dismissCustomCharacter,
    protodermis,
    recruitCharacter,
  } = useGame();
  const { setScene } = useSceneCanvas();

  const navigate = useNavigate();

  const [selectedMatoran, setSelectedMatoran] = useState<ListedCharacterData | null>(null);
  const [celebratedCharacter, setCelebratedCharacter] = useState<BaseMatoran | null>(null);
  const pendingNextRef = useRef<ListedCharacterData | null>(null);
  const pendingNavigateRef = useRef(false);

  const getDexEntry = useCallback(
    (id: string): BaseMatoran | null => {
      if (id === CREATE_CUSTOM_CHARACTER_ID) return CREATE_PLACEHOLDER;
      return CHARACTER_DEX[id] ?? customCharacters.find((c) => c.id === id) ?? null;
    },
    [customCharacters]
  );

  const isCreateSlot = selectedMatoran?.id === CREATE_CUSTOM_CHARACTER_ID;
  const isSharedCustom =
    !!selectedMatoran &&
    selectedMatoran.id !== CREATE_CUSTOM_CHARACTER_ID &&
    isCustomCharacterId(selectedMatoran.id);

  const canRecruit = useMemo(() => {
    return selectedMatoran && protodermis >= selectedMatoran.cost;
  }, [selectedMatoran, protodermis]);

  useEffect(() => {
    if (celebratedCharacter) return;

    setSelectedMatoran((prev) => {
      const list = buyableCharacters;
      if (list.length === 0) return null;
      if (prev && list.some((c) => c.id === prev.id)) return prev;
      return list[0];
    });
  }, [buyableCharacters, celebratedCharacter]);

  useEffect(() => {
    if (celebratedCharacter) return;
    if (selectedMatoran) {
      const base = getDexEntry(selectedMatoran.id);
      if (base) {
        // Stable "character-preview" key shared with CharacterCreation and CharacterDetail
        // so transitions between any of those reuse the same scene instance (and its
        // postprocessing EffectComposer) instead of tearing it down and recreating it.
        // The SceneCanvasProvider clears the scene globally on navigation to non-canvas routes.
        setScene(
          <CharacterScene key="character-preview" matoran={{ ...base, exp: 0 }} />
        );
      }
    }
  }, [selectedMatoran, setScene, celebratedCharacter, getDexEntry]);

  const selectPrev = useCallback(() => {
    if (!selectedMatoran) return;
    const idx = buyableCharacters.findIndex((c) => c.id === selectedMatoran.id);
    const prev = buyableCharacters[idx - 1] ?? buyableCharacters[buyableCharacters.length - 1];
    if (prev) setSelectedMatoran(prev);
  }, [selectedMatoran, buyableCharacters]);

  const selectNext = useCallback(() => {
    if (!selectedMatoran) return;
    const idx = buyableCharacters.findIndex((c) => c.id === selectedMatoran.id);
    const next = buyableCharacters[idx + 1] ?? buyableCharacters[0];
    if (next) setSelectedMatoran(next);
  }, [selectedMatoran, buyableCharacters]);

  const confirmRecruitment = () => {
    if (!selectedMatoran || !canRecruit) return;
    if (isCreateSlot) {
      navigate('/character-create');
      return;
    }
    const recruited = getDexEntry(selectedMatoran.id);
    if (!recruited) return;
    const nextFocusedCharacter =
      buyableCharacters.filter((c) => c.id !== selectedMatoran.id)[0] ?? null;
    pendingNextRef.current = nextFocusedCharacter;
    pendingNavigateRef.current = !nextFocusedCharacter;
    recruitCharacter(selectedMatoran);
    setCelebratedCharacter(recruited);
  };

  const dismissCurrent = () => {
    if (!selectedMatoran || !isSharedCustom) return;
    const next = buyableCharacters.filter((c) => c.id !== selectedMatoran.id)[0] ?? null;
    dismissCustomCharacter(selectedMatoran.id);
    setSelectedMatoran(next);
  };

  const dismissCelebration = useCallback(() => {
    setCelebratedCharacter(null);
    if (pendingNavigateRef.current) {
      pendingNavigateRef.current = false;
      navigate('/characters');
    } else if (pendingNextRef.current) {
      setSelectedMatoran(pendingNextRef.current);
      pendingNextRef.current = null;
    }
  }, [navigate]);

  return (
    <div className="recruitment-screen">
      <div className="recruitment-preview">
        {selectedMatoran && (
          <>
            <button
              type="button"
              className="recruitment-arrow recruitment-arrow--left"
              onClick={selectPrev}
              aria-label="Previous character"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              type="button"
              className="recruitment-arrow recruitment-arrow--right"
              onClick={selectNext}
              aria-label="Next character"
            >
              <ChevronRight size={32} />
            </button>
          </>
        )}
      </div>
      {selectedMatoran &&
        (() => {
          const base = getDexEntry(selectedMatoran.id);
          if (!base) return null;
          return (
            <div className={`requirement-drawer element-${base.element}`}>
              <h1 className="character-name">{base.name}</h1>
              <div className="requirement-list">
                <h4>Requirements</h4>
                <ul>
                  <li className={protodermis >= selectedMatoran.cost ? 'has-enough' : 'not-enough'}>
                    {protodermis >= selectedMatoran.cost ? '✅' : '❌'} {selectedMatoran.cost}{' '}
                    protodermis
                  </li>
                </ul>
                {isSharedCustom && (
                  <p className="custom-character-note">
                    Shared custom matoran. Recruit to add to your team, or dismiss to remove from
                    the list.
                  </p>
                )}
                <button
                  className={`elemental-btn ${canRecruit ? '' : 'disabled'} element-${base.element}`}
                  onClick={confirmRecruitment}
                >
                  {isCreateSlot ? 'Create' : 'Recruit'}
                </button>
                {isSharedCustom && (
                  <button
                    type="button"
                    className="dismiss-custom-btn"
                    onClick={dismissCurrent}
                    aria-label={`Dismiss ${base.name}`}
                  >
                    <X size={16} /> Dismiss
                  </button>
                )}
              </div>
            </div>
          );
        })()}

      <RecruitmentCelebration matoran={celebratedCharacter} onDismiss={dismissCelebration} />
    </div>
  );
};
