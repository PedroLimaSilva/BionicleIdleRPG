import type { VisualNovelCutscene } from '../../types/Cutscenes';

/** Helper: create a cutscene with a single video step (replaces legacy YouTube-only cutscenes) */
export function videoOnly(id: string, videoId: string): VisualNovelCutscene {
  return {
    background: { from: '#0a0a0a', to: '#1a1a1a', type: 'gradient' },
    id,
    steps: [{ type: 'video', videoId }],
  };
}
