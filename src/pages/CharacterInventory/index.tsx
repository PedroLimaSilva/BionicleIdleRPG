import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { Link } from 'react-router-dom';
import { getLevelFromExp } from '../../game/Levelling';
import { JobStatusBadge } from '../../components/JobStatusBadge';
import { getJobStatus } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { useGame } from '../../context/Game';
import { MATORAN_DEX } from '../../data/matoran';
import { QUESTS } from '../../data/quests';

export const CharacterInventory: React.FC = () => {
  const { recruitedCharacters, buyableCharacters } = useGame();

  return (
    <div className='page-container'>
      {/* <h1 className='title'>Characters</h1> */}
      <div className='character-grid'>
        {recruitedCharacters.map((matoran) => {
          const jobStatus = getJobStatus(matoran);

          const matoran_dex = MATORAN_DEX[matoran.id];

          return (
            <Link key={matoran.id} to={`/characters/${matoran.id}`}>
              <div className={`character-card element-${matoran_dex.element}`}>
                <MatoranAvatar
                  matoran={matoran_dex}
                  styles={'matoran-avatar model-preview'}
                />
                <div className='card-header'>
                  {'  ' + matoran_dex.name}
                  <div className='level-label'>
                    Level {getLevelFromExp(matoran.exp)}
                  </div>
                  <JobStatusBadge
                    label={
                      matoran.assignment?.job
                        ? JOB_DETAILS[matoran.assignment?.job].label
                        : QUESTS.find((q) => q.id === matoran.quest)?.name ||
                          jobStatus
                    }
                    status={jobStatus}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {buyableCharacters.length !== 0 && (
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
