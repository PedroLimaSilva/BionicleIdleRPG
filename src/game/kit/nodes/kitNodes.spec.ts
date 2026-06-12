import { KIT_2003_NODES } from './kit2003Nodes';
import { KIT_2001_NODES } from './kit2001Nodes';
import {
  getUnusedKit2001NodeNames,
  getUnusedKit2003NodeNames,
  getUsedKit2001NodeNames,
  getUsedKit2003NodeNames,
} from './collectKitNodeUsage';

describe('kit nodes', () => {
  test('every registered 2001 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2001NodeNames()).toEqual([]);
  });

  test('every registered 2003 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2003NodeNames()).toEqual([]);
  });

  test('attachment kitNodeName values are registered constants', () => {
    const registered2001 = new Set(Object.values(KIT_2001_NODES));
    for (const name of getUsedKit2001NodeNames()) {
      expect(registered2001.has(name)).toBe(true);
    }

    const registered2003 = new Set(Object.values(KIT_2003_NODES));
    for (const name of getUsedKit2003NodeNames()) {
      expect(registered2003.has(name)).toBe(true);
    }
  });
});
