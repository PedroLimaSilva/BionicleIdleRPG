import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { UserCircle2, Settings, Map, Swords } from 'lucide-react';
import { BattlePhase } from '../../hooks/useBattleState';
import { CurrencyBar } from '../CurrencyBar';
import { AnimatePresence } from 'motion/react';

const shouldShowCurrencyBar = (pathname: string) => {
  return !['/settings'].includes(pathname);
};

export const NavBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { battle } = useGame();
  const { pathname } = useLocation();

  return (
    <div
      className={`nav-container ${isPortrait ? 'portrait' : 'landscape'} ${
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
      <AnimatePresence initial={false}>
        {shouldShowCurrencyBar(pathname) && <CurrencyBar isPortrait={isPortrait} />}
      </AnimatePresence>
      <nav className="nav-bar">
        <NavLink to="/battle/selector" className="nav-item">
          <Swords />
          <label>Battle</label>
        </NavLink>
        <NavLink to="/" className="nav-item">
          <Map />
          <label>Quests</label>
        </NavLink>
        <NavLink to="/characters" className="nav-item">
          <UserCircle2 />
          <label>Characters</label>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <Settings />
          <label>Settings</label>
        </NavLink>
      </nav>
    </div>
  );
};
