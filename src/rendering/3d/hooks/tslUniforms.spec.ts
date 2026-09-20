import { Color, Texture } from 'three';
import {
  installSafeTextureMaterialRefFallback,
  safeMaterialColorRef,
  setUniformColor,
  setUniformNumber,
} from './tslUniforms';

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

describe('safeMaterialColorRef', () => {
  test('builds a color material reference without throwing', () => {
    expect(() => safeMaterialColorRef('userData.discolorationColor')).not.toThrow();
  });
});

describe('installSafeTextureMaterialRefFallback', () => {
  test('plants the dummy when the referenced material has no map', () => {
    const fallback = new Texture();
    const node = {
      getValueFromReference: () => undefined,
      node: { value: null as unknown },
      updateValue() {
        this.node.value = this.getValueFromReference();
      },
      value: null as unknown,
    };
    installSafeTextureMaterialRefFallback(node, fallback);
    node.updateValue();
    expect(node.node.value).toBe(fallback);
  });

  test('keeps a real bake texture', () => {
    const bake = new Texture();
    const fallback = new Texture();
    const node = {
      getValueFromReference: () => bake,
      node: { value: null as unknown },
      updateValue() {
        this.node.value = this.getValueFromReference();
      },
      value: null as unknown,
    };
    installSafeTextureMaterialRefFallback(node, fallback);
    node.updateValue();
    expect(node.node.value).toBe(bake);
  });

  test('survives getValueFromReference throwing on a shadow NodeMaterial', () => {
    const fallback = new Texture();
    const node = {
      getValueFromReference: () => {
        throw new TypeError('Cannot read properties of null');
      },
      node: { value: null as unknown },
      updateValue() {
        this.node.value = this.getValueFromReference();
      },
      value: null as unknown,
    };
    installSafeTextureMaterialRefFallback(node, fallback);
    expect(() => node.updateValue()).not.toThrow();
    expect(node.node.value).toBe(fallback);
  });
});
