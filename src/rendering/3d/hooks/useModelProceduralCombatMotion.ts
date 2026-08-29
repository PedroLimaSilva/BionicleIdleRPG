import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import type { RefObject } from 'react';
import type { Group } from 'three';
import type { PlayAnimationCallOptions } from './usePlayAnimation';
import { battleSpeedProgress, scaleBattleDurationMs } from '../../../utils/battleSpeed';

/** Match RahiPlaceholderModel / NuiRamaModel timing for consistent combat pacing. */
const ATTACK_CONTACT_MS = 140;
const ATTACK_TOTAL_MS = 420;
const HIT_MS = 280;
const DEFEAT_MS = 600;

type CombatAnim = 'idle' | 'attack' | 'hit' | 'defeat';

/**
 * Subtle root motion when a GLB has no Attack/Hit/Defeat clips. Keeps the same
 * playAnimation timing contract as clip-based models (contact vs full Attack).
 */
export function useModelProceduralCombatMotion(rootRef: RefObject<Group | null>) {
  const [anim, setAnim] = useState<CombatAnim>('idle');
  const animStartRef = useRef(0);

  useFrame((state) => {
    const g = rootRef.current;
    if (!g) return;

    if (anim === 'idle') {
      // Do not fight GLB idle: only clear offsets we may have applied.
      g.position.z = 0;
      g.rotation.x = 0;
      g.rotation.z = 0;
      return;
    }

    const t = state.clock.elapsedTime;
    const elapsed = (performance.now() - animStartRef.current) / 1000;

    if (anim === 'attack') {
      const punch = battleSpeedProgress(elapsed, ATTACK_TOTAL_MS / 1000);
      const lunge = Math.sin(punch * Math.PI) * 0.35;
      g.position.z = lunge;
      g.position.y = Math.sin(t * 2.2) * 0.02;
    } else if (anim === 'hit') {
      g.rotation.z = Math.sin(elapsed * 28) * 0.12;
    } else if (anim === 'defeat') {
      const k = battleSpeedProgress(elapsed, DEFEAT_MS / 1000);
      g.rotation.x = k * (Math.PI / 2);
      g.position.y = -k * 0.25;
    }
  });

  const playProceduralCombatAnimation = useCallback(
    async (name: 'Attack' | 'Hit' | 'Defeat', callOptions?: PlayAnimationCallOptions) => {
      if (name === 'Attack') {
        setAnim('attack');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, scaleBattleDurationMs(ATTACK_CONTACT_MS));
        });
        window.setTimeout(() => {
          setAnim('idle');
          callOptions?.onAnimationComplete?.();
        }, scaleBattleDurationMs(ATTACK_TOTAL_MS));
        return;
      }

      if (name === 'Hit') {
        setAnim('hit');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(() => {
            setAnim('idle');
            resolve();
          }, scaleBattleDurationMs(HIT_MS));
        });
        return;
      }

      if (name === 'Defeat') {
        setAnim('defeat');
        animStartRef.current = performance.now();
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, scaleBattleDurationMs(DEFEAT_MS));
        });
      }
    },
    []
  );

  return { playProceduralCombatAnimation };
}
