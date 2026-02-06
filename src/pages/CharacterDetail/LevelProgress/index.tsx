import { useMemo } from 'react';
import { getExpProgress, getLevelFromExp } from '../../../game/Levelling';
import './index.scss';

export const LevelProgress = ({ exp }: { exp: number }) => {
  const lvlProgress = useMemo(() => getExpProgress(exp || 0), [exp]);
  return (
    <div className='character-progress'>
      <div className='level-display'>
        <span className='label'>Level</span>
        <span className='value'>{getLevelFromExp(exp || 0)}</span>
      </div>

      <div className='xp-bar'>
        <div
          className='xp-bar-fill'
          style={{
            width: `${lvlProgress.progress * 100}%`,
          }}
        ></div>
      </div>
      <div className='xp-label'>
        {lvlProgress.currentLevelExp} / {lvlProgress.expForNextLevel} XP (
        {lvlProgress.expForNextLevel - lvlProgress.currentLevelExp} to level up)
      </div>
    </div>
  );
};
