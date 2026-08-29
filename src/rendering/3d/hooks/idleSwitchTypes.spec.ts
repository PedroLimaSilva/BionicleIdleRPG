import {
  idleTransitionKey,
  resolveIdleTransitionClip,
  type IdleSwitchConfig,
} from './idleSwitchTypes';

describe('idleSwitchTypes', () => {
  it('builds directed transition keys', () => {
    expect(idleTransitionKey('Idle Biped', 'Idle Quadruped')).toBe('Idle Biped->Idle Quadruped');
  });

  it('resolves configured transition clips', () => {
    const config: IdleSwitchConfig = {
      idles: [{ clip: 'Idle Biped' }, { clip: 'Idle Quadruped' }],
      transitions: {
        'Idle Biped->Idle Quadruped': 'Biped To Quadruped',
      },
    };

    expect(resolveIdleTransitionClip(config, 'Idle Biped', 'Idle Quadruped')).toBe(
      'Biped To Quadruped'
    );
    expect(resolveIdleTransitionClip(config, 'Idle Quadruped', 'Idle Biped')).toBeUndefined();
  });
});
