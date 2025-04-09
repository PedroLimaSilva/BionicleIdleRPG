import { useGame } from '../../context/Game';

import './index.scss';

export const InventoryBar: React.FC = () => {
  const { widgets } = useGame();

  return (
    <div className='inventory-bar'>
      <p>Widgets: {widgets}</p>
    </div>
  );
};
