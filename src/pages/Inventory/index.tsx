import './index.scss';
import { GameItemId } from '../../data/loot';
import { useGame } from '../../context/Game';

export function InventoryPage() {
  const { inventory } = useGame();

  return (
    <div className="page-container inventory-page">
      {/* <h1 className='title'>INVENTORY</h1> */}
      {Object.entries(inventory).length === 0 && (
        <p>No items. Assign a job to a Matoran to collect items</p>
      )}
      <div className="inventory-grid">
        {Object.entries(inventory).map(([item, quantity]) => {
          const itemId = item as unknown as GameItemId;

          return (
            <div key={item} className="inventory-item">
              <div className="item-name">{itemId}</div>
              <div className="item-qty">x{(quantity ?? 0).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
