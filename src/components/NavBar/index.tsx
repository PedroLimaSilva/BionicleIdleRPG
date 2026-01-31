import { TestModeNavLink } from '../TestModeNavLink';
import { useGame } from '../../context/Game';
import { UserCircle2, Backpack, Settings, Map, Swords } from 'lucide-react';
import { BattlePhase } from '../../hooks/useBattleState';
import { areBattlesUnlocked } from '../../game/Progress';

export const NavBar = () => {
  const { battle, completedQuests } = useGame();

  return (
    <nav
      className={`nav-bar ${
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
      {areBattlesUnlocked(completedQuests) && (
        <TestModeNavLink to='/battle' className='nav-item'>
          <Swords />
          <label>Battle</label>
        </TestModeNavLink>
      )}
      <TestModeNavLink to='/characters' className='nav-item'>
        <UserCircle2 />
        <label>Characters</label>
      </TestModeNavLink>
      <TestModeNavLink to='/quests' className='nav-item'>
        <Map />
        <label>Quests</label>
      </TestModeNavLink>
      <TestModeNavLink to='/inventory' className='nav-item'>
        <Backpack />
        <label>Inventory</label>
      </TestModeNavLink>
      <TestModeNavLink to='/settings' className='nav-item'>
        <Settings />
        <label>Settings</label>
      </TestModeNavLink>
    </nav>
  );
};
