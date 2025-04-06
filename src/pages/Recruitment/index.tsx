import { startTransition, useEffect, useMemo, useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { InventoryBar } from '../../components/InventoryBar';
import { ListedMatoran } from '../../types/Matoran';
import { useGame } from '../../providers/Game';
import { CharacterScene } from '../../components/CharacterScene';
import { ITEM_DICTIONARY } from '../../data/loot';

export const Recruitment: React.FC = () => {
  const { widgets, recruitCharacter, availableCharacters, inventory } =
    useGame();

  const [selectedMatoran, setSelectedMatoran] = useState<ListedMatoran | null>(
    null
  );

  const canRecruit = useMemo(() => {
    const hasRequiredItems = (matoran: ListedMatoran): boolean => {
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
    setSelectedMatoran(availableCharacters[0] || null);
  }, [availableCharacters]);

  const handleRecruit = (matoran: ListedMatoran) => {
    startTransition(() => {
      setSelectedMatoran(matoran);
    });
  };

  const confirmRecruitment = () => {
    if (selectedMatoran && canRecruit) {
      alert(`${selectedMatoran.name} has been recruited!`);
      recruitCharacter(selectedMatoran);
      setSelectedMatoran(availableCharacters[0] || null);
    }
  };

  return (
    <div className='recruitment-screen'>
      <InventoryBar />
      <div className='recruitment-preview'>
        {selectedMatoran && (
          <div key={selectedMatoran.id}>
            <div className='model-display fade-in'>
              <CharacterScene matoran={selectedMatoran} />
            </div>

            <div className='recruitment-overlay'>
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
                } element-${selectedMatoran.element}`}
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
          {availableCharacters.map((matoran) => (
            <div
              key={matoran.id}
              className={`matoran-card element-${matoran.element}`}
              onClick={() => handleRecruit(matoran)}
            >
              <MatoranAvatar
                matoran={matoran}
                styles={'mask-preview matoran-avatar'}
              />
              <div className='name'>{matoran.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
