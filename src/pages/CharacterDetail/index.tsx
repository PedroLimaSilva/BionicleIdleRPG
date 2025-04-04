import { useParams } from 'react-router-dom';
import { useGame } from '../../providers/Game';

import { getMatoranFromInventoryById } from '../../data/matoran';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ELEMENT_UI_COLORS } from '../../themes/elements';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();
  const matoran = getMatoranFromInventoryById(Number(id), recruitedCharacters);
  if (!matoran) {
    return <p>Something is wrong, this matoran does not exist</p>;
  }
  const uiColors = ELEMENT_UI_COLORS[matoran.element];
  return (
    <div className='page-container'>
      {matoran ? (
        <div
          className='character-detail-container'
          style={{
            color: uiColors.glow,
            borderColor: uiColors.glow,
            boxShadow: `0 0 20px ${uiColors.glow}80`,
          }}
        >
          <div className='character-header'>
            <h1
              className='character-name'
              style={{ textShadow: `0 0 6px ${uiColors.glow}` }}
            >
              {matoran.name}
            </h1>
            <div className='element-tag' style={{ background: uiColors.glow }}>
              <img
                src={`${import.meta.env.BASE_URL}/icons/${matoran.element}.png`}
                alt='Light Element Icon'
              />
              <span>{matoran.element}</span>
            </div>
          </div>

          <div className='model-frame'>
            <CharacterScene matoran={matoran}></CharacterScene>
          </div>

          <div
            className='divider'
            style={{
              background: `radial-gradient(circle, ${uiColors.glow} 0%, transparent 70%)`,
            }}
          ></div>

          <div className='character-stats'>
            <div className='stat'>
              <label>STR</label>
              <span>{matoran.strength}</span>
            </div>
            <div className='stat'>
              <label>AGI</label>
              <span>{matoran.agility}</span>
            </div>
            <div className='stat'>
              <label>INT</label>
              <span>{matoran.intelligence}</span>
            </div>
          </div>
        </div>
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
