import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { ElementTag } from '../../components/ElementTag';
import { getLevelFromExp } from '../../game/Levelling';
import { JobStatusBadge } from '../../components/JobStatusBadge';
import { getJobStatus } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { useGame } from '../../context/Game';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, availableCharacters } = useGame();

  return (
    <div className='page-container'>
      {/* <h1 className='title'>Characters</h1> */}
      <div className='character-grid'>
        {recruitedCharacters.map((matoran) => {
          const jobStatus = getJobStatus(matoran);
          return (
            <Link key={matoran.id} to={`/characters/${matoran.id}`}>
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
                  <JobStatusBadge
                    label={
                      matoran.assignment?.job
                        ? JOB_DETAILS[matoran.assignment?.job].label
                        : jobStatus
                    }
                    status={jobStatus}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {availableCharacters.length !== 0 && (
        <div className='recruit-button'>
          <Link to='/recruitment'>
            <button type='button' className='recruitment-button'>
              Recruit More
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};
