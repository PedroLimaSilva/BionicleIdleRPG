/**
 * Cutscene types for the quest system.
 * All cutscenes use the visual novel format (dialogue and/or video steps).
 */

/**
 * A dialogue step in a visual novel cutscene.
 * speakerId maps to MATORAN_DEX for name/portrait; portraitUrl overrides if provided.
 */
export interface DialogueStep {
  type: 'dialogue';
  speakerId: string; // Character ID from MATORAN_DEX
  text: string;
  /** Optional custom portrait image URL; if absent, uses character colors for avatar */
  portraitUrl?: string;
  /** Optional emotion/variant for portrait (e.g. "happy", "sad") - for future use */
  emotion?: string;
}

/**
 * A video step - embeds a YouTube video within the visual novel flow.
 */
export interface VideoStep {
  type: 'video';
  videoId: string;
}

/** A single step in a visual novel cutscene: dialogue or video */
export type VisualNovelStep = DialogueStep | VideoStep;

/**
 * Visual novel cutscene definition.
 * Steps can be dialogue (with portraits) or video (YouTube embed).
 */
export interface VisualNovelCutscene {
  id: string;
  /** Background image URL or CSS gradient/color placeholder */
  background: string | { type: 'gradient'; from: string; to: string };
  /** Ordered steps: dialogue lines and/or video embeds */
  steps: VisualNovelStep[];
}

/** @deprecated Use DialogueStep - kept for migration */
export type DialogueLine = Omit<DialogueStep, 'type'>;

export function isDialogueStep(step: VisualNovelStep): step is DialogueStep {
  return step.type === 'dialogue';
}

export function isVideoStep(step: VisualNovelStep): step is VideoStep {
  return step.type === 'video';
}

/** Quest reward cutscene: reference to a visual novel cutscene by ID */
export type VisualNovelCutsceneRef = { type: 'visual_novel'; cutsceneId: string };
