import { useMemo, useState } from 'react';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import { JOB_DETAILS } from '../../../data/jobs';
import { JobCard } from '../../../components/JobList/JobCard';
import { getProductivityModifier } from '../../../game/Jobs';
import { Modal } from '../../../components/Modal';
import { JobList } from '../../../components/JobList';

export function JobAssignment({
  matoran,
}: {
  matoran: BaseMatoran & RecruitedCharacterData;
}) {
  const [assigningJob, setAssigningJob] = useState(false);

  const jobDetails = useMemo(
    () => matoran && matoran.assignment && JOB_DETAILS[matoran.assignment.job],
    [matoran],
  );

  return (
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
        <button className='elemental-btn' onClick={() => setAssigningJob(true)}>
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
  );
}
