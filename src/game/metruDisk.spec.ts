import { ElementTribe } from '../types/Matoran';
import { getMetruDiskTemplateNode, METRU_DISK_TEMPLATE_BY_ELEMENT } from './metruDisk';

describe('metruDisk', () => {
  test('maps the six Metru tribes to disk template nodes', () => {
    expect(getMetruDiskTemplateNode(ElementTribe.Fire)).toBe('Disk.TaMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Water)).toBe('Disk.GaMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Air)).toBe('Disk.LeMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Ice)).toBe('Disk.KoMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Stone)).toBe('Disk.PoMetru');
    expect(getMetruDiskTemplateNode(ElementTribe.Earth)).toBe('Disk.OnuMetru');
  });

  test('has no disk for Light or Shadow', () => {
    expect(getMetruDiskTemplateNode(ElementTribe.Light)).toBeUndefined();
    expect(getMetruDiskTemplateNode(ElementTribe.Shadow)).toBeUndefined();
    expect(Object.keys(METRU_DISK_TEMPLATE_BY_ELEMENT)).toHaveLength(6);
  });
});
