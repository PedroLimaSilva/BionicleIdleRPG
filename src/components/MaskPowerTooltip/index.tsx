import { Mask } from '../../types/Matoran';
import { MASK_POWERS } from '../../data/combat';

import './index.scss';

interface MaskPowerTooltipProps {
  mask: Mask | string | undefined;
  children: React.ReactNode;
}

export function MaskPowerTooltip({ mask, children }: MaskPowerTooltipProps) {
  const maskPower = mask ? MASK_POWERS[mask as Mask] : undefined;
  const description = maskPower?.description;
  const longName = maskPower?.longName;

  if (!description) {
    return <>{children}</>;
  }

  return (
    <div className="mask-power-tooltip">
      {children}
      <div className="mask-power-tooltip__content" role="tooltip">
        <span className="mask-power-tooltip__title">{longName ?? mask}</span>
        <span className="mask-power-tooltip__description">{description}</span>
      </div>
    </div>
  );
}
