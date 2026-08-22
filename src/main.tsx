import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initAnalytics, setupErrorReporting } from './services/telemetry.ts';
import { setupLocalAssets } from './setupLocalAssets.ts';
import { App } from './App.tsx';

setupLocalAssets();
initAnalytics();
setupErrorReporting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
