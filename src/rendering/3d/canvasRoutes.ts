/** Routes that mount content into the shared 3D canvas portal. */
export const CANVAS_ROUTE_PREFIXES = [
  '/recruitment',
  '/character-create',
  '/characters/',
  '/rahkshi/',
  '/battle',
  '/test/dex/',
  '/test/model/',
] as const;

export function isCanvasRoute(pathname: string): boolean {
  return CANVAS_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export function shouldFadeCanvasOnExit(fromPathname: string, toPathname: string): boolean {
  return isCanvasRoute(fromPathname) && !isCanvasRoute(toPathname);
}
