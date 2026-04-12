export type BattleCameraEmphasisDetail = {
  phase: 'start' | 'end';
  attackerId?: string;
  targetId?: string;
  /** Which side the attacker belongs to ('team' | 'enemy'). */
  attackerSide?: 'team' | 'enemy';
  /** Called by the camera system when the transition finishes. */
  resolve?: () => void;
};

const EVENT_NAME = 'battleCameraEmphasis';

export function emitBattleCameraEmphasis(
  detail: Omit<BattleCameraEmphasisDetail, 'resolve'>
): Promise<void> {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    window.dispatchEvent(
      new CustomEvent<BattleCameraEmphasisDetail>(EVENT_NAME, {
        detail: { ...detail, resolve },
      })
    );
  });
}

export function subscribeBattleCameraEmphasis(
  handler: (detail: BattleCameraEmphasisDetail) => void
): () => void {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') {
    return () => {};
  }
  const listener = (e: Event) => {
    const ce = e as CustomEvent<BattleCameraEmphasisDetail>;
    if (ce.detail) handler(ce.detail);
  };
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
