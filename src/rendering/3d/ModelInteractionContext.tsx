import { useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import { shouldDisableAnimations } from '../../utils/testMode';
import { ModelInteractionContext, ModelInteractionDispatchContext } from './modelInteractionState';

/** Provides interaction epoch to descendant model hooks (e.g. idle switch). */
export function ModelInteractionProvider({ children }: { children: ReactNode }) {
  const [interactionEpoch, setInteractionEpoch] = useState(0);
  const dispatch = useCallback(() => setInteractionEpoch((n) => n + 1), []);

  return (
    <ModelInteractionDispatchContext.Provider value={dispatch}>
      <ModelInteractionContext.Provider value={{ interactionEpoch }}>
        {children}
      </ModelInteractionContext.Provider>
    </ModelInteractionDispatchContext.Provider>
  );
}

/** Drag threshold (px) before a pointer move counts as model rotation. */
const DRAG_THRESHOLD_PX = 8;

/**
 * Listens for rotate / tap on the shared character canvas and bumps the
 * interaction epoch. Mount inside the R3F tree (CharacterScene).
 */
export function ModelInteractionDetector() {
  const dispatch = useContext(ModelInteractionDispatchContext);
  const events = useThree((state) => state.events);
  const gl = useThree((state) => state.gl);
  const domElement = events.connected || gl.domElement;
  const dragTriggeredRef = useRef(false);

  useGesture(
    {
      onClick: () => {
        if (!dispatch || shouldDisableAnimations()) return;
        if (!dragTriggeredRef.current) {
          dispatch();
        }
      },
      onDrag: ({ last, movement: [mx, my] }) => {
        if (!dispatch || shouldDisableAnimations()) return;
        if (last) {
          dragTriggeredRef.current = false;
          return;
        }
        if (Math.abs(mx) + Math.abs(my) > DRAG_THRESHOLD_PX && !dragTriggeredRef.current) {
          dragTriggeredRef.current = true;
          dispatch();
        }
      },
    },
    { eventOptions: { passive: false }, target: domElement }
  );

  return null;
}
