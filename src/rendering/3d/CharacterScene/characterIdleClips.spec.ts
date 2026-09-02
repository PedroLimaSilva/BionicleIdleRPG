import {
  getRequiredIdleClips,
  RIG_INVENTORY,
  COMBAT_PREVIEW_CLIPS,
} from './characterAnimationInventory';
import { VAHKI_IDLE_SWITCH_CLIP_NAMES } from './idleSwitchConfigs';
import { readGlbClipNames } from './glbClipUtils';

describe('character rig idle clips', () => {
  test.each(Object.entries(getRequiredIdleClips()))('%s exposes a "%s" clip', (glb, clipName) => {
    expect(readGlbClipNames(glb)).toContain(clipName);
  });

  test('Toa Lhikan drives his idle through the shared pipeline, not a bespoke clip name', () => {
    expect(readGlbClipNames('Toa_Metru/Lhikan.glb')).toEqual(['Idle']);
  });

  test('Vahki.glb exposes every idle-switch clip', () => {
    const clips = readGlbClipNames('Vahki.glb');
    for (const name of VAHKI_IDLE_SWITCH_CLIP_NAMES) {
      expect(clips).toContain(name);
    }
  });
});

describe('character animation inventory', () => {
  test('inventory includes every shipped combat GLB used in CharacterScene', () => {
    const glbs = RIG_INVENTORY.map((rig) => rig.glb).filter(Boolean);
    expect(glbs).toContain('Toa_Metru/Matau.glb');
    expect(glbs).toContain('Toa_Metru/Nuju.glb');
  });

  test('combat rigs with shipped Attack also ship Hit when marked complete in inventory', () => {
    for (const rig of RIG_INVENTORY) {
      if (!rig.glb || rig.role === 'village' || rig.role === 'placeholder') continue;

      const shipped = readGlbClipNames(rig.glb);
      const attack = rig.expectedClips.find((clip) => clip.name === 'Attack');
      const hit = rig.expectedClips.find((clip) => clip.name === 'Hit');

      if (attack?.backlog === 'complete' && hit?.backlog === 'complete') {
        expect(shipped).toEqual(expect.arrayContaining(['Attack', 'Hit']));
      }
    }
  });

  test('Character Dex preview contract lists combat clips', () => {
    expect(COMBAT_PREVIEW_CLIPS).toEqual(['Attack', 'Hit', 'Defeat']);
  });
});
