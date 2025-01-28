import { useParams } from 'react-router-dom';
import { useGame } from '../../providers/Game';
import { MatoranAvatar } from '../../components/MatoranAvatar';

import { getMatoranFromInventoryById } from '../../data/matoran';

import './index.scss';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();
  const matoran = getMatoranFromInventoryById(Number(id), recruitedCharacters);
  if (!matoran) {
    return <p>Something is wrong, this matoran does not exist</p>;
  }
  return (
    <div className='page-container'>
      {matoran ? (
        <>
          <h1 className='title'>{matoran.name}</h1>

          <MatoranAvatar matoran={matoran} styles='detail-avatar' />
          <p className='detail-data'>Mask: {matoran.mask}</p>
          <p className='detail-data'>Element: {matoran.element}</p>
          <p className='detail-data'>Strength: {matoran.strength}</p>
          <p className='detail-data'>Agility: {matoran.agility}</p>
          <p className='detail-data'>Intelligence: {matoran.intelligence}</p>
        </>
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
