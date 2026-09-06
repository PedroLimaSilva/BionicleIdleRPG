/**
 * Jest stand-in for `three/tsl` and most `three/addons/*` imports.
 * Unit tests never compile shaders; they only construct materials, so a
 * chainable no-op node graph is enough. HDRLoader is a real class so
 * SceneHdriEnvironment can call `loadAsync` without hitting the node proxy.
 *
 * `uniform(initial)` keeps `initial` on `.value` so tests can assert CPU-side
 * discoloration / PBR uniforms without compiling WGSL.
 */
function createNode(initialValue) {
  const fn = function () {
    return createNode();
  };
  let currentValue = initialValue !== undefined ? initialValue : { set: function () {} };
  return new Proxy(fn, {
    apply: function (_target, _thisArg, args) {
      return createNode(args.length > 0 ? args[0] : undefined);
    },
    get: function (_target, prop) {
      if (prop === 'then') return undefined;
      if (prop === 'value') return currentValue;
      return createNode();
    },
    set: function (_target, prop, next) {
      if (prop === 'value') {
        currentValue = next;
        return true;
      }
      return false;
    },
  });
}

class HDRLoader {
  loadAsync() {
    return Promise.resolve({ mapping: 303 });
  }
}

module.exports = new Proxy(
  { HDRLoader, __esModule: true },
  {
    get: function (target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'HDRLoader') return target.HDRLoader;
      return createNode();
    },
  }
);
