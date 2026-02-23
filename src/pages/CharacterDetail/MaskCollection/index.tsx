import { useMemo } from 'react';
import { useGame } from '../../../context/Game';
import { masksCollected } from '../../../services/matoranUtils';
import { MASK_POWERS } from '../../../data/combat';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../../types/Matoran';
import { CompositedImage } from '../../../components/CompositedImage';

import './index.scss';
import { Tooltip } from '../../../components/Tooltip';

export function MaskCollection({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  const { setMaskOverride, completedQuests } = useGame();

  const masks = useMemo(() => {
    return masksCollected(matoran, completedQuests);
  }, [matoran, completedQuests]);

  const activeMask = matoran.maskOverride || matoran.mask;
  const maskDescription = MASK_POWERS[activeMask]?.description || 'Unknown Mask Power';

  const handeMaskOverride = (matoran: RecruitedCharacterData & BaseMatoran, mask: Mask) => {
    setMaskOverride(matoran.id, matoran.maskColorOverride || matoran.colors.mask, mask);
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
                      <h3>{MASK_POWERS[activeMask]?.longName ?? 'Unknown Mask'}</h3>
                      <p>{maskDescription}</p>
                    </div>
                  }
                >
                  <CompositedImage
                    className="mask-preview"
                    images={[`${import.meta.env.BASE_URL}/avatar/Kanohi/${mask}.webp`]}
                    colors={[matoran.maskColorOverride || matoran.colors.mask]}
                  />
                  <div className="name">{mask}</div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
