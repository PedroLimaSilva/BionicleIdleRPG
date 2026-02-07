export function BoundingBox() {
  return (
    <group name='BoundingBox'>
      <mesh visible position={[0, 10, 0]}>
        <boxGeometry args={[10, 10, 1]} />
        <meshBasicMaterial color='hotpink' opacity={0} transparent />
      </mesh>
    </group>
  );
}
