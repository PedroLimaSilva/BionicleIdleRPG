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

import { Wireframe } from '@react-three/drei';

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
      <meshBasicMaterial transparent opacity={0.5} depthWrite={false} />
      <Wireframe
        simplify={false} // Remove some edges from wireframes
        fill={'#00ff00'} // Color of the inside of the wireframe
        fillMix={0} // Mix between the base color and the Wireframe 'fill'. 0 = base; 1 = wireframe
        fillOpacity={0.05} // Opacity of the inner fill
        stroke={'#ff0000'} // Color of the stroke
        strokeOpacity={1} // Opacity of the stroke
        thickness={0.05} // Thinkness of the lines
        colorBackfaces={false} // Whether to draw lines that are facing away from the camera
        backfaceStroke={'#0000ff'} // Color of the lines that are facing away from the camera
        dashInvert={true} // Invert the dashes
        dash={false} // Whether to draw lines as dashes
        dashRepeats={4} // Number of dashes in one seqment
        dashLength={0.5} // Length of each dash
        squeeze={false} // Narrow the centers of each line segment
        squeezeMin={0.2} // Smallest width to squueze to
        squeezeMax={1} // Largest width to squeeze from
      />
    </mesh>
  );
}
