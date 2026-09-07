import {
  getBattleSceneReadySnapshot,
  markBattleArenaReady,
  markBattleCombatantReady,
  resetBattleSceneReadiness,
  setBattleExpectedCombatants,
} from './battleSceneReadinessStore';

describe('battleSceneReadinessStore', () => {
  beforeEach(() => {
    resetBattleSceneReadiness();
  });

  test('scene is ready when arena and all expected combatants report in', () => {
    setBattleExpectedCombatants(['a', 'b']);
    markBattleArenaReady();
    expect(getBattleSceneReadySnapshot()).toBe(false);

    markBattleCombatantReady('a');
    expect(getBattleSceneReadySnapshot()).toBe(false);

    markBattleCombatantReady('b');
    expect(getBattleSceneReadySnapshot()).toBe(true);
  });

  test('re-setting the same combatant ids does not clear readiness', () => {
    setBattleExpectedCombatants(['a']);
    markBattleArenaReady();
    markBattleCombatantReady('a');
    expect(getBattleSceneReadySnapshot()).toBe(true);

    setBattleExpectedCombatants(['a']);
    expect(getBattleSceneReadySnapshot()).toBe(true);
  });

  test('changing combatant ids clears readiness until they report again', () => {
    setBattleExpectedCombatants(['a']);
    markBattleArenaReady();
    markBattleCombatantReady('a');
    expect(getBattleSceneReadySnapshot()).toBe(true);

    setBattleExpectedCombatants(['a', 'b']);
    expect(getBattleSceneReadySnapshot()).toBe(false);

    markBattleCombatantReady('a');
    markBattleCombatantReady('b');
    expect(getBattleSceneReadySnapshot()).toBe(true);
  });

  test('wave advance keeps ally readiness and only waits on new enemy keys', () => {
    setBattleExpectedCombatants(['ally-a', 'enemy-x-w0']);
    markBattleArenaReady();
    markBattleCombatantReady('ally-a');
    markBattleCombatantReady('enemy-x-w0');
    expect(getBattleSceneReadySnapshot()).toBe(true);

    setBattleExpectedCombatants(['ally-a', 'enemy-x-w1']);
    expect(getBattleSceneReadySnapshot()).toBe(false);

    markBattleCombatantReady('enemy-x-w1');
    expect(getBattleSceneReadySnapshot()).toBe(true);
  });
});
