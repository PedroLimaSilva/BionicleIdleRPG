import './index.scss';
import { useMemo, useState } from 'react';
import { MatoranJob } from '../../types/Jobs';
import { useGame } from '../../context/Game';
import { getAvailableJobs, getProductivityModifier } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';
import { JobCard } from './JobCard';
import { RecruitedCharacterData } from '../../types/Matoran';

type JobListProps = {
  matoran: RecruitedCharacterData;
  onAssign: (updated: RecruitedCharacterData) => void;
  onCancel: () => void;
};

export function JobList({ matoran, onCancel }: JobListProps) {
  const [selectedJob, setSelectedJob] = useState<MatoranJob | null>(null);
  const game = useGame();

  const jobs = useMemo(() => {
    return getAvailableJobs(game);
  }, [game]);

  const handleAssign = () => {
    if (!selectedJob) return;
    game.assignJobToMatoran(matoran.id, selectedJob);
    onCancel();
  };

  const handleRemoveJob = () => {
    game.removeJobFromMatoran(matoran.id);
    onCancel();
  };

  return (
    <div className='assign-job-container'>
      <h2 className='assign-job-title'>Select a Job</h2>

      <div className='job-grid'>
        {jobs.map((job) => {
          const { label, description, rate } = JOB_DETAILS[job];
          const modifier = getProductivityModifier(job, matoran);
          return (
            <div
              key={job}
              onClick={() => setSelectedJob(job)}
              title={description}
            >
              <JobCard
                classNames={`${selectedJob === job ? 'selected' : ''} ${
                  matoran.assignment?.job === job ? 'assigned' : ''
                }`}
                title={label}
                description={description}
                baseRate={rate}
                modifier={modifier}
              />
            </div>
          );
        })}
      </div>

      <div className='job-actions'>
        <div className='action-row'>
          <button onClick={onCancel} className='cancel-button'>
            Cancel
          </button>
          <button
            onClick={handleAssign}
            className='assign-button'
            disabled={!selectedJob}
          >
            Assign
          </button>
        </div>
        {matoran.assignment && (
          <button onClick={handleRemoveJob} className='remove-button'>
            Remove Job
          </button>
        )}
      </div>
    </div>
  );
}
