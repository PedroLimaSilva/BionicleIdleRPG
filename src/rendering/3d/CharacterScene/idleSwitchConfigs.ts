import { idleTransitionKey, type IdleSwitchConfig } from '../hooks/idleSwitchTypes';

/** Rebuilt Matoran ships `Idle` and `Idle.001` — crossfade only (no transition clip yet). */
export const REBUILT_IDLE_SWITCH: IdleSwitchConfig = {
  idles: [{ clip: 'Idle' }, { clip: 'Idle.001' }],
};

/**
 * Vahki rigs: biped patrol idle ↔ quadruped pursuit idle with limb reconfiguration clips.
 * Wire into `VahkiModel` once `vahki.glb` lands with these clip names.
 */
export const VAHKI_IDLE_SWITCH: IdleSwitchConfig = {
  idles: [{ clip: 'Idle Biped' }, { clip: 'Idle Quadruped' }],
  transitions: {
    [idleTransitionKey('Idle Biped', 'Idle Quadruped')]: 'Biped To Quadruped',
    [idleTransitionKey('Idle Quadruped', 'Idle Biped')]: 'Quadruped To Biped',
  },
};
