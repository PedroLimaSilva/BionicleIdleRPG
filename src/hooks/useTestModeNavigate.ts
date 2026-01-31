import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * A wrapper around React Router's useNavigate that preserves the testMode query parameter
 * This ensures that when running E2E tests, the testMode flag persists across programmatic navigation
 */
export function useTestModeNavigate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testMode = searchParams.get('testMode');

  return (to: string | number, options?: { replace?: boolean; state?: any }) => {
    // If navigating to a number (back/forward), just use regular navigate
    if (typeof to === 'number') {
      navigate(to);
      return;
    }

    // If testMode is present, append it to the destination URL
    if (testMode === 'true') {
      const separator = to.includes('?') ? '&' : '?';
      const newTo = `${to}${separator}testMode=true`;
      navigate(newTo, options);
    } else {
      navigate(to, options);
    }
  };
}

