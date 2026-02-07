/**
 * An invisible cylinder mesh that defines a fixed bounding volume for
 * the Stage camera-fit algorithm. Sized to encompass the largest
 * character (Toa Mata) in its idle pose so that camera framing stays
 * consistent regardless of which character is displayed.
 *
 * Because the cylinder is always larger than (or equal to) every
 * character's actual geometry, the Stage Bounds component will always
 * produce the same bounding box → same camera zoom/position.
 */

// Cylinder dimensions matching the largest character's idle-pose envelope.
// Adjust these if new, larger characters are added.
const CYLINDER_RADIUS = 7;
const CYLINDER_HEIGHT = 20;

export function BoundsCylinder() {
  return (
    <mesh position={[0, CYLINDER_HEIGHT / 2, 0]}>
      <cylinderGeometry
        args={[CYLINDER_RADIUS, CYLINDER_RADIUS, CYLINDER_HEIGHT, 16]}
      />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}
