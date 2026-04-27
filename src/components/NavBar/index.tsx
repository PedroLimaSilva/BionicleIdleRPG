import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { UserCircle2, Settings, Map, Swords } from 'lucide-react';
import { BattlePhase } from '../../hooks/useBattleState';
import { CurrencyBar } from '../CurrencyBar';
import { AnimatePresence } from 'motion/react';
import { ENCOUNTERS } from '../../data/combat';
import { getVisibleEncounters } from '../../game/encounterVisibility';

const shouldShowCurrencyBar = (pathname: string) => {
  return !['/settings'].includes(pathname);
};

export const NavBar = ({ isPortrait }: { isPortrait: boolean }) => {
  const { battle, collectedKrana, completedQuests } = useGame();
  const { outcomePresentationReady } = battle;
  const { pathname } = useLocation();
  const hasVisibleEncounters = useMemo(
    () => getVisibleEncounters(ENCOUNTERS, collectedKrana, completedQuests).length > 0,
    [collectedKrana, completedQuests]
  );

  return (
    <div
      className={`nav-container ${isPortrait ? 'portrait' : 'landscape'} ${
        battle.currentEncounter &&
        !(
          battle.phase === BattlePhase.Retreated ||
          (battle.phase === BattlePhase.Defeat && outcomePresentationReady) ||
          (battle.phase === BattlePhase.Victory && outcomePresentationReady)
        )
          ? 'hidden'
          : ''
      }`}
    >
      <AnimatePresence initial={false}>
        {shouldShowCurrencyBar(pathname) && <CurrencyBar isPortrait={isPortrait} />}
      </AnimatePresence>
      <nav className="nav-bar">
        <NavLink
          to="/"
          end
          className={() =>
            `nav-item ${pathname === '/' || pathname === '/quests' || pathname === '/quest-tree' ? 'active' : ''}`
          }
        >
          <Map />
          <label>Quests</label>
        </NavLink>
        <NavLink
          to="/characters"
          className={() =>
            `nav-item ${
              pathname.startsWith('/characters') ||
              pathname === '/recruitment' ||
              pathname.startsWith('/rahkshi/')
                ? 'active'
                : ''
            }`
          }
        >
          <UserCircle2 />
          <label>Characters</label>
        </NavLink>
        <NavLink
          to="/battle/selector"
          className={() =>
            `nav-item ${pathname.startsWith('/battle') || pathname === '/type-effectiveness' ? 'active' : ''} ${
              hasVisibleEncounters ? '' : 'disabled'
            }`
          }
          aria-disabled={!hasVisibleEncounters}
          onClick={(event) => {
            if (!hasVisibleEncounters) event.preventDefault();
          }}
        >
          <Swords />
          <label>Battle</label>
        </NavLink>
        <NavLink
          to="/settings"
          className={() =>
            `nav-item ${pathname.startsWith('/settings') || pathname === '/privacy-policy' ? 'active' : ''}`
          }
        >
          <Settings />
          <label>Settings</label>
        </NavLink>
      </nav>
    </div>
  );
};
