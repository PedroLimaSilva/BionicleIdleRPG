import { useGame } from '../../context/Game';

import './index.scss';

export const CurrencyBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { widgets, widgetCap } = useGame();

  return (
    <div className={`currency-bar ${isPortrait ? 'portrait' : 'landscape'}`}>
      <div className="currency-progress">
        <div
          className="currency-fill"
          style={
            isPortrait
              ? { width: `${(widgets / widgetCap) * 100}%` }
              : { height: `${(widgets / widgetCap) * 100}%` }
          }
        ></div>
        <div className="currency-label">
          {widgets}/{widgetCap}
        </div>
      </div>
    </div>
  );
};
