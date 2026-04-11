import { ElementTribe } from '../types/Matoran';

export type BattleHitFeedbackDetail = {
  isCritical: boolean;
  /** HP actually lost after mitigation */
  damageDealt: number;
  targetMaxHp: number;
  /** Which reaction animation is expected to play on the target. */
  reactionAnimation?: 'Hit' | 'Defeat';
  /** Combatant id used for world-space hit VFX placement. */
  targetId?: string;
  /** Model family of the target, used for per-model Y offset. */
  targetModel?: string;
  /** Element of the attacker, used for hit particle color. */
  attackerElement?: ElementTribe;
};

const EVENT_NAME = 'battleHitFeedback';

export function emitBattleHitFeedback(detail: BattleHitFeedbackDetail): void {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new CustomEvent<BattleHitFeedbackDetail>(EVENT_NAME, { detail }));
}

export function subscribeBattleHitFeedback(
  handler: (detail: BattleHitFeedbackDetail) => void
): () => void {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return () => {};
  }
  const listener = (e: Event) => {
    const ce = e as CustomEvent<BattleHitFeedbackDetail>;
    if (ce.detail) handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
