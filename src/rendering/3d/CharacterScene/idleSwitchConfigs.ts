import { idleTransitionKey, type IdleSwitchConfig } from '../hooks/idleSwitchTypes';

/** Rebuilt Matoran ships `Idle` and `Idle.001` — crossfade only (no transition clip yet). */
export const REBUILT_IDLE_SWITCH: IdleSwitchConfig = {
  idles: [{ clip: 'Idle' }, { clip: 'Idle.001' }],
};

/** Vahki: biped patrol idle ↔ quadruped pursuit idle with limb reconfiguration clips. */
export const VAHKI_IDLE_SWITCH: IdleSwitchConfig = {
  idles: [{ clip: 'Idle_Biped' }, { clip: 'Idle_Quadruped' }],
  transitions: {
    [idleTransitionKey('Idle_Biped', 'Idle_Quadruped')]: 'Switch_BQ',
    [idleTransitionKey('Idle_Quadruped', 'Idle_Biped')]: 'Switch_QB',
  },
};

/** Every clip name referenced by {@link VAHKI_IDLE_SWITCH}. */
export const VAHKI_IDLE_SWITCH_CLIP_NAMES = [
  'Idle_Biped',
  'Idle_Quadruped',
  'Switch_BQ',
  'Switch_QB',
] as const;
