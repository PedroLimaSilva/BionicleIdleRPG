import React, { useState } from 'react';

import { ElementTribe, Mask, Matoran, Rarity } from '../../types/Matoran';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { LegoColors } from '../../types/Colors';

const mockMatoran: Matoran[] = [
  {
    id: 1,
    name: 'Takua',
    mask: Mask.Pakari,
    element: ElementTribe.Light,
    strength: 8,
    agility: 5,
    intelligence: 6,
    cost: 120,
    rarity: Rarity.Legend,
    colors: {
      mask: LegoColors.MediumBlue,
      body: LegoColors.Red,
      feet: LegoColors.Yellow,
      arms: LegoColors.Red,
      eyes: LegoColors.TransNeonRed,
    },
  },
  {
    id: 2,
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
      eyes: LegoColors.TransNeonRed,
    },
  },
  {
    id: 3,
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
      eyes: LegoColors.TransNeonYellow,
    },
  },
  {
    id: 4,
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
      eyes: LegoColors.TransNeonOrange,
    },
  },
  {
    id: 5,
    name: 'Nuparu',
    mask: Mask.Pakari,
    element: ElementTribe.Earth,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Legend,
    cost: 120,
    colors: {
      mask: LegoColors.Orange,
      body: LegoColors.Black,
      feet: LegoColors.DarkGray,
      arms: LegoColors.Black,
      eyes: LegoColors.TransGreen,
    },
  },
  {
    id: 6,
    name: 'Kongu',
    mask: Mask.Miru,
    element: ElementTribe.Air,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Legend,
    cost: 120,
    colors: {
      mask: LegoColors.DarkTurquoise,
      body: LegoColors.Lime,
      feet: LegoColors.DarkTurquoise,
      arms: LegoColors.Lime,
      eyes: LegoColors.TransNeonGreen,
    },
  },
  {
    id: 6,
    name: 'Matoro',
    mask: Mask.Akaku,
    element: ElementTribe.Ice,
    strength: 5,
    agility: 7,
    intelligence: 8,
    rarity: Rarity.Legend,
    cost: 120,
    colors: {
      mask: LegoColors.SandBlue,
      body: LegoColors.White,
      feet: LegoColors.SandBlue,
      arms: LegoColors.White,
      eyes: LegoColors.TransMediumBlue,
    },
  },
  {
    id: 7,
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
      eyes: LegoColors.TransNeonYellow,
    },
  },
  {
    id: 8,
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
      eyes: LegoColors.TransMediumBlue,
    },
  },
  {
    id: 9,
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
      eyes: LegoColors.TransNeonGreen,
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
      <div id='buffer'></div>

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
