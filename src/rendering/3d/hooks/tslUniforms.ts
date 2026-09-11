import { Color, ColorRepresentation } from 'three';

type UniformInputNode = { value: unknown };

/**
 * Updates a TSL uniform color node. WebGPU runtimes (notably iOS Safari) can
 * replace the initial Color instance with a plain {r,g,b} object that has no
 * .set(), which breaks direct uniformColor(node).value.set(...) calls.
 */
export function setUniformColor(uniformNode: UniformInputNode, color: ColorRepresentation): void {
  const next = new Color(color);
  const current = uniformNode.value;

  if (current instanceof Color) {
    current.copy(next);
    return;
  }

  if (current && typeof current === 'object') {
    const maybeColor = current as Color & { r?: number; g?: number; b?: number };
    if (typeof maybeColor.set === 'function') {
      maybeColor.set(color);
      return;
    }
    if (
      typeof maybeColor.r === 'number' &&
      typeof maybeColor.g === 'number' &&
      typeof maybeColor.b === 'number'
    ) {
      maybeColor.r = next.r;
      maybeColor.g = next.g;
      maybeColor.b = next.b;
      return;
    }
  }

  uniformNode.value = next;
}

export function setUniformNumber(uniformNode: UniformInputNode, value: number): void {
  uniformNode.value = value;
}
