/**
 * Jest stand-in for `three/tsl` and most `three/addons/*` imports.
 * Unit tests never compile shaders; they only construct materials, so a
 * chainable no-op node graph is enough. HDRLoader is a real class so
 * SceneHdriEnvironment can call `loadAsync` without hitting the node proxy.
 */
function createNode() {
  const fn = function () {
    return createNode();
  };
  return new Proxy(fn, {
    apply: function () {
      return createNode();
    },
    get: function (_target, prop) {
      if (prop === 'then') return undefined;
      if (prop === 'value') return { set: function () {} };
      return createNode();
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
