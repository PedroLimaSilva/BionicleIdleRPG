import type { VisualNovelCutscene } from '../../types/Cutscenes';

export const METRU_NUI_CUTSCENES: Record<string, VisualNovelCutscene> = {
  metru_vakama_lihkan_story: {
    background: { from: '#0d1f2d', to: '#ffe28e', type: 'gradient' },
    id: 'metru_vakama_lihkan_story',
    steps: [
      {
        text: 'The heroes stand at the brink of the abyss, the golden city of Metru Nui stretching out below them. For a long moment, no one speaks.',
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'You have seen the city of legends. Now you must hear its story—one I have carried in silence for far too long.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Takanuva',
        text: 'The Toa of Metru Nui… you knew them?',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'We knew them as Matoran. Vakama, Nokama, Matau, Onewa, Nuju, and Whenua were craftsmen and scholars in Metru Nui, long before any of us walked the shores of Mata Nui.',
        type: 'dialogue',
      },
      {
        text: 'Vakama’s gaze drifts over the distant towers, as if he is looking through time itself.',
        type: 'narration',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'In those days, Metru Nui was guarded by Toa—the Toa Mangai. When their numbers dwindled, only one remained: Toa Lihkan, Toa of Fire.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'Turaga Dume commanded Lihkan to choose six Matoran worthy of the Toa Stones—stones that could transform a Matoran into a Toa. Lihkan gave them to us. He believed we were destined to save the city.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Hahli',
        text: 'But something went wrong. The legends always end in shadow.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'Makuta had already woven his lies into the heart of Metru Nui. Lihkan was turned against us, framed as a traitor. In the end, he fell—betrayed by the very darkness we would one day face here on Mata Nui.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'Yet the Toa Stones endured. When the time came, we became Toa Metru. That is the legacy waiting in the city below—and the reason our story is not yet finished.',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'right',
        speakerId: 'Jaller',
        text: 'So the Toa Stones… they’re still down there?',
        type: 'dialogue',
      },
      {
        portraitType: 'avatar',
        position: 'left',
        speakerId: 'Turaga_Vakama',
        text: 'Their power shaped us once. Understanding how Lihkan chose us, and why, may be the key to everything that follows. Listen well, for we will need that wisdom when we walk those streets again.',
        type: 'dialogue',
      },
    ],
  },
};
