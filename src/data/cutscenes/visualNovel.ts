import type { VisualNovelCutscene } from '../../types/Cutscenes';

/** Helper: create a cutscene with a single video step (replaces legacy YouTube-only cutscenes) */
function videoOnly(id: string, videoId: string): VisualNovelCutscene {
  return {
    id,
    background: { type: 'gradient', from: '#0a0a0a', to: '#1a1a1a' },
    steps: [{ type: 'video', videoId }],
  };
}

/**
 * Registry of visual novel cutscenes by ID.
 * Add new cutscenes here and reference them in quest rewards via
 * cutscene: { type: 'visual_novel', cutsceneId: 'your_id' }
 *
 * Steps can mix dialogue and video - use { type: 'video', videoId } for YouTube embeds.
 */
export const VISUAL_NOVEL_CUTSCENES: Record<string, VisualNovelCutscene> = {
  // Video-only cutscenes (converted from legacy YouTube refs)
  story_toa_arrival: videoOnly('story_toa_arrival', 'Fk47EDfWK10'),
  story_kini_nui_descent: videoOnly('story_kini_nui_descent', 'oken0zw1D-U'),
  mnog_tahu_unlock_01: videoOnly('mnog_tahu_unlock_01', 'Cn5jxci0RiQ'),
  mnog_restore_ga_koro: videoOnly('mnog_restore_ga_koro', 'Fud_TgE_GTs'),
  mnog_po_koro_cave_investigation: videoOnly('mnog_po_koro_cave_investigation', 'EZdYj1GQR4s'),
  mnog_enter_le_wahi: videoOnly('mnog_enter_le_wahi', 'vM0lWqZ9uD4'),
  mnog_flight_to_hive: videoOnly('mnog_flight_to_hive', '3feiWoDhKzo'),
  mnog_rescue_from_hive: videoOnly('mnog_rescue_from_hive', 'dsSugRBjusI'),
  mnog_lewa_v_onua: videoOnly('mnog_lewa_v_onua', 'tggBKXjwPow'),
  mnog_search_for_matoro: videoOnly('mnog_search_for_matoro', 'vp9RVeTHNfA'),
  mnog_journey_to_kini_nui_1: videoOnly('mnog_journey_to_kini_nui_1', 'HJI0snTJetM'),
  mnog_journey_to_kini_nui_2: videoOnly('mnog_journey_to_kini_nui_2', 'gx8dUv8I3-Y'),
  mnog_journey_to_kini_nui_3: videoOnly('mnog_journey_to_kini_nui_3', 'qXCfYwpGBqY'),
  mnog_journey_to_kini_nui_4: videoOnly('mnog_journey_to_kini_nui_4', 'lts_AXCvj60'),
  mnog_kini_nui_arrival: videoOnly('mnog_kini_nui_arrival', 'xfM3OOL7NJU'),
  mnog_kini_nui_defense: videoOnly('mnog_kini_nui_defense', 'ISmkk9Vg8IM'),
  mnog_gali_call: videoOnly('mnog_gali_call', 'In1jZ3pZE9k'),
  mnog_witness_makuta_battle: videoOnly('mnog_witness_makuta_battle', 'kQbHb3eNzzs'),
  mnog_return_to_shore: videoOnly('mnog_return_to_shore', 'h0KeJl6i7Ns'),

  // Mixed dialogue + video cutscenes
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
        position: 'left',
      },
      {
        type: 'video',
        videoId: 'u0DYYVupuGQ',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        text: 'Something important has happened here. I must follow this trail.',
        position: 'left',
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
        position: 'left',
      },
      {
        type: 'dialogue',
        speakerId: 'Takua',
        text: 'I will help. Tell me what I need to do.',
        position: 'right',
      },
      {
        type: 'video',
        videoId: 'qRVxnc26NDI',
      },
      {
        type: 'dialogue',
        speakerId: 'Maku',
        text: 'Please—hurry! The villagers cannot hold out much longer.',
        position: 'left',
      },
    ],
  },
};
