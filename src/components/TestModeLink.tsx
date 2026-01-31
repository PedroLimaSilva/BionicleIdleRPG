import { Link, LinkProps, useSearchParams } from 'react-router-dom';

/**
 * A wrapper around React Router's Link that preserves the testMode query parameter
 * This ensures that when running E2E tests, the testMode flag persists across navigation
 */
export function TestModeLink({ to, ...props }: LinkProps) {
  const [searchParams] = useSearchParams();
  const testMode = searchParams.get('testMode');

  // If testMode is present, append it to the destination URL
  if (testMode === 'true') {
    const separator = typeof to === 'string' && to.includes('?') ? '&' : '?';
    const newTo = typeof to === 'string' 
      ? `${to}${separator}testMode=true`
      : to;
    
    return <Link to={newTo} {...props} />;
  }

  return <Link to={to} {...props} />;
}

