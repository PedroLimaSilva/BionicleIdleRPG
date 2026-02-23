/**
 * Cutscene types for the quest system.
 * Supports YouTube embeds (legacy) and visual novel dialogue cutscenes.
 */

/** YouTube video ID - used for legacy video cutscenes */
export type YouTubeCutscene = string;

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

/**
 * Union type: either a YouTube video ID (string) or a visual novel cutscene ID (object).
 * The quest reward uses this to determine which cutscene type to show.
 */
export type CutsceneRef =
  | { type: 'youtube'; videoId: string }
  | { type: 'visual_novel'; cutsceneId: string };

/**
 * Type guard: check if a cutscene ref is YouTube
 */
export function isYouTubeCutscene(ref: CutsceneRef): ref is { type: 'youtube'; videoId: string } {
  return ref.type === 'youtube';
}

/**
 * Type guard: check if a cutscene ref is visual novel
 */
export function isVisualNovelCutscene(
  ref: CutsceneRef
): ref is { type: 'visual_novel'; cutsceneId: string } {
  return ref.type === 'visual_novel';
}

/** Quest reward cutscene: legacy string (YouTube ID) or CutsceneRef */
export type QuestCutscene = string | CutsceneRef;

/**
 * Normalize quest cutscene to CutsceneRef.
 * Legacy: string → { type: 'youtube', videoId }
 * New: object → as-is
 */
export function normalizeCutsceneRef(cutscene: QuestCutscene | undefined): CutsceneRef | null {
  if (!cutscene) return null;
  if (typeof cutscene === 'string') {
    return { type: 'youtube', videoId: cutscene };
  }
  return cutscene;
}
