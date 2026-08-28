/** A single looping idle pose clip exported from a character GLB. */
export type IdleVariant = {
  /** Animation clip name in the GLB (e.g. `Idle`, `Idle Biped`). */
  clip: string;
};

/**
 * Describes multiple idle poses for one rig and how to move between them.
 * Transition clips are one-shot reconfiguration animations (not crossfades).
 */
export type IdleSwitchConfig = {
  /** Ordered idle variants cycled when the player interacts with the model viewer. */
  idles: IdleVariant[];
  /** Index into `idles` for the starting pose. Default: 0. */
  defaultIndex?: number;
  /**
   * One-shot transition clips keyed by `"fromClip->toClip"`.
   * When a pair has no entry (or the clip is missing), falls back to crossfade.
   */
  transitions?: Record<string, string>;
  /** Minimum ms between switches after the first. Default: 5000 (5 seconds). */
  cooldownMs?: number;
};

/** Builds the transition map key used by {@link IdleSwitchConfig.transitions}. */
export function idleTransitionKey(fromClip: string, toClip: string): string {
  return `${fromClip}->${toClip}`;
}

/** Resolves a transition clip name for a directed idle pair, if configured. */
export function resolveIdleTransitionClip(
  config: IdleSwitchConfig,
  fromClip: string,
  toClip: string
): string | undefined {
  return config.transitions?.[idleTransitionKey(fromClip, toClip)];
}
