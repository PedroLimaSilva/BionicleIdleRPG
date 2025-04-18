import { PWABadge } from './components/CacheManagement/PWABadge.tsx';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import { Home, UserCircle2, Backpack, Settings, Map } from 'lucide-react';

import { CharacterInventory } from './pages/CharacterInventory/index.tsx';
import { Recruitment } from './pages/Recruitment/index.tsx';
import { CharacterDetail } from './pages/CharacterDetail/index.tsx';

import { GameProvider } from './context/Game.tsx';
import { SceneCanvasProvider } from './context/Canvas.tsx';

import './styles/index.scss';
import { ActivityLog } from './components/ActivityLog/index.tsx';
import { useEffect } from 'react';
import { preloadAssets } from './preload.ts';
import { InventoryPage } from './pages/Inventory/index.tsx';
import SettingsPage from './pages/Settings/index.tsx';
import { QuestsPage } from './pages/Quests/index.tsx';

const HomePage: React.FC = () => (
  <div className='page-container'>
    <h1>Welcome to Mata Nui</h1>
    <p>
      Embark on your journey to recruit Matoran and help them become legends!
    </p>
    <ActivityLog />
  </div>
);

const NotFound: React.FC = () => (
  <div className='page-container'>
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export function App() {
  useEffect(() => {
    preloadAssets();
  }, []);

  return (
    <GameProvider>
      <Router basename='/BionicleIdleRPG/'>
        <SceneCanvasProvider>
          <div className='app-container'>
            <main className='main-content'>
              <div id='canvas-mount'></div>
              <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/characters' element={<CharacterInventory />} />
                <Route path='/characters/:id' element={<CharacterDetail />} />
                <Route path='/recruitment' element={<Recruitment />} />
                <Route path='/quests' element={<QuestsPage />} />
                <Route path='/inventory' element={<InventoryPage />} />
                <Route path='/settings' element={<SettingsPage />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </main>
            <nav className='nav-bar'>
              <NavLink to='/' className='nav-item'>
                <Home />
                <label>Home</label>
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
          </div>
          <PWABadge />
        </SceneCanvasProvider>
      </Router>
    </GameProvider>
  );
}
