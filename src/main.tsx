import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupErrorReporting } from './services/telemetry.ts';
import { setupLocalAssets } from './setupLocalAssets.ts';
import { App } from './App.tsx';

setupLocalAssets();
setupErrorReporting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
