/**
 * Jest stand-in for `three/webgpu`. Renderer/pipeline types are unused in unit tests.
 */
class BlendMode {}

class RenderPipeline {
  dispose() {}
  render() {}
}

class ColorSpaceNode {
  constructor() {
    this.colorNode = {
      build: () => 'tex',
      getNodeType: () => 'vec4',
      isWorkingColorSpaceFlow: true,
    };
    this.method = 'sRGB';
  }

  getMethod() {
    return this.method;
  }
}

ColorSpaceNode.prototype.generate = function generate() {
  return 'unpatched';
};

class SplitNode {}

SplitNode.prototype.generate = function generate() {
  return 'unpatched';
};

class WebGPURenderer {
  library = {
    fromMaterial(material) {
      return material;
    },
  };
  async init() {
    return this;
  }
}

class PMREMGenerator {
  fromEquirectangular() {
    return { texture: {} };
  }
  dispose() {}
}

module.exports = {
  BlendMode,
  ColorSpaceNode,
  PMREMGenerator,
  RenderPipeline,
  SplitNode,
  UnsignedByteType: 1009,
  WebGPURenderer,
  __esModule: true,
};
