import { useEffect, useRef } from 'react';
import { AnimationAction, AnimationMixer, Event, LoopOnce } from 'three';

type AnimationControllerOptions = {
  mixer: AnimationMixer;
  idle?: AnimationAction | null;
  flavors?: (AnimationAction | null)[];
  interval?: number;
};

export function useAnimationController({
  mixer,
  idle,
  flavors = [],
  interval = 3000,
}: AnimationControllerOptions) {
  const isPlayingFlavor = useRef(false);
  const timeout = useRef<number | null>(null);

  useEffect(() => {
    if (!idle) return;

    // Don't restart if already running
    if (!idle.isRunning()) {
      idle.reset().play();
    }

    const handleFinished = (event: Event) => {
      const action = (event as unknown as { action: AnimationAction }).action;
      if (flavors.includes(action)) {
        action.enabled = false;
        isPlayingFlavor.current = false;
      }
    };

    mixer.addEventListener('finished', handleFinished);

    function scheduleNextFlavor() {
      if (isPlayingFlavor.current || flavors.length === 0) return;

      if (Math.random() < 0.3) {
        const flavor = flavors[Math.floor(Math.random() * flavors.length)];
        if (!flavor) return;

        isPlayingFlavor.current = true;

        flavor.enabled = true;
        flavor.setEffectiveTimeScale(1);
        flavor.setEffectiveWeight(1);
        flavor.clampWhenFinished = true;
        flavor.loop = LoopOnce;
        flavor.reset().play();
      }
    }

    timeout.current = window.setInterval(scheduleNextFlavor, interval);

    return () => {
      if (timeout.current !== null) clearInterval(timeout.current);
      mixer.removeEventListener('finished', handleFinished);
    };
  }, [idle, flavors, interval, mixer]);
}
