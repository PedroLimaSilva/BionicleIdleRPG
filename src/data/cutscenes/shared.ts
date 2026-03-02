import type { VisualNovelCutscene } from '../../types/Cutscenes';

/** Helper: create a cutscene with a single video step (replaces legacy YouTube-only cutscenes) */
export function videoOnly(id: string, videoId: string): VisualNovelCutscene {
  return {
    id,
    background: { type: 'gradient', from: '#0a0a0a', to: '#1a1a1a' },
    steps: [{ type: 'video', videoId }],
  };
}
