import { useMemo } from 'react';
import { useGame } from '../../../context/Game';
import { masksCollected } from '../../../services/matoranUtils';
import { getEffectiveMaskColor } from '../../../game/maskColor';
import { MASK_POWERS } from '../../../data/combat';
import { BaseMatoran, Mask } from '../../../types/Matoran';
import { CompositedImage } from '../../../components/CompositedImage';

import './index.scss';
import { Tooltip } from '../../../components/Tooltip';
import { LegoColor } from '../../../types/Colors';

export function MaskCollection({
  matoran,
}: {
  matoran: BaseMatoran & { maskColorOverride?: string; maskOverride?: string };
}) {
  const { setMaskOverride, completedQuests } = useGame();

  const masks = useMemo(() => {
    return masksCollected(matoran, completedQuests);
  }, [matoran, completedQuests]);

  const effectiveMaskColor = getEffectiveMaskColor(matoran, completedQuests);

  const handeMaskOverride = (
    matoran: BaseMatoran & { maskColorOverride?: string; maskOverride?: string },
    mask: Mask
  ) => {
    setMaskOverride(matoran.id, getEffectiveMaskColor(matoran, completedQuests) as LegoColor, mask);
  };

  return (
    <>
      {masks.length > 0 && (
        <div className="mask-inventory-section">
          <h3 className="mask-inventory-section__title">Masks</h3>
          <div className={`mask-inventory-grid element-${matoran.element}`}>
            {masks.map((mask) => (
              <div
                key={mask}
                className={`mask-card`}
                onClick={() => handeMaskOverride(matoran, mask)}
              >
                <Tooltip
                  content={
                    <div>
                      <h3>{MASK_POWERS[mask]?.longName ?? 'Unknown Mask'}</h3>
                      <p>{MASK_POWERS[mask]?.description || 'Unknown Mask Power'}</p>
                    </div>
                  }
                >
                  <CompositedImage
                    className="mask-preview"
                    images={[`${import.meta.env.BASE_URL}/avatar/Kanohi/${mask}.webp`]}
                    colors={[effectiveMaskColor]}
                  />
                  <div className="name">
                    {(MASK_POWERS[mask]?.shortName ?? mask).replace(/_/g, ' ')}
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
