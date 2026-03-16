import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { setupErrorReporting } from './services/telemetry.ts';
import { App } from './App.tsx';

setupErrorReporting();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
