import { KIT_2003_NODES } from './kit2003Nodes';
import { KIT_2001_NODES } from './kit2001Nodes';
import { KIT_2004_NODES } from './kit2004Nodes';
import {
  countKitNodeReferences,
  getKit2001NodeUsageRanking,
  getKit2003NodeUsageRanking,
  getUnusedKit2001NodeNames,
  getUnusedKit2003NodeNames,
  getUnusedKit2004NodeNames,
  getUsedKit2001NodeNames,
  getUsedKit2003NodeNames,
  getUsedKit2004NodeNames,
  KIT_2001_ATTACHMENT_MAPS,
} from './collectKitNodeUsage';

describe('kit nodes', () => {
  test('every registered 2001 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2001NodeNames()).toEqual([]);
  });

  test('every registered 2003 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2003NodeNames()).toEqual([]);
  });

  test('every registered 2004 node is referenced by an attachment or exempt list', () => {
    expect(getUnusedKit2004NodeNames()).toEqual([]);
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

    const registered2004 = new Set(Object.values(KIT_2004_NODES));
    for (const name of getUsedKit2004NodeNames()) {
      expect(registered2004.has(name)).toBe(true);
    }
  });

  test('usage ranking counts socket references per kit node', () => {
    const socketUses = countKitNodeReferences(KIT_2001_ATTACHMENT_MAPS).get(KIT_2001_NODES.Socket);
    expect(socketUses).toBeGreaterThan(10);

    const ranking = getKit2001NodeUsageRanking();
    expect(ranking[0]?.count).toBeGreaterThanOrEqual(ranking[1]?.count ?? 0);
    expect(ranking.some((row) => row.glbName === KIT_2001_NODES.Socket)).toBe(true);
  });

  test('2003 ranking includes heavily reused Bohrok pieces', () => {
    const ranking = getKit2003NodeUsageRanking();
    const bohrokArm = ranking.find((row) => row.glbName === KIT_2003_NODES.BohrokArm);
    expect(bohrokArm?.count).toBeGreaterThan(2);
  });
});
