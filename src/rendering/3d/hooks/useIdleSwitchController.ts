import { useEffect, useRef, useState } from 'react';
import type { AnimationAction, AnimationMixer } from 'three';
import { LoopOnce } from 'three';
import { useModelInteractionEpoch } from '../modelInteractionState';
import { resolveIdleTransitionClip, type IdleSwitchConfig } from './idleSwitchTypes';
import { shouldDisableAnimations } from '../../../utils/testMode';

const TRANSITION_FADE_OUT = 0.1;

type UseIdleSwitchControllerOptions = {
  config?: IdleSwitchConfig | null;
};

/**
 * Watches character-sheet interaction (rotate / tap) and cycles through
 * configured idle clips. Uses dedicated transition clips when available;
 * otherwise the caller should crossfade via `useIdleAnimation`.
 */
export function useIdleSwitchController(
  actions: Record<string, AnimationAction | null>,
  mixer: AnimationMixer,
  options: UseIdleSwitchControllerOptions
): string {
  const { config } = options;
  const interactionEpoch = useModelInteractionEpoch();
  const defaultIndex = config?.defaultIndex ?? 0;
  const initialClip = config?.idles[defaultIndex]?.clip ?? 'Idle';

  const [idleActionName, setIdleActionName] = useState(initialClip);
  const currentIndexRef = useRef(defaultIndex);
  const isTransitioningRef = useRef(false);
  const lastSwitchAtRef = useRef(0);
  const prevEpochRef = useRef(interactionEpoch);

  useEffect(() => {
    if (!config || config.idles.length < 2) return;
    if (interactionEpoch === prevEpochRef.current) return;
    prevEpochRef.current = interactionEpoch;
    if (shouldDisableAnimations()) return;
    if (isTransitioningRef.current) return;

    const cooldownMs = config.cooldownMs ?? 800;
    const now = performance.now();
    if (now - lastSwitchAtRef.current < cooldownMs) return;
    lastSwitchAtRef.current = now;

    const fromIndex = currentIndexRef.current;
    const toIndex = (fromIndex + 1) % config.idles.length;
    const fromClip = config.idles[fromIndex]?.clip;
    const toClip = config.idles[toIndex]?.clip;
    if (!fromClip || !toClip || fromClip === toClip) return;

    const transitionClipName = resolveIdleTransitionClip(config, fromClip, toClip);
    const transitionAction = transitionClipName ? actions[transitionClipName] : null;

    if (transitionClipName && !transitionAction) {
      console.warn(
        `[useIdleSwitch] Transition clip '${transitionClipName}' missing; crossfading '${fromClip}' → '${toClip}'`
      );
    }

    if (transitionAction) {
      isTransitioningRef.current = true;
      actions[fromClip]?.fadeOut(TRANSITION_FADE_OUT);

      transitionAction.stop();
      transitionAction.reset();
      transitionAction.setLoop(LoopOnce, 1);
      transitionAction.clampWhenFinished = true;
      transitionAction.setEffectiveWeight(1);
      transitionAction.play();

      const onFinished = (event: { action: AnimationAction }) => {
        if (event.action !== transitionAction) return;
        mixer.removeEventListener('finished', onFinished);
        transitionAction.fadeOut(0);
        currentIndexRef.current = toIndex;
        isTransitioningRef.current = false;
        setIdleActionName(toClip);
      };

      mixer.addEventListener('finished', onFinished);

      return () => {
        mixer.removeEventListener('finished', onFinished);
        isTransitioningRef.current = false;
      };
    }

    currentIndexRef.current = toIndex;
    setIdleActionName(toClip);
  }, [actions, config, interactionEpoch, mixer]);

  useEffect(() => {
    if (!config) return;
    const index = config.defaultIndex ?? 0;
    currentIndexRef.current = index;
    setIdleActionName(config.idles[index]?.clip ?? 'Idle');
  }, [config]);

  return idleActionName;
}
