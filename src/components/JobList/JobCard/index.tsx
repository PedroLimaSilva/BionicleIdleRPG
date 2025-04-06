import './index.scss';

const enum ProductivityEffect {
  Boosted,
  Penalized,
  Neutral,
}

interface ProductivityBadgeProps {
  modifier: number;
}

const ProductivityBadge: React.FC<ProductivityBadgeProps> = ({ modifier }) => {
  const labels = {
    [ProductivityEffect.Boosted]: `+${Math.round(
      (modifier - 1) * 100
    )}% productivity`,
    [ProductivityEffect.Penalized]: `-${Math.round(
      (1 - modifier) * 100
    )}% productivity`,
    [ProductivityEffect.Neutral]: `No productivity effect`,
  };

  // TODO: conside using getJobStatus

  let effect = ProductivityEffect.Neutral;
  if (modifier > 1) {
    effect = ProductivityEffect.Boosted;
  } else if (modifier < 1) {
    effect = ProductivityEffect.Penalized;
  }

  return (
    <span className={`productivity-badge ${effect}`}>{labels[effect]}</span>
  );
};

interface JobCardProps {
  title: string;
  description: string;
  classNames: string;
  baseRate: number;
  modifier: number;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  classNames,
  description,
  baseRate,
  modifier,
}) => {
  return (
    <div className={`job-card ${classNames}`}>
      <h3 className='job-title'>{title}</h3>
      <ProductivityBadge modifier={modifier} />
      <p className='job-description'>{description}</p>
      <div className='job-rates'>
        Base rate: <span className='code-style'>{baseRate}</span>
        <br />
        Modifier: <span className='code-style'>{modifier}</span>
        <br />
        <strong>Effective rate:</strong>{' '}
        <span className='code-style'>
          {(baseRate * modifier).toFixed(2)} Exp/second
        </span>
      </div>
    </div>
  );
};
