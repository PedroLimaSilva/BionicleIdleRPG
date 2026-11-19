/** True when the layout viewport is taller than it is wide. */
export function isPortraitViewport(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  // matchMedia tracks fold/unfold and rotation more reliably than comparing
  // innerWidth/innerHeight once (those can lag on dual-screen devices).
  if (typeof window.matchMedia === 'function') {
    return !window.matchMedia('(orientation: landscape)').matches;
  }

  return window.innerHeight >= window.innerWidth;
}
