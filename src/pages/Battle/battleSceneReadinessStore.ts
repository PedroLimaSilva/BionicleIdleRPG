type ReadinessListener = () => void;

let arenaReady = false;
let readyCombatants = new Set<string>();
let expectedCombatantIds: string[] = [];
const listeners = new Set<ReadinessListener>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

function computeSceneReady(): boolean {
  if (!arenaReady) return false;
  if (expectedCombatantIds.length === 0) return true;
  return expectedCombatantIds.every((id) => readyCombatants.has(id));
}

function combatantIdKey(ids: string[]): string {
  return ids.join('\0');
}

/** Stable readiness key — enemies remount each wave so their key includes the wave index. */
export function battleCombatantReadyKey(
  combatantId: string,
  side: 'team' | 'enemy',
  currentWave: number
): string {
  return side === 'enemy' ? `${combatantId}-w${currentWave}` : combatantId;
}

export function setBattleExpectedCombatants(ids: string[]): void {
  const nextKey = combatantIdKey(ids);
  const prevKey = combatantIdKey(expectedCombatantIds);
  if (nextKey === prevKey) return;

  const nextSet = new Set(ids);
  expectedCombatantIds = ids;
  // Keep allies that stayed mounted; only new/changed keys must report again.
  readyCombatants = new Set([...readyCombatants].filter((id) => nextSet.has(id)));
  notifyListeners();
}

export function markBattleArenaReady(): void {
  if (arenaReady) return;
  arenaReady = true;
  notifyListeners();
}

export function markBattleCombatantReady(id: string): void {
  if (readyCombatants.has(id)) return;
  readyCombatants = new Set(readyCombatants).add(id);
  notifyListeners();
}

export function resetBattleSceneReadiness(): void {
  arenaReady = false;
  readyCombatants = new Set();
  expectedCombatantIds = [];
  notifyListeners();
}

export function isBattleSceneReady(): boolean {
  return computeSceneReady();
}

export function subscribeBattleSceneReadiness(listener: ReadinessListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getBattleSceneReadySnapshot(): boolean {
  return computeSceneReady();
}
