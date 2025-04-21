import { NavLink } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { UserCircle2, Backpack, Settings, Map, Swords } from 'lucide-react';

export const NavBar = () => {
  const { battle } = useGame();

  return (
    <nav className={`nav-bar ${battle.currentEncounter ? 'hidden' : ''}`}>
      <NavLink to='/battle' className='nav-item'>
        <Swords />
        <label>Battle</label>
      </NavLink>
      <NavLink to='/characters' className='nav-item'>
        <UserCircle2 />
        <label>Characters</label>
      </NavLink>
      <NavLink to='/quests' className='nav-item'>
        <Map />
        <label>Quests</label>
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
  );
};
