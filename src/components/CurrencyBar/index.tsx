import { useGame } from '../../context/Game';

import './index.scss';

export const CurrencyBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { protodermis, protodermisCap } = useGame();

  return (
    <div
      className={`currency-bar currency-bar--protodermis ${isPortrait ? 'portrait' : 'landscape'}`}
    >
      <div className="currency-progress">
        <div
          className="currency-fill"
          style={
            isPortrait
              ? { width: `${(protodermis / protodermisCap) * 100}%` }
              : { height: `${(protodermis / protodermisCap) * 100}%` }
          }
        ></div>
        <div className="currency-label">
          {protodermis}/{protodermisCap}
        </div>
      </div>
    </div>
  );
};
