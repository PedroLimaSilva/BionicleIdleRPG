import { useMemo, useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { InventoryBar } from '../../components/InventoryBar';
import { Matoran } from '../../types/Matoran';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../providers/Game';

export const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const {
    widgets,
    recruitCharacter,
    availableCharacters,
    recruitedCharacters,
  } = useGame();
  const [selectedMatoran, setSelectedMatoran] = useState<Matoran | null>(null);
  const canRecruit = useMemo(
    () => selectedMatoran && widgets >= selectedMatoran.cost,
    [selectedMatoran, widgets]
  );

  const handleRecruit = (matoran: Matoran) => {
    console.log({ canRecruit, matoran, widgets });
    setSelectedMatoran(matoran);
  };

  const confirmRecruitment = () => {
    console.log('confirmRecruitment', selectedMatoran, widgets);
    if (selectedMatoran && canRecruit) {
      alert(`${selectedMatoran.name} has been recruited!`);
      recruitCharacter(selectedMatoran, selectedMatoran.cost);
      setSelectedMatoran(null);
      navigate('/characters');
    }
  };

  const cancelRecruitment = () => {
    setSelectedMatoran(null);
  };

  return (
    <>
      <InventoryBar />
      <div className='page-container'>
        <h1 className='title'>Recruit a Matoran</h1>
        <div className='matoran-grid'>
          {availableCharacters
            .filter((m) => !recruitedCharacters.find((c) => c.id === m.id))
            .map((matoran) => (
              <div
                key={matoran.id}
                className={`matoran-card ${matoran.rarity}`}
                onClick={() => handleRecruit(matoran)}
              >
                <MatoranAvatar matoran={matoran} styles={'matoran-avatar'} />
                <h2 className='matoran-name'>{matoran.name}</h2>
              </div>
            ))}
        </div>

        {selectedMatoran && (
          <div className='modal-overlay'>
            <div className='modal'>
              <h2 className='modal-title'>Confirm Recruitment</h2>
              <MatoranAvatar matoran={selectedMatoran} styles='modal-avatar' />
              <p className='modal-detail'>Name: {selectedMatoran.name}</p>
              <p className='modal-detail'>Mask: {selectedMatoran.mask}</p>
              <p className='modal-detail'>Element: {selectedMatoran.element}</p>
              <p className='modal-detail'>
                Strength: {selectedMatoran.strength}
              </p>
              <p className='modal-detail'>Agility: {selectedMatoran.agility}</p>
              <p className='modal-detail'>
                Intelligence: {selectedMatoran.intelligence}
              </p>
              <p className='modal-cost'>Cost: {selectedMatoran.cost} Widgets</p>
              <div className='modal-actions'>
                <button className='cancel-button' onClick={cancelRecruitment}>
                  Cancel
                </button>
                <button
                  className={`confirm-button ${canRecruit ? '' : 'disabled'}`}
                  onClick={confirmRecruitment}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
