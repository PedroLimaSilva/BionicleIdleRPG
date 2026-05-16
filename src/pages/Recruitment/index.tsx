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
import { ChevronLeft, ChevronRight, Link2, X } from 'lucide-react';
import { RecruitmentCelebration } from '../../components/RecruitmentCelebration';
import { SharedCharacterReceivedDialog } from '../../components/SharedCharacterPrompt/SharedCharacterReceivedDialog';
import {
  extractRecruitTokenFromShareInput,
  parseCustomCharacterShare,
} from '../../services/customCharacterShare';

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
    registerSharedCustomCharacter,
  } = useGame();
  const { setScene } = useSceneCanvas();

  const navigate = useNavigate();

  const [selectedMatoran, setSelectedMatoran] = useState<ListedCharacterData | null>(null);
  const [celebratedCharacter, setCelebratedCharacter] = useState<BaseMatoran | null>(null);
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [redeemInput, setRedeemInput] = useState('');
  const [redeemError, setRedeemError] = useState<string | null>(null);
  const [shareWelcome, setShareWelcome] = useState<{
    alreadyOnList: boolean;
    received: BaseMatoran;
  } | null>(null);
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
        setScene(<CharacterScene key="character-preview" matoran={{ ...base, exp: 0 }} />);
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
    // After recruiting, navigate to /characters when the only thing left in the carousel is
    // the always-on "create custom matoran" slot. Otherwise advance to the next recruitable.
    const remaining = buyableCharacters.filter(
      (c) => c.id !== selectedMatoran.id && c.id !== CREATE_CUSTOM_CHARACTER_ID
    );
    const nextFocusedCharacter = remaining[0] ?? null;
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

  const submitRedeemShare = useCallback(() => {
    setRedeemError(null);
    const token = extractRecruitTokenFromShareInput(redeemInput);
    if (!token) {
      setRedeemError('Paste a full share link or the recruit code from the link.');
      return;
    }
    const parsed = parseCustomCharacterShare(token);
    if (!parsed) {
      setRedeemError('That link is not valid or the character data is unsupported.');
      return;
    }
    const alreadyHad = customCharacters.some((c) => c.id === parsed.id);
    registerSharedCustomCharacter(parsed);
    setRedeemModalOpen(false);
    setRedeemInput('');
    setShareWelcome({ alreadyOnList: alreadyHad, received: parsed });
  }, [customCharacters, redeemInput, registerSharedCustomCharacter]);

  const tryPasteFromClipboard = useCallback(async () => {
    setRedeemError(null);
    try {
      if (!navigator.clipboard?.readText) {
        setRedeemError('Clipboard paste is not available in this browser.');
        return;
      }
      const text = await navigator.clipboard.readText();
      setRedeemInput(text);
    } catch {
      setRedeemError('Clipboard access was denied. Paste manually into the box.');
    }
  }, []);

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
                <button
                  type="button"
                  className="recruitment-redeem-open"
                  onClick={() => {
                    setRedeemModalOpen(true);
                    setRedeemError(null);
                  }}
                >
                  <Link2 size={16} aria-hidden />
                  Redeem share link
                </button>
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

      {redeemModalOpen && (
        <div
          className="recruitment-redeem-backdrop"
          role="presentation"
          onClick={() => setRedeemModalOpen(false)}
        >
          <div
            className="recruitment-redeem-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruitment-redeem-title"
            data-testid="recruitment-redeem-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="recruitment-redeem-title" className="recruitment-redeem-heading">
              Redeem share link
            </h2>
            <p className="recruitment-redeem-hint">
              Pasted links work here even when the installed app does not share storage with your
              browser (for example, some iOS home-screen shortcuts).
            </p>
            <textarea
              className="recruitment-redeem-textarea"
              rows={4}
              value={redeemInput}
              onChange={(e) => {
                setRedeemInput(e.target.value);
                setRedeemError(null);
              }}
              placeholder="Paste the full URL or only the recruit=… code from a share link"
              aria-label="Share link or recruit code"
            />
            {redeemError && <p className="recruitment-redeem-error">{redeemError}</p>}
            <div className="recruitment-redeem-actions">
              {typeof navigator !== 'undefined' && !!navigator.clipboard?.readText && (
                <button
                  type="button"
                  className="recruitment-redeem-secondary"
                  onClick={tryPasteFromClipboard}
                >
                  Paste from clipboard
                </button>
              )}
              <button
                type="button"
                className="recruitment-redeem-primary"
                onClick={submitRedeemShare}
              >
                Add to recruitment list
              </button>
              <button
                type="button"
                className="recruitment-redeem-secondary"
                onClick={() => setRedeemModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {shareWelcome && (
        <SharedCharacterReceivedDialog
          alreadyOnList={shareWelcome.alreadyOnList}
          onDismiss={() => setShareWelcome(null)}
          received={shareWelcome.received}
        />
      )}
    </div>
  );
};
