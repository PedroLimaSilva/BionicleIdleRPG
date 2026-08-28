import { createContext, useContext } from 'react';

type ModelInteractionContextValue = {
  /** Increments on each qualifying viewer interaction (rotate or tap). */
  interactionEpoch: number;
};

export const ModelInteractionContext = createContext<ModelInteractionContextValue>({
  interactionEpoch: 0,
});

export const ModelInteractionDispatchContext = createContext<(() => void) | null>(null);

export function useModelInteractionEpoch(): number {
  return useContext(ModelInteractionContext).interactionEpoch;
}
