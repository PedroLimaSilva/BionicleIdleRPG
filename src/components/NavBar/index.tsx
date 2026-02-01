import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { UserCircle2, Backpack, Settings, Map, Swords } from 'lucide-react';
import { BattlePhase } from '../../hooks/useBattleState';
import { areBattlesUnlocked } from '../../game/Progress';
import { CurrencyBar } from '../CurrencyBar';

const shouldShowCurrencyBar = (pathname: string) => {
  return ['/recruitment', '/inventory'].includes(pathname);
};

export const NavBar = () => {
  const { battle, completedQuests } = useGame();
  const { pathname } = useLocation();

  return (
    <div
      className={`nav-container ${
        battle.currentEncounter &&
        !(
          battle.phase === BattlePhase.Retreated ||
          battle.phase === BattlePhase.Defeat ||
          battle.phase === BattlePhase.Victory
        )
          ? 'hidden'
          : ''
      }`}
    >
      {shouldShowCurrencyBar(pathname) && <CurrencyBar />}
      <nav className='nav-bar'>
        {areBattlesUnlocked(completedQuests) && (
          <NavLink to='/battle' className='nav-item'>
            <Swords />
            <label>Battle</label>
          </NavLink>
        )}
        <NavLink to='/quests' className='nav-item'>
          <Map />
          <label>Quests</label>
        </NavLink>
        <NavLink to='/characters' className='nav-item'>
          <UserCircle2 />
          <label>Characters</label>
        </NavLink>
        <NavLink to='/inventory' className='nav-item'>
          <Backpack />
          <label>Inventory</label>
        </NavLink>
        <NavLink to='/settings' className='nav-item'>
          <Settings />
          <label>Settings</label>
        </NavLink>
      </nav>
    </div>
  );
};
