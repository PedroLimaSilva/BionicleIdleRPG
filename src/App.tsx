import { SaveErrorBanner } from './components/SaveErrorBanner/index.tsx';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { LayoutGroup } from 'motion/react';

import { CharacterInventory } from './pages/CharacterInventory/index.tsx';
import { Recruitment } from './pages/Recruitment/index.tsx';
import { CharacterCreation } from './pages/CharacterCreation/index.tsx';
import { CharacterDetail } from './pages/CharacterDetail/index.tsx';
import { RahkshiDetail } from './pages/RahkshiDetail/index.tsx';

import { GameProvider } from './context/Game.tsx';
import { SceneCanvasProvider } from './rendering/3d/Canvas.tsx';
import { SettingsProvider } from './context/Settings.tsx';

import './styles/index.scss';
import { useEffect, useState } from 'react';
import { preloadAssets } from './preload.ts';
import SettingsPage from './pages/Settings/index.tsx';
import GameStateEditorPage from './pages/GameStateEditor/index.tsx';
import { QuestsPage } from './pages/Quests/index.tsx';
import { QuestTreePage } from './pages/QuestTree/index.tsx';
import { BattleSelector } from './pages/BattleSelector/index.tsx';
import { BattlePage } from './pages/Battle/index.tsx';
import TypeEffectivenessPage from './pages/TypeEffectiveness/index.tsx';
import { NavBar } from './components/NavBar/index.tsx';
import { TelemetryConsentPrompt } from './components/TelemetryConsentPrompt/index.tsx';
import { SharedCharacterPrompt } from './components/SharedCharacterPrompt/index.tsx';
import PrivacyPolicyPage from './pages/PrivacyPolicy/index.tsx';
import { ModelPreview } from './pages/ModelPreview/index.tsx';
import { CharacterDex } from './pages/CharacterDex/index.tsx';
import { CharacterDexPreview } from './pages/CharacterDex/Preview.tsx';
import { PWABadge } from './components/CacheManagement/PWABadge.tsx';

const NotFound: React.FC = () => (
  <div className="page-container">
    <h1>404 - Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

function AppShell() {
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
        <SceneCanvasProvider>
          <div className="app-container">
            <main className={`main-content ${isPortrait ? 'portrait' : 'landscape'}`}>
              <div id="canvas-mount"></div>
              <LayoutGroup>
                <Outlet />
              </LayoutGroup>
            </main>
            <NavBar isPortrait={isPortrait} />
          </div>
          <SaveErrorBanner />
          <TelemetryConsentPrompt />
          <SharedCharacterPrompt />
        </SceneCanvasProvider>
      </SettingsProvider>
    </GameProvider>
  );
}

const router = createBrowserRouter(
  [
    {
      children: [
        { element: <QuestsPage />, path: '/' },
        { element: <BattleSelector />, path: '/battle/selector' },
        { element: <BattlePage />, path: '/battle' },
        { element: <CharacterInventory />, path: '/characters' },
        { element: <CharacterDetail />, path: '/characters/:id' },
        { element: <RahkshiDetail />, path: '/rahkshi/:id' },
        { element: <Recruitment />, path: '/recruitment' },
        { element: <CharacterCreation />, path: '/character-create' },
        { element: <QuestsPage />, path: '/quests' },
        { element: <QuestTreePage />, path: '/quest-tree' },
        { element: <TypeEffectivenessPage />, path: '/type-effectiveness' },
        { element: <SettingsPage />, path: '/settings' },
        { element: <GameStateEditorPage />, path: '/settings/game-state' },
        { element: <PrivacyPolicyPage />, path: '/privacy-policy' },
        { element: <CharacterDex />, path: '/test/dex' },
        { element: <CharacterDexPreview />, path: '/test/dex/:id' },
        { element: <ModelPreview />, path: '/test/model/:kind/:id' },
        { element: <NotFound />, path: '*' },
      ],
      element: <AppShell />,
    },
  ],
  { basename: '/BionicleIdleRPG/' }
);

export function App() {
  useEffect(() => {
    preloadAssets();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <PWABadge />
    </>
  );
}
