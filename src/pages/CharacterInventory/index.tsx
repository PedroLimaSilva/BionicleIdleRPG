import React from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { MATORAN_INVENTORY } from '../../data/matoran';

export const CharacterInventory: React.FC = () => {
  return (
    <div className='page-container'>
      <h1 className='title'>Characters</h1>
      <div className='matoran-grid'>
        {MATORAN_INVENTORY.map((matoran) => (
          <Link to={`/character/${matoran.id}`}>
            <div key={matoran.id} className={`matoran-card ${matoran.rarity}`}>
              <MatoranAvatar matoran={matoran} styles={'matoran-avatar'} />
              <h2 className='matoran-name'>{matoran.name}</h2>
            </div>
          </Link>
        ))}
      </div>
      <div className='recruitment'>
        <Link to='/recruitment'>
          <button type='button' className='recruitment-button'>
            Recruit More
          </button>
        </Link>
      </div>
    </div>
  );
};
