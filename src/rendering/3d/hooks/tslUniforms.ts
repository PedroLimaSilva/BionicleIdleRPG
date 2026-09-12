import { Color, ColorRepresentation } from 'three';
import { materialReference } from 'three/tsl';

type UniformInputNode = { value: unknown };

type MaterialRefNode = UniformInputNode & {
  getValueFromReference: (object?: unknown) => unknown;
  node?: UniformInputNode | null;
  updateValue: () => void;
};

function isColorLike(value: unknown): value is { b: number; g: number; r: number } {
  if (!value || typeof value !== 'object') return false;
  const color = value as { b?: unknown; g?: unknown; r?: unknown };
  return typeof color.r === 'number' && typeof color.g === 'number' && typeof color.b === 'number';
}

/**
 * Shared `materialReference` graphs also update for Three's shadow NodeMaterial,
 * which has empty userData. A missing color makes `NodeUniformsGroup.updateColor`
 * throw on `.r` and kills the frame. Nested paths throw earlier in
 * `getValueFromReference` when a parent object is missing.
 */
export function safeMaterialColorRef(path: string) {
  const node = materialReference(path, 'color') as unknown as MaterialRefNode;
  const fallback = new Color(0, 0, 0);
  try {
    const previousGet = node.getValueFromReference.bind(node);
    node.getValueFromReference = function getValueFromReference(...args: unknown[]) {
      try {
        const value = previousGet(...args);
        return isColorLike(value) ? value : fallback;
      } catch {
        return fallback;
      }
    };
    const previousUpdate = node.updateValue.bind(node);
    node.updateValue = function updateValue() {
      try {
        previousUpdate();
      } catch {
        // Nested userData paths throw when the parent object is missing.
      }
      if (!isColorLike(this.node?.value)) {
        if (this.node) this.node.value = fallback;
      }
    };
  } catch {
    // Jest TSL mock: only `.value` is writable.
  }
  return node;
}

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
