import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import posthog from 'posthog-js';
import { PostHogProvider } from '@posthog/react';
import { initAnalytics, isAnalyticsConfigured, setupErrorReporting } from './services/telemetry.ts';
import { setupLocalAssets } from './setupLocalAssets.ts';
import { App } from './App.tsx';

setupLocalAssets();
initAnalytics();
setupErrorReporting();

function renderApp(app: ReactNode): void {
  createRoot(document.getElementById('root')!).render(
    isAnalyticsConfigured() ? <PostHogProvider client={posthog}>{app}</PostHogProvider> : app
  );
}

renderApp(
  <StrictMode>
    <App />
  </StrictMode>
);
