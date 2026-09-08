const { BufferAttribute, BufferGeometry } = require('three');

/** Jest stub for three/examples/jsm/utils/BufferGeometryUtils.js */
function mergeGeometries(geometries) {
  if (!geometries.length) return null;

  const merged = new BufferGeometry();
  const positions = [];
  for (const geometry of geometries) {
    const attr = geometry.getAttribute('position');
    if (!attr) continue;
    for (let i = 0; i < attr.count; i++) {
      positions.push(attr.getX(i), attr.getY(i), attr.getZ(i));
    }
  }
  merged.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  return merged;
}

module.exports = { mergeGeometries };
