import { SplitNode } from 'three/webgpu';

/**
 * Chrome WebGPU on Apple Silicon compiles WGSL through Tint → MSL.
 * Three's node library emits `snippet.xyz` / `snippet.rgb` swizzle *views*
 * of live temporaries. Tint then fails with:
 *
 *   swizzle view instruction still has usages after lowering
 *
 * MeshStandardMaterial compiles through MeshStandardNodeMaterial even
 * without maps, so this hits untextured kit parts as well as leftover
 * GLB materials. ColorSpaceNode in this Three version has no `generate()`
 * — it uses `setup()`, and `.rgb` already goes through SplitNode.
 *
 * Do not wrap named varyings (`positionLocal`) in `toVar()` — that
 * produces undeclared identifiers. Assignment targets must keep a
 * swizzle lvalue (`diffuseColor.a = …`), never `dot(…) = …`.
 *
 * WGSL has no `vec4(vec3)` constructor. Pad shorter sources:
 * `vec4( snippet, 1.0 )` for vec3.
 */

interface TintSafeNodeBuilder {
  context: { assign?: boolean };
  format: (snippet: string, type: string, output?: string) => string;
}

interface TintSafeSplitNode {
  node: {
    build: (builder: TintSafeNodeBuilder, type?: string) => string;
    getNodeType?: (builder: TintSafeNodeBuilder) => string;
  };
  components: string;
  getNodeType: (builder: TintSafeNodeBuilder) => string;
}

type SplitNodeCtor = {
  prototype: { generate: (builder: TintSafeNodeBuilder, output?: string) => string };
};

const CHANNEL_MASKS: Record<string, string> = {
  a: 'vec4( 0.0, 0.0, 0.0, 1.0 )',
  b: 'vec4( 0.0, 0.0, 1.0, 0.0 )',
  g: 'vec4( 0.0, 1.0, 0.0, 0.0 )',
  r: 'vec4( 1.0, 0.0, 0.0, 0.0 )',
  w: 'vec4( 0.0, 0.0, 0.0, 1.0 )',
  x: 'vec4( 1.0, 0.0, 0.0, 0.0 )',
  y: 'vec4( 0.0, 1.0, 0.0, 0.0 )',
  z: 'vec4( 0.0, 0.0, 1.0, 0.0 )',
};

let installed = false;
let originalSplitGenerate: SplitNodeCtor['prototype']['generate'] | undefined;

function typeLength(type: string | undefined): number {
  if (!type) return 4;
  if (type === 'color') return 3;
  const match = /[234]/.exec(type);
  return match ? Number(match[0]) : 1;
}

function isIdentitySwizzle(components: string, sourceLength: number): boolean {
  if (components.length !== sourceLength) return false;
  const xyzw = 'xyzw'.slice(0, sourceLength);
  const rgba = 'rgba'.slice(0, sourceLength);
  return components === xyzw || components === rgba;
}

/** WGSL forbids `vec4(vec3)`. Pad missing components instead of wrapping. */
function packAsVec4(snippet: string, sourceType: string | undefined): string {
  const length = typeLength(sourceType);
  if (length >= 4) {
    return snippet;
  }
  if (length === 3) {
    return `vec4( ${snippet}, 1.0 )`;
  }
  if (length === 2) {
    return `vec4( ${snippet}, 0.0, 1.0 )`;
  }
  return `vec4( vec3( ${snippet} ), 1.0 )`;
}

function extractComponent(
  snippet: string,
  component: string,
  sourceType: string | undefined
): string {
  const mask = CHANNEL_MASKS[component];
  if (!mask) {
    return `${snippet}.${component}`;
  }
  return `dot( ${packAsVec4(snippet, sourceType)}, ${mask} )`;
}

function swizzleAsVector(
  snippet: string,
  components: string,
  vectorType: string,
  sourceType: string | undefined
): string {
  const packed = packAsVec4(snippet, sourceType);
  const dots = Array.from(components, (component) => {
    const mask = CHANNEL_MASKS[component];
    return mask ? `dot( ${packed}, ${mask} )` : `${snippet}.${component}`;
  });
  while (dots.length < 2) {
    dots.push('0.0');
  }
  return `${vectorType}( ${dots.join(', ')} )`;
}

function generateTintSafeSplit(
  this: TintSafeSplitNode,
  builder: TintSafeNodeBuilder,
  output?: string
): string {
  const { components, node } = this;

  if (components.length === 0) {
    return node.build(builder);
  }

  // Assignment targets must remain lvalues (`diffuseColor.a = …`).
  if (builder.context.assign) {
    const nodeSnippet = node.build(builder);
    return builder.format(`${nodeSnippet}.${components}`, this.getNodeType(builder), output);
  }

  const sourceType = node.getNodeType?.(builder);
  const sourceLength = typeLength(sourceType);

  if (sourceLength <= 1) {
    return node.build(builder, output);
  }

  if (isIdentitySwizzle(components, sourceLength)) {
    return builder.format(node.build(builder), sourceType ?? this.getNodeType(builder), output);
  }

  const nodeSnippet = node.build(builder);

  if (components.length === 1) {
    return builder.format(
      extractComponent(nodeSnippet, components, sourceType),
      this.getNodeType(builder),
      output
    );
  }

  const vectorType = this.getNodeType(builder);
  return builder.format(
    swizzleAsVector(nodeSnippet, components, vectorType, sourceType),
    vectorType,
    output
  );
}

export function installTintSafeNodeLibrary(): void {
  if (installed) {
    return;
  }

  const splitCtor = SplitNode as unknown as SplitNodeCtor;
  originalSplitGenerate = splitCtor.prototype.generate;
  splitCtor.prototype.generate = generateTintSafeSplit;
  installed = true;
}

export function isTintSafeNodeLibraryInstalled(): boolean {
  return installed;
}

/** Test-only: restore Three's original generators. */
export function uninstallTintSafeNodeLibraryForTests(): void {
  if (!installed) {
    return;
  }
  const splitCtor = SplitNode as unknown as SplitNodeCtor;
  if (originalSplitGenerate) {
    splitCtor.prototype.generate = originalSplitGenerate;
  }
  installed = false;
}
