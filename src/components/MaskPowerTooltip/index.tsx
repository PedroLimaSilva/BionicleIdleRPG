import { Mask } from '../../types/Matoran';
import { MASK_POWERS, MASK_DISPLAY_ONLY } from '../../data/combat';
import { Tooltip } from '../Tooltip';

import './index.scss';

interface MaskPowerTooltipProps {
  mask: Mask | string | undefined;
  children: React.ReactNode;
}

export function MaskPowerTooltip({ mask, children }: MaskPowerTooltipProps) {
  const maskPower = mask ? MASK_POWERS[mask as Mask] : undefined;
  const displayOnly = mask ? MASK_DISPLAY_ONLY[mask as Mask] : undefined;
  const description = maskPower?.description ?? displayOnly?.description;
  const longName = maskPower?.longName ?? displayOnly?.longName;

  if (!description) {
    return <>{children}</>;
  }

  return (
    <Tooltip
      content={
        <>
          <span className="mask-power-tooltip__title">{longName ?? mask}</span>
          <span className="mask-power-tooltip__description">{description}</span>
        </>
      }
    >
      {children}
    </Tooltip>
  );
}
