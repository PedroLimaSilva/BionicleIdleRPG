import { useParams } from 'react-router-dom';
import { useGame } from '../../context/Game';

import { getMatoranFromInventoryById } from '../../data/matoran';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ElementTag } from '../../components/ElementTag';
import { getExpProgress, getLevelFromExp } from '../../game/Levelling';
import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../components/Modal';
import { JobList } from '../../components/JobList';
import { JOB_DETAILS } from '../../data/jobs';
import { JobCard } from '../../components/JobList/JobCard';
import { getProductivityModifier } from '../../game/Jobs';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();

  const { setScene } = useSceneCanvas();

  const matoran = getMatoranFromInventoryById(String(id), recruitedCharacters);

  const [assigningJob, setAssigningJob] = useState(false);

  useEffect(() => {
    if (matoran) {
      setScene(<CharacterScene matoran={matoran}></CharacterScene>);
    }
    return () => {
      setScene(null);
    };
  }, [matoran, setScene]);

  const lvlProgress = useMemo(
    () =>
      matoran
        ? getExpProgress(matoran.exp)
        : { level: 0, currentLevelExp: 0, expForNextLevel: 1, progress: 0 },
    [matoran]
  );

  const jobDetails = useMemo(
    () => matoran && matoran.assignment && JOB_DETAILS[matoran.assignment.job],
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

          <div className='model-frame'></div>

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
            {jobDetails && matoran.assignment && (
              <>
                <p>Assigned Job:</p>
                <JobCard
                  classNames={``}
                  title={jobDetails.label}
                  description={jobDetails.description}
                  baseRate={jobDetails.rate}
                  modifier={getProductivityModifier(
                    matoran.assignment.job,
                    matoran
                  )}
                />
              </>
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
        </div>
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
