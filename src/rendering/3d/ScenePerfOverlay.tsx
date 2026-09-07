import { addAfterEffect } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { isWebGLBackend } from './webgpuRenderer';
import { readFrameRenderStats, type FrameRenderStats } from './sceneDrawCallStats';

type SmoothedPerf = {
  fps: number;
  frameMs: number;
};

/**
 * Lightweight HUD for WebGPU (and WebGL fallback) using `renderer.info`.
 * r3f-perf only supports the WebGL backend; this overlay works with WebGPURenderer.
 */
export function ScenePerfOverlay() {
  const gl = useThree((state) => state.gl);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const smoothedRef = useRef<SmoothedPerf>({ fps: 0, frameMs: 0 });
  const frameStatsRef = useRef<FrameRenderStats>({
    drawCalls: 0,
    lines: 0,
    points: 0,
    triangles: 0,
  });
  const backendLabel = isWebGLBackend(gl) ? 'WebGL' : 'WebGPU';

  useEffect(() => {
    const host = document.createElement('div');
    host.className = 'scene-perf-overlay';
    host.setAttribute('data-testid', 'scene-perf-overlay');
    document.body.appendChild(host);
    hostRef.current = host;
    return () => {
      host.remove();
      hostRef.current = null;
    };
  }, []);

  useEffect(() => {
    return addAfterEffect(() => {
      frameStatsRef.current = readFrameRenderStats(gl);
    });
  }, [gl]);

  useFrame((_, delta) => {
    const host = hostRef.current;
    if (!host) return;

    const fps = delta > 0 ? 1 / delta : 0;
    const frameMs = delta * 1000;
    const smoothed = smoothedRef.current;
    smoothed.fps = smoothed.fps * 0.9 + fps * 0.1;
    smoothed.frameMs = smoothed.frameMs * 0.9 + frameMs * 0.1;

    const { drawCalls, lines, points, triangles } = frameStatsRef.current;
    host.textContent = [
      `${backendLabel}  ${smoothed.fps.toFixed(0)} fps  ${smoothed.frameMs.toFixed(1)} ms`,
      `draw ${drawCalls}  tris ${triangles}  pts ${points}  lines ${lines}`,
    ].join('\n');
  });

  return null;
}
