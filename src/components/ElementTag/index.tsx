import { ElementTribe } from '../../types/Matoran';

import './index.scss';

export const ElementTag = ({
  element,
  showName,
}: {
  element: ElementTribe;
  showName: boolean;
}) => {
  return (
    <div className='element-tag'>
      <img
        src={`${import.meta.env.BASE_URL}/icons/${element}.png`}
        alt='Light Element Icon'
      />
      {showName && <span>{element}</span>}
    </div>
  );
};
