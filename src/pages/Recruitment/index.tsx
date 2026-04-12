import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.scss';
import { BaseMatoran, ListedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { CHARACTER_DEX } from '../../data/dex/index';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { RecruitmentCelebration } from '../../components/RecruitmentCelebration';

export const Recruitment: React.FC = () => {
  const { protodermis, recruitCharacter, buyableCharacters } = useGame();
  const { setScene } = useSceneCanvas();

  const navigate = useNavigate();

  const [selectedMatoran, setSelectedMatoran] = useState<ListedCharacterData | null>(null);
  const [celebratedCharacter, setCelebratedCharacter] = useState<BaseMatoran | null>(null);
  const pendingNextRef = useRef<ListedCharacterData | null>(null);
  const pendingNavigateRef = useRef(false);

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
      setScene(<CharacterScene matoran={{ ...CHARACTER_DEX[selectedMatoran.id], exp: 0 }} />);
    }
    return () => {
      setScene(null);
    };
  }, [selectedMatoran, setScene, celebratedCharacter]);

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
    if (selectedMatoran && canRecruit) {
      const recruited = CHARACTER_DEX[selectedMatoran.id];
      const nextFocusedCharacter =
        buyableCharacters.filter((c) => c.id !== selectedMatoran.id)[0] ?? null;
      pendingNextRef.current = nextFocusedCharacter;
      pendingNavigateRef.current = !nextFocusedCharacter;
      recruitCharacter(selectedMatoran);
      setCelebratedCharacter(recruited);
    }
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
      {selectedMatoran && (
        <div className={`requirement-drawer element-${CHARACTER_DEX[selectedMatoran.id].element}`}>
          <h1 className="character-name">
            {selectedMatoran ? CHARACTER_DEX[selectedMatoran.id].name : ''}
          </h1>
          <div className="requirement-list">
            <h4>Requirements</h4>
            <ul>
              <li className={protodermis >= selectedMatoran.cost ? 'has-enough' : 'not-enough'}>
                {protodermis >= selectedMatoran.cost ? '✅' : '❌'} {selectedMatoran.cost}{' '}
                protodermis
              </li>
            </ul>

            <button
              className={`elemental-btn ${
                canRecruit ? '' : 'disabled'
              } element-${CHARACTER_DEX[selectedMatoran.id].element}`}
              onClick={confirmRecruitment}
            >
              Recruit
            </button>
          </div>
        </div>
      )}

      <RecruitmentCelebration matoran={celebratedCharacter} onDismiss={dismissCelebration} />
    </div>
  );
};
