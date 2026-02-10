import { useMemo } from 'react';
import { useGame } from '../../../context/Game';
import { masksCollected } from '../../../services/matoranUtils';
import { MASK_POWERS } from '../../../data/combat';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../../types/Matoran';
import { CompositedImage } from '../../../components/CompositedImage';

export function MaskCollection({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  const { setMaskOverride, completedQuests } = useGame();

  const masks = useMemo(() => {
    return masksCollected(matoran, completedQuests);
  }, [matoran, completedQuests]);

  const activeMask = matoran.maskOverride || matoran.mask;
  const maskDescription = MASK_POWERS[activeMask].description || 'Unknown Mask Power';

  const handeMaskOverride = (matoran: RecruitedCharacterData & BaseMatoran, mask: Mask) => {
    setMaskOverride(matoran.id, matoran.maskColorOverride || matoran.colors.mask, mask);
  };

  return (
    <>
      {masks.length && (
        <div>
          <p>Masks Collected:</p>
          <div className="scroll-row mask-collection">
            {masks.map((mask) => (
              <div
                key={mask}
                className={`card element-${matoran.element}`}
                onClick={() => handeMaskOverride(matoran, mask)}
              >
                <CompositedImage
                  className="mask-preview"
                  images={[`${import.meta.env.BASE_URL}/avatar/Kanohi/${mask}.png`]}
                  colors={[matoran.maskColorOverride || matoran.colors.mask]}
                />
                <div className="name">{mask}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeMask && (
        <div>
          <h3>{MASK_POWERS[activeMask].longName}</h3>
          <p>{maskDescription}</p>
        </div>
      )}
    </>
  );
}
