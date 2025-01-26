import React, { useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Matoran } from '../../types/Matoran';
import { RECRUITABLE_MATORAN } from '../../data/matoran';
import { useNavigate } from 'react-router-dom';

export const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMatoran, setSelectedMatoran] = useState<Matoran | null>(null);

  const handleRecruit = (matoran: Matoran) => {
    setSelectedMatoran(matoran);
  };

  const confirmRecruitment = () => {
    if (selectedMatoran) {
      alert(`${selectedMatoran.name} has been recruited!`);
      setSelectedMatoran(null);
      navigate('/characters');
    }
  };

  const cancelRecruitment = () => {
    setSelectedMatoran(null);
  };

  return (
    <div className='page-container'>
      <h1 className='title'>Recruit a Matoran</h1>
      <div className='matoran-grid'>
        {RECRUITABLE_MATORAN.map((matoran) => (
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
            <p className='modal-detail'>Strength: {selectedMatoran.strength}</p>
            <p className='modal-detail'>Agility: {selectedMatoran.agility}</p>
            <p className='modal-detail'>
              Intelligence: {selectedMatoran.intelligence}
            </p>
            <p className='modal-cost'>Cost: {selectedMatoran.cost} Widgets</p>
            <div className='modal-actions'>
              <button className='cancel-button' onClick={cancelRecruitment}>
                Cancel
              </button>
              <button className='confirm-button' onClick={confirmRecruitment}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
