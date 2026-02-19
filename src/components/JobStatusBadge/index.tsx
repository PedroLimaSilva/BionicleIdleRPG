import { ProductivityEffect } from '../../types/Jobs';
import { Tooltip } from '../Tooltip';
import './index.scss';

interface JobStatusBadgeProps {
  label?: string;
  status: ProductivityEffect;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ label, status }) => {
  return (
    <Tooltip content={label || 'Idle'}>
      <span className={`job-status-badge ${status}`}>{label || 'Idle'}</span>
    </Tooltip>
  );
};
