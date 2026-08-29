import { MatoranStage } from '../../types/Matoran';
import {
  CUSTOM_SELECTABLE_METRU_MODEL_IDS,
  CUSTOM_SELECTABLE_NUVA_MODEL_IDS,
  DEFAULT_CUSTOM_METRU_MODEL_ID,
  DEFAULT_CUSTOM_NUVA_MODEL_ID,
  getCustomToaArmorFamily,
  getDefaultCustomToaModelIdForStage,
  getStageForCustomToaModelId,
  isValidCustomToaModelId,
  resolveCustomToaBuildId,
} from './customToaBuild';
import { DEFAULT_CUSTOM_MATA_MODEL_ID } from './customMataBuild';

describe('customToaBuild', () => {
  test('maps build ids to armor families and stages', () => {
    expect(getCustomToaArmorFamily('Toa_Gali')).toBe('mata');
    expect(getCustomToaArmorFamily('Toa_Gali_Nuva')).toBe('nuva');
    expect(getCustomToaArmorFamily('Toa_Vakama')).toBe('metru');
    expect(getStageForCustomToaModelId('Toa_Lewa_Nuva')).toBe(MatoranStage.ToaNuva);
    expect(getStageForCustomToaModelId('Toa_Whenua')).toBe(MatoranStage.ToaMetru);
  });

  test('validates selectable Toa model ids', () => {
    expect(isValidCustomToaModelId('Toa_Tahu')).toBe(true);
    expect(isValidCustomToaModelId('Toa_Tahu_Nuva')).toBe(true);
    expect(isValidCustomToaModelId('Toa_Matau')).toBe(true);
    expect(isValidCustomToaModelId('Vakama')).toBe(false);
  });

  test('resolveCustomToaBuildId uses dex id for canon characters', () => {
    expect(resolveCustomToaBuildId({ id: 'Toa_Gali' })).toBe('Toa_Gali');
    expect(resolveCustomToaBuildId({ id: 'Toa_Gali_Nuva', stage: MatoranStage.ToaNuva })).toBe(
      'Toa_Gali_Nuva'
    );
  });

  test('resolveCustomToaBuildId falls back for custom characters', () => {
    expect(resolveCustomToaBuildId({ id: 'custom_0', stage: MatoranStage.ToaMata })).toBe(
      DEFAULT_CUSTOM_MATA_MODEL_ID
    );
    expect(
      resolveCustomToaBuildId({
        customMataModelId: 'Toa_Lewa',
        id: 'custom_0',
        stage: MatoranStage.ToaMata,
      })
    ).toBe('Toa_Lewa');
    expect(
      resolveCustomToaBuildId({
        id: 'custom_0',
        stage: MatoranStage.ToaNuva,
      })
    ).toBe(DEFAULT_CUSTOM_NUVA_MODEL_ID);
    expect(
      resolveCustomToaBuildId({
        id: 'custom_0',
        stage: MatoranStage.ToaMetru,
      })
    ).toBe(DEFAULT_CUSTOM_METRU_MODEL_ID);
  });

  test('defaults per Toa stage', () => {
    expect(getDefaultCustomToaModelIdForStage(MatoranStage.ToaMata)).toBe(
      DEFAULT_CUSTOM_MATA_MODEL_ID
    );
    expect(getDefaultCustomToaModelIdForStage(MatoranStage.ToaNuva)).toBe(
      CUSTOM_SELECTABLE_NUVA_MODEL_IDS[0]
    );
    expect(getDefaultCustomToaModelIdForStage(MatoranStage.ToaMetru)).toBe(
      CUSTOM_SELECTABLE_METRU_MODEL_IDS[0]
    );
  });
});
