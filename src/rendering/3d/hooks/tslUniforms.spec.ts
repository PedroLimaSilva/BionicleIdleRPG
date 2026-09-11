import { Color } from 'three';
import { setUniformColor, setUniformNumber } from './tslUniforms';

describe('setUniformColor', () => {
  test('updates a Three.js Color uniform in place', () => {
    const uniformNode = { value: new Color(0xffffff) };
    setUniformColor(uniformNode, '#ff0000');
    expect((uniformNode.value as Color).getHex()).toBe(0xff0000);
  });

  test('updates plain {r,g,b} objects without a .set method', () => {
    const plain = { b: 1, g: 1, r: 1 };
    const uniformNode = { value: plain };
    setUniformColor(uniformNode, 0x000000);
    expect(plain.r).toBe(0);
    expect(plain.g).toBe(0);
    expect(plain.b).toBe(0);
    expect(uniformNode.value).toBe(plain);
  });

  test('replaces unknown uniform values with a Color', () => {
    const uniformNode: { value: unknown } = { value: null };
    setUniformColor(uniformNode, '#336699');
    expect(uniformNode.value).toBeInstanceOf(Color);
    expect((uniformNode.value as Color).getHex()).toBe(0x336699);
  });
});

describe('setUniformNumber', () => {
  test('writes scalar uniform values', () => {
    const uniformNode = { value: 0 };
    setUniformNumber(uniformNode, 1.25);
    expect(uniformNode.value).toBe(1.25);
  });
});
