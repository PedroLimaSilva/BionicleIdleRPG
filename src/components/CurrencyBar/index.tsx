import { useGame } from '../../context/Game';

import './index.scss';

export const CurrencyBar: React.FC = () => {
  const { widgets, widgetCap } = useGame();

  return (
    <div className='currency-bar'>
      <div className='currency-progress'>
        <div
          className='currency-fill'
          style={{ width: `${(widgets / widgetCap) * 100}%` }}
        ></div>
        <div className='currency-label'>
          {widgets}/{widgetCap}
        </div>
      </div>
    </div>
  );
};
