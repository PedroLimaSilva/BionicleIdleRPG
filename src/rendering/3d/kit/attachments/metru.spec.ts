import { KIT_2003_MATERIAL_SLOTS } from '../nodes/kit2003MaterialSlots';
import { METRU_KIT_2003_HOLSTER_ATTACHMENTS } from './metru';

describe('METRU_KIT_2003_HOLSTER_ATTACHMENTS', () => {
  test('Pin3L holster tints the GLB Main slot (Metal was renamed)', () => {
    const colors = METRU_KIT_2003_HOLSTER_ATTACHMENTS.Pin3LWeapon_Holster.materialColors;
    for (const slot of KIT_2003_MATERIAL_SLOTS.Pin3L) {
      expect(colors?.[slot]).toBeDefined();
    }
  });
});
