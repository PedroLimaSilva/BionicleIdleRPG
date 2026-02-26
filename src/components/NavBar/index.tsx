import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { UserCircle2, Backpack, Settings, Map, Swords } from 'lucide-react';
import { BattlePhase } from '../../hooks/useBattleState';
import { areBattlesUnlocked } from '../../game/Progress';
import { getVisibleEncounters } from '../../game/encounterVisibility';
import { ENCOUNTERS } from '../../data/combat';
import { CurrencyBar } from '../CurrencyBar';

const shouldShowCurrencyBar = (pathname: string) => {
  return ['/recruitment', '/inventory'].includes(pathname);
};

export const NavBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { battle, completedQuests, collectedKrana } = useGame();
  const { pathname } = useLocation();
  const visibleEncounters = useMemo(
    () => getVisibleEncounters(ENCOUNTERS, collectedKrana, completedQuests),
    [collectedKrana, completedQuests]
  );
  const showBattleRoute =
    areBattlesUnlocked(completedQuests) && visibleEncounters.length > 0;

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
      {shouldShowCurrencyBar(pathname) && <CurrencyBar isPortrait={isPortrait} />}
      <nav className="nav-bar">
        {showBattleRoute && (
          <NavLink to="/battle" className="nav-item">
            <Swords />
            <label>Battle</label>
          </NavLink>
        )}
        <NavLink to="/" className="nav-item">
          <Map />
          <label>Quests</label>
        </NavLink>
        <NavLink to="/characters" className="nav-item">
          <UserCircle2 />
          <label>Characters</label>
        </NavLink>
        <NavLink to="/inventory" className="nav-item">
          <Backpack />
          <label>Inventory</label>
        </NavLink>
        <NavLink to="/settings" className="nav-item">
          <Settings />
          <label>Settings</label>
        </NavLink>
      </nav>
    </div>
  );
};
