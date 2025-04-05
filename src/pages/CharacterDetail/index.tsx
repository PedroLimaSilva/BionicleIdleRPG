import { useParams } from 'react-router-dom';
import { useGame } from '../../providers/Game';

import { getMatoranFromInventoryById } from '../../data/matoran';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ElementTag } from '../../components/ElementTag';
import { getExpProgress, getLevelFromExp } from '../../game/Levelling';
import { useMemo, useState } from 'react';
import { Modal } from '../../components/Modal';
import { JobList } from '../../components/JobList';
import { JOB_DETAILS } from '../../data/jobs';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();
  const matoran = getMatoranFromInventoryById(Number(id), recruitedCharacters);

  const [assigningJob, setAssigningJob] = useState(false);

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
  return (
    <div className='page-container'>
      {matoran ? (
        <div
          className={`character-detail-container element-${matoran.element}`}
        >
          <div className='character-header'>
            <h1 className='character-name'>{matoran.name}</h1>
            <ElementTag element={matoran.element} showName={true} />
          </div>

          <div className='model-frame'>
            <CharacterScene matoran={matoran}></CharacterScene>
          </div>

          <div className='divider'></div>

          <div className='character-progress'>
            <div className='level-display'>
              <span className='label'>Level</span>
              <span className='value'>{getLevelFromExp(matoran.exp)}</span>
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
              {lvlProgress.expForNextLevel - lvlProgress.currentLevelExp} to
              level up)
            </div>
          </div>
          <div className='job-section'>
            {matoran.assignment && (
              <p>
                Assigned Job:{' '}
                <strong>{JOB_DETAILS[matoran.assignment.job].label}</strong>
              </p>
            )}

            <button
              className='elemental-btn'
              onClick={() => setAssigningJob(true)}
            >
              {matoran.assignment ? 'Change Job' : 'Assign Job'}
            </button>

            {assigningJob && (
              <Modal
                onClose={() => setAssigningJob(false)}
                classNames={`element-${matoran.element}`}
              >
                <JobList
                  matoran={matoran}
                  onAssign={() => {
                    setAssigningJob(false);
                  }}
                  onCancel={() => setAssigningJob(false)}
                />
              </Modal>
            )}
          </div>

          <div className='perk-section'>
            <h3>Perks</h3>
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
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
