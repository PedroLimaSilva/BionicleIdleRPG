import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  resetBattleSceneReadiness,
  setBattleExpectedCombatants,
  subscribeBattleSceneReadiness,
  getBattleSceneReadySnapshot,
} from './battleSceneReadinessStore';

function useBattleSceneReadyState(): boolean {
  const [ready, setReady] = useState(getBattleSceneReadySnapshot);

  useEffect(() => subscribeBattleSceneReadiness(() => setReady(getBattleSceneReadySnapshot())), []);

  return ready;
}

/** Syncs expected combatant ids from battle phase into the shared readiness store. */
export function BattleSceneReadinessBridge({
  children,
  expectedCombatantIds,
}: {
  children: ReactNode;
  expectedCombatantIds: string[];
}) {
  const expectedCombatantKey = expectedCombatantIds.join('\0');

  useEffect(() => {
    setBattleExpectedCombatants(expectedCombatantIds);
  }, [expectedCombatantKey, expectedCombatantIds]);

  useEffect(() => {
    return () => resetBattleSceneReadiness();
  }, []);

  return children;
}

export function useBattleSceneReadiness(): { sceneReady: boolean } {
  const sceneReady = useBattleSceneReadyState();
  return useMemo(() => ({ sceneReady }), [sceneReady]);
}
