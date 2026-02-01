import { Link, useParams } from 'react-router-dom';
import { useGame } from '../../context/Game';

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
import { QUESTS } from '../../data/quests';
import {
  getRecruitedMatoran,
  isMatoran,
  isToa,
  masksCollected,
} from '../../services/matoranUtils';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { CompositedImage } from '../../components/CompositedImage';
import { MASK_POWERS } from '../../data/combat';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters, completedQuests, setMaskOverride } = useGame();

  const { setScene } = useSceneCanvas();

  const matoran = useMemo(
    () => getRecruitedMatoran(String(id), recruitedCharacters)!,
    [id, recruitedCharacters],
  );

  const masks = useMemo(() => {
    return masksCollected(matoran, completedQuests);
  }, [matoran, completedQuests]);

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
        ? getExpProgress(matoran?.exp || 0)
        : { level: 0, currentLevelExp: 0, expForNextLevel: 1, progress: 0 },
    [matoran],
  );

  const jobDetails = useMemo(
    () => matoran && matoran.assignment && JOB_DETAILS[matoran.assignment.job],
    [matoran],
  );

  // const combatantStats = useMemo(() => {
  //   return COMBATANT_DEX[matoran.id] || null;
  // }, [matoran]);

  const activeMask = matoran.maskOverride || matoran.mask;
  const maskDescription =
    MASK_POWERS[activeMask].description || 'Unknown Mask Power';

  const handeMaskOverride = (
    matoran: RecruitedCharacterData & BaseMatoran,
    mask: Mask,
  ) => {
    setMaskOverride(
      matoran.id,
      matoran.maskColorOverride || matoran.colors.mask,
      mask,
    );
  };

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

          <div id='model-frame'>
            <div className='divider'></div>
          </div>

          <div className='character-progress'>
            <div className='level-display'>
              <span className='label'>Level</span>
              <span className='value'>{getLevelFromExp(matoran.exp || 0)}</span>
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
          <div className='character-detail-section'>
            {/* Job Assignement  */}
            {isMatoran(matoran) && (
              <div>
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
                        matoran as RecruitedCharacterData,
                      )}
                    />
                  </>
                )}

                {!matoran.quest && (
                  <button
                    className='elemental-btn'
                    onClick={() => setAssigningJob(true)}
                  >
                    {matoran.assignment ? 'Change Job' : 'Assign Job'}
                  </button>
                )}

                {assigningJob && (
                  <Modal
                    onClose={() => setAssigningJob(false)}
                    classNames={`element-${matoran.element}`}
                  >
                    <JobList
                      matoran={matoran as RecruitedCharacterData}
                      onAssign={() => {
                        setAssigningJob(false);
                      }}
                      onCancel={() => setAssigningJob(false)}
                    />
                  </Modal>
                )}
              </div>
            )}

            {/* Mask Collection  */}
            {isToa(matoran) && (
              <div>
                {masks.length && (
                  <>
                    <p>Masks Collected:</p>
                    <div className='scroll-row mask-collection'>
                      {masks.map((mask) => (
                        <div
                          key={mask}
                          className={`card element-${matoran.element}`}
                          onClick={() => handeMaskOverride(matoran, mask)}
                        >
                          <CompositedImage
                            className='mask-preview'
                            images={[
                              `${
                                import.meta.env.BASE_URL
                              }/avatar/Kanohi/${mask}.png`,
                            ]}
                            colors={[
                              matoran.maskColorOverride || matoran.colors.mask,
                            ]}
                          />
                          <div className='name'>{mask}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {isToa(matoran) && activeMask && (
              <div>
                <h3>{MASK_POWERS[activeMask].longName}</h3>
                <p>{maskDescription}</p>
              </div>
            )}

            {/* Assigned Quest  */}
            {matoran.quest && (
              <div>
                <p>Assigned Quest:</p>
                <Link to='/quests'>
                  <p>{QUESTS.find((q) => q.id === matoran.quest)!.name}</p>
                </Link>
              </div>
            )}

            {/* combatantStats && (
            <div className='character-detail-section combatant-stats'>
              <h3>Combat Stats</h3>
              <ul>
                <li>
                  <strong>HP:</strong> {combatantStats.baseHp}
                </li>
                <li>
                  <strong>Attack:</strong> {combatantStats.baseAttack}
                </li>
                <li>
                  <strong>Defense:</strong> {combatantStats.baseDefense}
                </li>
                <li>
                  <strong>Speed:</strong> {combatantStats.baseSpeed}
                </li>
              </ul>
            </div>
          )*/}
          </div>
        </div>
      ) : (
        <p>Something is wrong, this matoran does not exist</p>
      )}
    </div>
  );
};
