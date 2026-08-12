import { ElementTribe } from '../types/Matoran';
import { getMetruDiskTemplateNode, METRU_DISK_TEMPLATE_BY_ELEMENT } from './metruDisk';

describe('metruDisk', () => {
  test('maps the six Metru tribes to disk template nodes', () => {
    expect(getMetruDiskTemplateNode(ElementTribe.Fire)).toBe('DiskTaMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Water)).toBe('DiskGaMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Air)).toBe('DiskLeMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Ice)).toBe('DiskKoMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Stone)).toBe('DiskPoMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Earth)).toBe('DiskOnuMetru');
  });

  test('has no disk for Light or Shadow', () => {
    expect(getMetruDiskTemplateNode(ElementTribe.Light)).toBeUndefined();
    expect(getMetruDiskTemplateNode(ElementTribe.Shadow)).toBeUndefined();
    expect(Object.keys(METRU_DISK_TEMPLATE_BY_ELEMENT)).toHaveLength(6);
  });
});
