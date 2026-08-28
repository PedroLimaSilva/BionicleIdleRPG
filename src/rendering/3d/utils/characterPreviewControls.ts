import type { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';

type PlayAnimation = CombatantModelHandle['playAnimation'];

let playAnimation: PlayAnimation | null = null;

/** Registers the currently mounted CharacterScene combat handle for the dex preview. */
export function registerCharacterPreviewPlay(next: PlayAnimation | null): void {
  playAnimation = next;
}

/** Plays a combat clip on the dex preview model, if one is mounted. */
export function playCharacterPreviewAnimation(
  name: Parameters<PlayAnimation>[0],
  options?: Parameters<PlayAnimation>[1]
): Promise<void> {
  return playAnimation?.(name, options) ?? Promise.resolve();
}
