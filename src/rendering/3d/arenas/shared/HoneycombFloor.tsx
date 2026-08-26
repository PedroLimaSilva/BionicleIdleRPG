import { useEffect, useMemo } from 'react';
import { createHoneycombFloorMap } from './honeycombFloorMap';

interface HoneycombFloorProps {
  position?: [number, number, number];
  radius?: number;
  receiveShadow: boolean;
  stoneColor: string;
  /** Honeycomb UV repeat — higher values yield smaller hex cells. */
  tileRepeat?: number;
}

/** Flat combat floor with a tileable procedural honeycomb stone pattern. */
export function HoneycombFloor({
  position = [0, 0, 0],
  radius = 10,
  receiveShadow,
  stoneColor,
  tileRepeat,
}: HoneycombFloorProps) {
  const floorMap = useMemo(
    () => createHoneycombFloorMap(stoneColor, tileRepeat),
    [stoneColor, tileRepeat]
  );

  useEffect(() => {
    return () => {
      floorMap.dispose();
    };
  }, [floorMap]);

  return (
    <mesh position={position} rotation-x={-Math.PI / 2} receiveShadow={receiveShadow}>
      <circleGeometry args={[radius, 40]} />
      <meshStandardMaterial map={floorMap} color="#ffffff" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}
