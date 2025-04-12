import { startTransition, useEffect, useMemo, useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { InventoryBar } from '../../components/InventoryBar';
import { ListedCharacterData } from '../../types/Matoran';
import { useGame } from '../../context/Game';
import { ITEM_DICTIONARY } from '../../data/loot';
import { CharacterScene } from '../../components/CharacterScene';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { useNavigate } from 'react-router-dom';
import { MATORAN_DEX } from '../../data/matoran';

export const Recruitment: React.FC = () => {
  const { widgets, recruitCharacter, buyableCharacters, inventory } = useGame();
  const { setScene } = useSceneCanvas();

  const navigate = useNavigate();

  const [selectedMatoran, setSelectedMatoran] =
    useState<ListedCharacterData | null>(null);

  const canRecruit = useMemo(() => {
    const hasRequiredItems = (matoran: ListedCharacterData): boolean => {
      return (matoran.requiredItems || []).every(({ item, quantity }) => {
        return (inventory[item] || 0) >= quantity;
      });
    };

    return (
      selectedMatoran &&
      widgets >= selectedMatoran.cost &&
      hasRequiredItems(selectedMatoran)
    );
  }, [selectedMatoran, widgets, inventory]);

  useEffect(() => {
    setSelectedMatoran(buyableCharacters[0] || null);
  }, [buyableCharacters]);

  useEffect(() => {
    if (selectedMatoran) {
      setScene(<CharacterScene matoran={MATORAN_DEX[selectedMatoran.id]} />);
    }
    return () => {
      setScene(null);
    };
  }, [selectedMatoran, setScene]);

  const handleRecruit = (matoran: ListedCharacterData) => {
    startTransition(() => {
      setSelectedMatoran(matoran);
    });
  };

  const confirmRecruitment = () => {
    if (selectedMatoran && canRecruit) {
      alert(`${MATORAN_DEX[selectedMatoran.id].name} has been recruited!`);
      recruitCharacter(selectedMatoran);
      const nextFocusedCharacter = buyableCharacters[0] || null;
      if (!nextFocusedCharacter || buyableCharacters.length === 1) {
        navigate('/characters');
      }
      setSelectedMatoran(nextFocusedCharacter);
    }
  };

  return (
    <div className='recruitment-screen'>
      <InventoryBar />
      <div className='recruitment-preview'>
        {selectedMatoran && (
          <div>
            <div key={selectedMatoran.id} className='recruitment-overlay'>
              <div className='requirement-list'>
                <h4>Required to Recruit:</h4>
                <ul>
                  <li
                    className={
                      widgets >= selectedMatoran.cost
                        ? 'has-enough'
                        : 'not-enough'
                    }
                  >
                    {widgets >= selectedMatoran.cost ? '✅' : '❌'}{' '}
                    {selectedMatoran.cost} widgets
                  </li>
                  {selectedMatoran.requiredItems?.map(({ item, quantity }) => {
                    const owned = inventory[item] || 0;
                    const hasEnough = owned >= quantity;
                    return (
                      <li
                        key={`${selectedMatoran.id}-${item}`}
                        className={hasEnough ? 'has-enough' : 'not-enough'}
                      >
                        {hasEnough ? '✅' : '❌'} {ITEM_DICTIONARY[item].name} (
                        {owned} / {quantity})
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                className={`elemental-btn recruit-btn ${
                  canRecruit ? '' : 'disabled'
                } element-${MATORAN_DEX[selectedMatoran.id].element}`}
                onClick={confirmRecruitment}
              >
                Recruit
              </button>
            </div>
          </div>
        )}
      </div>

      <div className='matoran-selector'>
        <div className='scroll-row'>
          {buyableCharacters.map((matoran) => (
            <div
              key={matoran.id}
              className={`matoran-card element-${
                MATORAN_DEX[matoran.id].element
              }`}
              onClick={() => handleRecruit(matoran)}
            >
              <MatoranAvatar
                matoran={MATORAN_DEX[matoran.id]}
                styles={'mask-preview matoran-avatar'}
              />
              <div className='name'>{MATORAN_DEX[matoran.id].name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
