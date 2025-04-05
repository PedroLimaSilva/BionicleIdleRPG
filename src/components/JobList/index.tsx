import './index.scss';
import { useMemo, useState } from 'react';
import { MatoranJob } from '../../types/Jobs';
import { RecruitedMatoran } from '../../types/Matoran';
import { useGame } from '../../providers/Game';
import { getAvailableJobs, getProductivityModifier } from '../../game/Jobs';
import { JOB_DETAILS } from '../../data/jobs';

type JobListProps = {
  matoran: RecruitedMatoran;
  onAssign: (updated: RecruitedMatoran) => void;
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
          return (
            <button
              key={job}
              className={`job-button ${selectedJob === job ? 'selected' : ''} ${
                matoran.assignment?.job === job ? 'assigned' : ''
              }`}
              onClick={() => setSelectedJob(job)}
              title={description}
            >
              <div className='job-label'>{label}</div>
              <div className='job-description'>{description}</div>
              <div className='job-rate'>
                ⚡ {(rate * getProductivityModifier(job, matoran)).toFixed(1)}{' '}
                EXP/sec
              </div>
            </button>
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
