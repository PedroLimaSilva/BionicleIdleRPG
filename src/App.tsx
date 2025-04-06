import { PWABadge } from './components/CacheManagement/PWABadge.tsx';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { CharacterInventory } from './pages/CharacterInventory/index.tsx';
import { Recruitment } from './pages/Recruitment/index.tsx';
import { CharacterDetail } from './pages/CharacterDetail/index.tsx';

import { GameProvider } from './providers/Game.tsx';

import './App.scss';
import { ActivityLog } from './components/ActivityLog/index.tsx';
import { SceneCanvasProvider } from './providers/Canvas.tsx';

const Home: React.FC = () => (
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
  return (
    <GameProvider>
      <Router basename='/BionicleIdleRPG/'>
        <SceneCanvasProvider>
          <div className='app-container'>
            <main className='main-content'>
              <div id='canvas-mount'></div>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/characters' element={<CharacterInventory />} />
                <Route path='/character/:id' element={<CharacterDetail />} />
                <Route path='/recruitment' element={<Recruitment />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </main>
            <nav className='nav-bar'>
              <ul className='nav-links'>
                <li>
                  <Link to='/'>Home</Link>
                </li>
                <li>
                  <Link to='/characters'>Characters</Link>
                </li>
              </ul>
            </nav>
          </div>
          <PWABadge />
        </SceneCanvasProvider>
      </Router>
    </GameProvider>
  );
}
