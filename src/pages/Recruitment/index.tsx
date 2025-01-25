import React, { useState } from 'react';

import './index.scss';

const enum Rarity {
  Common = 'common',
  Rare = 'rare',
  Legend = 'legend',
}

const enum Mask {
  Hau = 'Hau',
  Huna = 'Huna',
}

type Matoran = {
  id: number;
  name: string;
  mask: Mask;
  element: string;
  strength: number;
  agility: number;
  intelligence: number;
  cost: number;
  rarity: Rarity;
  avatar: string;
};

const mockMatoran: Matoran[] = [
  {
    id: 1,
    name: 'Jala',
    mask: Mask.Hau,
    element: 'Fire',
    strength: 8,
    agility: 5,
    intelligence: 6,
    cost: 100,
    rarity: Rarity.Legend,
    avatar: './matoran/jala.png',
  },
  {
    id: 2,
    name: 'Maku',
    mask: Mask.Huna,
    element: 'Water',
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Rare,
    cost: 120,
    avatar: './matoran/maku.png',
  },
];

export const Recruitment: React.FC = () => {
  const [selectedMatoran, setSelectedMatoran] = useState<Matoran | null>(null);

  const handleRecruit = (matoran: Matoran) => {
    setSelectedMatoran(matoran);
  };

  const confirmRecruitment = () => {
    if (selectedMatoran) {
      alert(`${selectedMatoran.name} has been recruited!`);
      setSelectedMatoran(null);
    }
  };

  const cancelRecruitment = () => {
    setSelectedMatoran(null);
  };

  return (
    <div className='character-recruitment-container'>
      <h1 className='title'>Recruit a Matoran</h1>
      <div className='matoran-grid'>
        {mockMatoran.map((matoran) => (
          <div
            key={matoran.id}
            className={`matoran-card ${matoran.rarity}`}
            onClick={() => handleRecruit(matoran)}
          >
            <img
              src={matoran.avatar}
              alt={matoran.name}
              className='matoran-avatar'
            />
            <h2 className='matoran-name'>{matoran.name}</h2>
          </div>
        ))}
      </div>

      {selectedMatoran && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2 className='modal-title'>Confirm Recruitment</h2>
            <img
              src={selectedMatoran.avatar}
              alt={selectedMatoran.name}
              className='modal-avatar'
            />
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
