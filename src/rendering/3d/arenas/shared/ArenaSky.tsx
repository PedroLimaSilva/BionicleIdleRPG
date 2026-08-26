import * as THREE from 'three';
import { useMemo } from 'react';

interface ArenaSkyProps {
  /** Color at the top of the dome (zenith). */
  top: string;
  /** Color at the horizon / bottom. */
  bottom: string;
  /** Sphere radius — large for open skies, small for cavern enclosures. */
  radius?: number;
}

/**
 * A backside-culled sky/enclosure sphere: the camera sits inside and only sees
 * the interior. A vertical vertex-color gradient gives a blue daytime sky for
 * open biomes or a dark interior for underground caverns. Fog is disabled so the
 * sky reads through the scene haze (issue #366).
 */
export function ArenaSky({ bottom, radius = 60, top }: ArenaSkyProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.SphereGeometry(radius, 32, 20);
    const position = geo.attributes.position;
    const topColor = new THREE.Color(top);
    const bottomColor = new THREE.Color(bottom);
    const color = new THREE.Color();
    const colors: number[] = [];
    for (let i = 0; i < position.count; i++) {
      const h = THREE.MathUtils.clamp(position.getY(i) / radius / 2 + 0.5, 0, 1);
      color.copy(bottomColor).lerp(topColor, Math.pow(h, 0.7));
      colors.push(color.r, color.g, color.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return geo;
  }, [radius, top, bottom]);

  return (
    <mesh renderOrder={-1} frustumCulled={false}>
      <primitive object={geometry} attach="geometry" />
      <meshBasicMaterial
        vertexColors
        side={THREE.BackSide}
        fog={false}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
