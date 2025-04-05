import { useParams } from 'react-router-dom';
import { useGame } from '../../providers/Game';

import { getMatoranFromInventoryById } from '../../data/matoran';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ELEMENT_UI_COLORS } from '../../themes/elements';
import { ElementTag } from '../../components/ElementTag';
import { getExpProgress, getLevelFromExp } from '../../game/Levelling';
import { useMemo } from 'react';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();
  const matoran = getMatoranFromInventoryById(Number(id), recruitedCharacters);

  const lvlProgress = useMemo(
    () =>
      matoran
        ? getExpProgress(matoran.exp)
        : { level: 0, currentLevelExp: 0, expForNextLevel: 1, progress: 0 },
    [matoran]
  );

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
            <ElementTag element={matoran.element} showName={true} />
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

          {/* <div className='character-stats'>
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
          </div> */}

          <div className='character-progress'>
            <div className='level-display'>
              <span className='label'>Level</span>
              <span className='value' style={{ color: uiColors.glow }}>
                {getLevelFromExp(matoran.exp)}
              </span>
            </div>

            <div className='xp-bar'>
              <div
                className='xp-bar-fill'
                style={{
                  width: `${lvlProgress.progress}%`,
                  background: `linear-gradient(90deg, ${uiColors.glow}, ${uiColors.accent})`,
                }}
              ></div>
            </div>
            <div className='xp-label'>
              {lvlProgress.currentLevelExp} /{' '}
              {lvlProgress.currentLevelExp + lvlProgress.expForNextLevel} XP (
              {lvlProgress.expForNextLevel} to level up)
            </div>

            <div className='perk-section'>
              <h3 style={{ color: uiColors.glow }}>Perks</h3>
              <ul className='perk-list'>
                <li>
                  <span>🛡️</span> Mask Mastery: +10% Mask power efficiency
                </li>
                <li>
                  <span>⚡</span> Quickstep: +15% movement speed
                </li>
                <li>
                  <span>🌟</span> Unity Bonus: Increased XP from missions
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
