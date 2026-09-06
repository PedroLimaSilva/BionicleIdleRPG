import { ColorSpaceNode, SplitNode } from 'three/webgpu';

import {
  installTintSafeNodeLibrary,
  isTintSafeNodeLibraryInstalled,
  uninstallTintSafeNodeLibraryForTests,
} from './tintSafe';

function makeBuilder(assign = false) {
  return {
    context: { assign },
    format: (snippet: string) => snippet,
  };
}

function makeSplitNode(options: {
  components: string;
  outputType?: string;
  snippet: string;
  sourceType?: string;
}) {
  const node = Object.create(SplitNode.prototype) as {
    components: string;
    generate: (builder: ReturnType<typeof makeBuilder>) => string;
    getNodeType: () => string;
    node: { build: () => string; getNodeType: () => string };
  };
  node.components = options.components;
  node.getNodeType = () => options.outputType ?? 'float';
  node.node = {
    build: () => options.snippet,
    getNodeType: () => options.sourceType ?? 'vec4',
  };
  return node;
}

describe('installTintSafeNodeLibrary', () => {
  beforeEach(() => {
    uninstallTintSafeNodeLibraryForTests();
  });

  afterEach(() => {
    uninstallTintSafeNodeLibraryForTests();
  });

  it('does not patch SplitNode until install() is called', () => {
    expect(isTintSafeNodeLibraryInstalled()).toBe(false);
    expect(SplitNode.prototype.generate.name).not.toBe('generateTintSafeSplit');
    installTintSafeNodeLibrary();
    expect(SplitNode.prototype.generate.name).toBe('generateTintSafeSplit');
  });

  it('does not replace ColorSpaceNode.generate', () => {
    const before = ColorSpaceNode.prototype.generate;
    installTintSafeNodeLibrary();
    expect(ColorSpaceNode.prototype.generate).toBe(before);
  });

  it('extracts a single channel with dot() instead of a swizzle view', () => {
    installTintSafeNodeLibrary();
    const node = makeSplitNode({ components: 'a', snippet: 'sampleColor', sourceType: 'vec4' });

    const snippet = node.generate(makeBuilder(false));
    expect(snippet).toContain('dot(');
    expect(snippet).not.toMatch(/sampleColor\.a\b/);
  });

  it('keeps assignment targets as swizzle lvalues', () => {
    installTintSafeNodeLibrary();
    const node = makeSplitNode({ components: 'a', snippet: 'diffuseColor', sourceType: 'vec4' });

    expect(node.generate(makeBuilder(true))).toBe('diffuseColor.a');
  });

  it('rebuilds .rgb from independent dots without a swizzle view', () => {
    installTintSafeNodeLibrary();
    const node = makeSplitNode({
      components: 'rgb',
      outputType: 'vec3',
      snippet: 'texel',
      sourceType: 'vec4',
    });

    const snippet = node.generate(makeBuilder(false));
    expect(snippet.startsWith('vec3(')).toBe(true);
    expect(snippet).toContain('dot(');
    expect(snippet).not.toContain('texel.rgb');
    expect(snippet).not.toContain('texel.xyz');
  });

  it('pads vec3 sources instead of emitting vec4(vec3)', () => {
    installTintSafeNodeLibrary();
    const node = makeSplitNode({
      components: 'zyx',
      outputType: 'vec3',
      snippet: 'nodeVar1',
      sourceType: 'vec3',
    });

    const snippet = node.generate(makeBuilder(false));
    expect(snippet).toContain('vec4( nodeVar1, 1.0 )');
    expect(snippet).not.toMatch(/vec4\(\s*nodeVar1\s*\)/);
  });

  it('skips identity swizzles so vec3.xyz is not wrapped', () => {
    installTintSafeNodeLibrary();
    const node = makeSplitNode({
      components: 'xyz',
      outputType: 'vec3',
      snippet: 'nodeVar1',
      sourceType: 'vec3',
    });

    expect(node.generate(makeBuilder(false))).toBe('nodeVar1');
  });
});
