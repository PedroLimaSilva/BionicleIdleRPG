/**
 * Shared-canvas resolution budget from docs/UI_UX_STRATEGY.md.
 * R3F's default `dpr` is `[1, 2]`; phones at 3× were painting four to nine
 * times as many pixels as a 1× desktop before MSAA.
 */
export const CANVAS_DPR_MIN = 1;
export const CANVAS_DPR_MAX = 1.5;

/** Pass to R3F `<Canvas dpr>`. Resolved the same way as {@link resolveCanvasPixelRatio}. */
export const CANVAS_DPR: [number, number] = [CANVAS_DPR_MIN, CANVAS_DPR_MAX];

/**
 * Clamp a display pixel ratio into the canvas budget.
 * Non-finite values fall back to 1× so a broken `devicePixelRatio` cannot
 * request an unbounded backing store.
 */
export function resolveCanvasPixelRatio(devicePixelRatio: number): number {
  const target = Number.isFinite(devicePixelRatio) ? devicePixelRatio : CANVAS_DPR_MIN;
  return Math.min(CANVAS_DPR_MAX, Math.max(CANVAS_DPR_MIN, target));
}

/**
 * MSAA on top of a retina backing store is the sustained fill-rate cost.
 * At 1× (desktop, and Playwright's Desktop Chrome project) keep it so edges
 * stay crisp and existing screenshots do not move. Above 1× the extra samples
 * cost more than the softness they hide.
 *
 * Antialiasing is fixed when the WebGPU/WebGL context is created. Decide it
 * from {@link resolveCanvasPixelRatio}, not the raw display ratio: a 3× phone
 * renders at 1.5× and still skips MSAA.
 */
export function shouldUseMsaa(pixelRatio: number): boolean {
  return pixelRatio <= 1;
}

/** MSAA flag for the pixel ratio the canvas will actually render at. */
export function canvasMsaaForDevice(devicePixelRatio: number): boolean {
  return shouldUseMsaa(resolveCanvasPixelRatio(devicePixelRatio));
}
