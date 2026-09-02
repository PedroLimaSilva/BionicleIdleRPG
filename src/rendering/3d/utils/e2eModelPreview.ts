import { isTestMode } from '../../../utils/testMode';

export const E2E_MODEL_PREVIEW_NAV_KEY = '__E2E_MODEL_PREVIEW_NAV__';

type ModelPreviewNavigate = (path: string) => void;

type ModelPreviewWindow = Window & {
  [E2E_MODEL_PREVIEW_NAV_KEY]?: ModelPreviewNavigate;
};

/** Registers client-side navigation for Playwright model preview suites. */
export function registerE2eModelPreviewNavigate(navigate: ModelPreviewNavigate): void {
  if (!isTestMode()) return;
  (window as ModelPreviewWindow)[E2E_MODEL_PREVIEW_NAV_KEY] = navigate;
}

export function unregisterE2eModelPreviewNavigate(): void {
  delete (window as ModelPreviewWindow)[E2E_MODEL_PREVIEW_NAV_KEY];
}
