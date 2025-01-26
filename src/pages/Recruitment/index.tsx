import React, { useState } from 'react';

import { ElementTribe, Mask, Matoran, Rarity } from '../../types/Matoran';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { LegoColors } from '../../types/Colors';

const mockMatoran: Matoran[] = [
  {
    id: 1,
    name: 'Jala',
    mask: Mask.Hau,
    element: ElementTribe.Fire,
    strength: 8,
    agility: 5,
    intelligence: 6,
    cost: 120,
    rarity: Rarity.Legend,
    colors: {
      mask: LegoColors.Yellow,
      body: LegoColors.Red,
      feet: LegoColors.Yellow,
      arms: LegoColors.Red,
      eyes: '#',
    },
  },
  {
    id: 2,
    name: 'Hali',
    mask: Mask.Kaukau,
    element: ElementTribe.Water,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Legend,
    cost: 120,
    colors: {
      mask: LegoColors.Blue,
      body: LegoColors.MediumBlue,
      feet: LegoColors.Blue,
      arms: LegoColors.MediumBlue,
      eyes: '#',
    },
  },
  {
    id: 3,
    name: 'Huki',
    mask: Mask.Kakama,
    element: ElementTribe.Stone,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Legend,
    cost: 120,
    colors: {
      mask: LegoColors.DarkOrange,
      body: LegoColors.Tan,
      feet: LegoColors.DarkOrange,
      arms: LegoColors.Tan,
      eyes: '#',
    },
  },
  {
    id: 4,
    name: 'Maku',
    mask: Mask.Huna,
    element: ElementTribe.Water,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Rare,
    cost: 100,
    colors: {
      mask: LegoColors.Blue,
      body: LegoColors.MediumBlue,
      feet: LegoColors.Blue,
      arms: LegoColors.MediumBlue,
      eyes: '#',
    },
  },
  {
    id: 5,
    name: 'Lumi',
    mask: Mask.Hau,
    element: ElementTribe.Water,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Rare,
    cost: 100,
    colors: {
      mask: LegoColors.LightGray,
      body: LegoColors.White,
      feet: LegoColors.LightGray,
      arms: LegoColors.White,
      eyes: '#',
    },
  },
  {
    id: 6,
    name: 'Le Matoran',
    mask: Mask.Kaukau,
    element: ElementTribe.Water,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Common,
    cost: 50,
    colors: {
      mask: LegoColors.DarkTurquoise,
      body: LegoColors.Lime,
      feet: LegoColors.DarkTurquoise,
      arms: LegoColors.Lime,
      eyes: '#',
    },
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
