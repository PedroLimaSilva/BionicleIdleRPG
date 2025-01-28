import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { useGame } from '../../providers/Game';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters } = useGame();
  return (
    <div className='page-container'>
      <h1 className='title'>Characters</h1>
      <div className='matoran-grid'>
        {recruitedCharacters.map((matoran) => (
          <Link key={matoran.id} to={`/character/${matoran.id}`}>
            <div className={`matoran-card ${matoran.rarity}`}>
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
