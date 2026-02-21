import { PWABadge } from './components/CacheManagement/PWABadge.tsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CharacterInventory } from './pages/CharacterInventory/index.tsx';
import { Recruitment } from './pages/Recruitment/index.tsx';
import { CharacterDetail } from './pages/CharacterDetail/index.tsx';

import { GameProvider } from './context/Game.tsx';
import { SceneCanvasProvider } from './context/Canvas.tsx';
import { SettingsProvider } from './context/Settings.tsx';

import './styles/index.scss';
import { ActivityLog } from './components/ActivityLog/index.tsx';
import { useEffect, useState } from 'react';
import { preloadAssets } from './preload.ts';
import { InventoryPage } from './pages/Inventory/index.tsx';
import SettingsPage from './pages/Settings/index.tsx';
import { QuestsPage } from './pages/Quests/index.tsx';
import { QuestTreePage } from './pages/QuestTree/index.tsx';
import { BattleSelector } from './pages/BattleSelector/index.tsx';
import { BattlePage } from './pages/Battle/index.tsx';
import TypeEffectivenessPage from './pages/TypeEffectiveness/index.tsx';
import { NavBar } from './components/NavBar/index.tsx';

const HomePage: React.FC = () => (
  <div className="page-container">
    <h1>Welcome to Mata Nui</h1>
    <p>Embark on your journey to recruit Matoran and help them become legends!</p>
    <ActivityLog />
  </div>
);

const NotFound: React.FC = () => (
  <div className="page-container">
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export function App() {
  useEffect(() => {
    preloadAssets();
  }, []);

  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    window.addEventListener(
      'resize',
      handleResize as unknown as (this: Window, ev: UIEvent) => void
    );
    window.addEventListener(
      'orientationchange',
      handleResize as unknown as (this: Window, ev: Event) => void
    );

    return () => {
      window.removeEventListener(
        'resize',
        handleResize as unknown as (this: Window, ev: UIEvent) => void
      );
      window.removeEventListener(
        'orientationchange',
        handleResize as unknown as (this: Window, ev: Event) => void
      );
    };
  }, []);

  return (
    <GameProvider>
      <SettingsProvider>
        <Router basename="/BionicleIdleRPG/">
          <SceneCanvasProvider>
            <div className="app-container">
              <main className={`main-content ${isPortrait ? 'portrait' : 'landscape'}`}>
                <div id="canvas-mount"></div>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/battle/selector" element={<BattleSelector />} />
                  <Route path="/battle" element={<BattlePage />} />
                  <Route path="/characters" element={<CharacterInventory />} />
                  <Route path="/characters/:id" element={<CharacterDetail />} />
                  <Route path="/recruitment" element={<Recruitment />} />
                  <Route path="/quests" element={<QuestsPage />} />
                  <Route path="/quest-tree" element={<QuestTreePage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/type-effectiveness" element={<TypeEffectivenessPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <NavBar isPortrait={isPortrait} />
            </div>
            <PWABadge />
          </SceneCanvasProvider>
        </Router>
      </SettingsProvider>
    </GameProvider>
  );
}
