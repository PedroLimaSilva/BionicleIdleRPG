import {
  CANVAS_DPR,
  CANVAS_DPR_MAX,
  CANVAS_DPR_MIN,
  canvasMsaaForDevice,
  resolveCanvasPixelRatio,
  shouldUseMsaa,
} from './canvasPixelRatio';

describe('resolveCanvasPixelRatio', () => {
  it('keeps a 1× display at 1', () => {
    expect(resolveCanvasPixelRatio(1)).toBe(1);
  });

  it('clamps phone pixel ratios to the budget', () => {
    expect(resolveCanvasPixelRatio(2)).toBe(CANVAS_DPR_MAX);
    expect(resolveCanvasPixelRatio(3)).toBe(1.5);
  });

  it('keeps ratios already inside the range', () => {
    expect(resolveCanvasPixelRatio(1.25)).toBe(1.25);
    expect(resolveCanvasPixelRatio(1.5)).toBe(1.5);
  });

  it('raises sub-1× displays to the minimum', () => {
    expect(resolveCanvasPixelRatio(0.5)).toBe(CANVAS_DPR_MIN);
    expect(resolveCanvasPixelRatio(0)).toBe(1);
  });

  it('treats a non-finite ratio as 1×', () => {
    expect(resolveCanvasPixelRatio(Number.NaN)).toBe(1);
    expect(resolveCanvasPixelRatio(Number.POSITIVE_INFINITY)).toBe(1);
  });
});

describe('canvas MSAA', () => {
  it('keeps multisampling at 1×', () => {
    expect(shouldUseMsaa(1)).toBe(true);
    expect(canvasMsaaForDevice(1)).toBe(true);
    expect(canvasMsaaForDevice(0.75)).toBe(true);
  });

  it('turns multisampling off once the rendered ratio is above 1×', () => {
    expect(shouldUseMsaa(1.01)).toBe(false);
    expect(canvasMsaaForDevice(1.25)).toBe(false);
    expect(canvasMsaaForDevice(2)).toBe(false);
    expect(canvasMsaaForDevice(3)).toBe(false);
  });
});

describe('CANVAS_DPR', () => {
  it('matches the min and max the resolver uses', () => {
    expect(CANVAS_DPR).toEqual([CANVAS_DPR_MIN, CANVAS_DPR_MAX]);
  });
});
