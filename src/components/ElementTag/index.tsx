import { ELEMENT_UI_COLORS } from '../../themes/elements';
import { ElementTribe } from '../../types/Matoran';

import './index.scss';

export const ElementTag = ({
  element,
  showName,
}: {
  element: ElementTribe;
  showName: boolean;
}) => {
  const uiColors = ELEMENT_UI_COLORS[element];
  return (
    <div className='element-tag' style={{ background: uiColors.glow }}>
      <img
        src={`${import.meta.env.BASE_URL}/icons/${element}.png`}
        alt='Light Element Icon'
      />
      {showName && <span>{element}</span>}
    </div>
  );
};
