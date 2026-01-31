import { NavLink, NavLinkProps, useSearchParams } from 'react-router-dom';

/**
 * A wrapper around React Router's NavLink that preserves the testMode query parameter
 * This ensures that when running E2E tests, the testMode flag persists across navigation
 */
export function TestModeNavLink({ to, ...props }: NavLinkProps) {
  const [searchParams] = useSearchParams();
  const testMode = searchParams.get('testMode');

  // If testMode is present, append it to the destination URL
  if (testMode === 'true') {
    const separator = typeof to === 'string' && to.includes('?') ? '&' : '?';
    const newTo = typeof to === 'string' 
      ? `${to}${separator}testMode=true`
      : to;
    
    return <NavLink to={newTo} {...props} />;
  }

  return <NavLink to={to} {...props} />;
}

