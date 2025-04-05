import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { useGame } from '../../providers/Game';
import { ElementTag } from '../../components/ElementTag';
import { getLevelFromExp } from '../../game/Levelling';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters } = useGame();
  return (
    <div className='page-container'>
      <h1 className='title'>Characters</h1>
      <div className='character-grid'>
        {recruitedCharacters.map((matoran) => (
          <Link key={matoran.id} to={`/character/${matoran.id}`}>
            <div className={`character-card element-${matoran.element}`}>
              <MatoranAvatar
                matoran={matoran}
                styles={'matoran-avatar model-preview'}
              />
              <div className='card-header'>
                <ElementTag element={matoran.element} showName={false} />
                {'  ' + matoran.name}
                <div className='level-label'>
                  Level {getLevelFromExp(matoran.exp)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className='recruit-button'>
        <Link to='/recruitment'>
          <button type='button' className='recruitment-button'>
            Recruit More
          </button>
        </Link>
      </div>
    </div>
  );
};
