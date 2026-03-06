import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './index.scss';
import { ListedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { CHARACTER_DEX } from '../../data/dex/index';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Recruitment: React.FC = () => {
  const { protodermis, recruitCharacter, buyableCharacters } = useGame();
  const { setScene } = useSceneCanvas();

  const navigate = useNavigate();

  const [selectedMatoran, setSelectedMatoran] = useState<ListedCharacterData | null>(null);

  const canRecruit = useMemo(() => {
    return selectedMatoran && protodermis >= selectedMatoran.cost;
  }, [selectedMatoran, protodermis]);

  useEffect(() => {
    setSelectedMatoran(buyableCharacters[0] || null);
  }, [buyableCharacters]);

  useEffect(() => {
    if (selectedMatoran) {
      setScene(<CharacterScene matoran={{ ...CHARACTER_DEX[selectedMatoran.id], exp: 0 }} />);
    }
    return () => {
      setScene(null);
    };
  }, [selectedMatoran, setScene]);

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
      alert(`${CHARACTER_DEX[selectedMatoran.id].name} has been recruited!`);
      recruitCharacter(selectedMatoran);
      const nextFocusedCharacter = buyableCharacters[0] || null;
      if (!nextFocusedCharacter || buyableCharacters.length === 1) {
        navigate('/characters');
      }
      setSelectedMatoran(nextFocusedCharacter);
    }
  };

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
    </div>
  );
};
