import type { VisualNovelCutscene } from '../../types/Cutscenes';

/**
 * Registry of visual novel cutscenes by ID.
 * Add new cutscenes here and reference them in quest rewards via
 * cutscene: { type: 'visual_novel', cutsceneId: 'your_id' }
 *
 * Steps can mix dialogue and video - use { type: 'video', videoId } for YouTube embeds.
 */
export const VISUAL_NOVEL_CUTSCENES: Record<string, VisualNovelCutscene> = {
  mnog_canister_beach: {
    id: 'mnog_canister_beach',
    background: {
      type: 'gradient',
      from: '#1a3a4a',
      to: '#0d1f2d',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Takua',
        text: 'What is that? A large canister... washed ashore. And those footprints—they lead toward Ta-Wahi.',
      },
      {
        type: 'video',
        videoId: 'u0DYYVupuGQ',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        text: 'Something important has happened here. I must follow this trail.',
      },
    ],
  },
  mnog_ga_koro_sos: {
    id: 'mnog_ga_koro_sos',
    background: {
      type: 'gradient',
      from: '#0d2847',
      to: '#051a2e',
    },
    steps: [
      {
        type: 'dialogue',
        speakerId: 'Maku',
        text: 'Takua! Ga-Koro is under attack! A Rahi has driven our people into the water!',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        text: 'I will help. Tell me what I need to do.',
      },
      {
        type: 'video',
        videoId: 'qRVxnc26NDI',
      },
      {
        type: 'dialogue',
        speakerId: 'Maku',
        text: 'Please—hurry! The villagers cannot hold out much longer.',
      },
    ],
  },
};
