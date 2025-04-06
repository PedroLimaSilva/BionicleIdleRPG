import { ProductivityEffect } from '../../types/Jobs';
import './index.scss';


interface JobStatusBadgeProps {
  label?: string;
  status: ProductivityEffect;
}

export const JobStatusBadge: React.FC<JobStatusBadgeProps> = ({ label, status }) => {
  return (
    <span className={`job-status-badge ${status}`} title={label || 'Idle'}>
      {label || 'Idle'}
    </span>
  );
};
