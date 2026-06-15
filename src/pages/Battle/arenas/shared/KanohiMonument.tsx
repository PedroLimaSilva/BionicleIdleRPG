import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const MASKS_GLB = import.meta.env.BASE_URL + 'masks.glb';

interface KanohiMonumentProps {
  /** Mask node name in `masks.glb` (e.g. 'Hau', 'Kaukau'). */
  maskName?: string;
  position: [number, number, number];
  rotationY?: number;
  /** Target height of the carved mask in world units. */
  maskHeight?: number;
  /** Pedestal height in world units. */
  pedestalHeight?: number;
  /** Pedestal half-width in world units. */
  pedestalRadius?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
  /** Sandstone color for the carved mask + pedestal. */
  stoneColor?: string;
  /** Accent color for inlaid lines / eyes ("glow" materials). */
  accent?: string;
}

type StandardMat = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial;
}

/**
 * A giant carved Kanohi mask monument on a stone pedestal, reusing a mask mesh
 * from `masks.glb` (per issue #366: "a lot of the meshes can be reused from the
 * character models"). The mask is cloned, recolored to sandstone with an
 * element accent, and normalized to a target height so any Kanohi fits.
 */
export function KanohiMonument({
  accent = '#2f6fb0',
  castShadow = false,
  maskHeight = 1.5,
  maskName = 'Hau',
  pedestalHeight = 0.9,
  pedestalRadius = 0.42,
  position,
  receiveShadow = false,
  rotationY = 0,
  stoneColor = '#c8a26a',
}: KanohiMonumentProps) {
  const { scene } = useGLTF(MASKS_GLB);

  const mask = useMemo(() => {
    let source: THREE.Object3D | undefined;
    scene.traverse((child) => {
      if (!source && child.name === maskName && (child as THREE.Mesh).isMesh) {
        source = child;
      }
    });
    // Fallback: first mesh in the file if the named node is missing.
    if (!source) {
      scene.traverse((child) => {
        if (!source && (child as THREE.Mesh).isMesh) source = child;
      });
    }
    if (!source) return null;

    const clone = source.clone(true);
    clone.position.set(0, 0, 0);
    clone.rotation.set(0, 0, 0);
    clone.scale.set(1, 1, 1);

    const stone = new THREE.Color(stoneColor);
    const accentColor = new THREE.Color(accent);
    clone.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      const mat = mesh.material;
      if (isStandardMat(mat)) {
        const m = mat.clone();
        const isGlow = m.name.toLowerCase().includes('glow');
        if (isGlow) {
          m.color = accentColor.clone();
          m.emissive = accentColor.clone();
          m.emissiveIntensity = 1.6;
        } else {
          m.color = stone.clone();
          m.roughness = 0.95;
          m.metalness = 0;
          if (m.emissive) m.emissive = new THREE.Color(0x000000);
        }
        m.transparent = false;
        m.opacity = 1;
        mesh.material = m;
      }
    });

    // Normalize: center on origin then scale to the requested height.
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scaleFactor = size.y > 0 ? maskHeight / size.y : 1;

    const wrapper = new THREE.Group();
    clone.position.sub(center); // center at origin
    wrapper.add(clone);
    wrapper.scale.setScalar(scaleFactor);
    return wrapper;
  }, [scene, maskName, stoneColor, accent, maskHeight, castShadow, receiveShadow]);

  if (!mask) return null;

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Base slab */}
      <mesh
        position={[0, pedestalHeight * 0.08, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      >
        <boxGeometry args={[pedestalRadius * 2.4, pedestalHeight * 0.16, pedestalRadius * 2.4]} />
        <meshStandardMaterial color={stoneColor} roughness={1} metalness={0} />
      </mesh>
      {/* Pillar */}
      <mesh
        position={[0, pedestalHeight * 0.55, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      >
        <boxGeometry args={[pedestalRadius * 1.6, pedestalHeight * 0.9, pedestalRadius * 1.2]} />
        <meshStandardMaterial color={stoneColor} roughness={1} metalness={0} />
      </mesh>
      {/* Tribe-colored accent band where the mask meets the pillar */}
      <mesh position={[0, pedestalHeight - 0.02, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[pedestalRadius * 0.7, pedestalRadius * 1.0, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Carved mask, base resting on top of the pillar */}
      <primitive object={mask} position={[0, pedestalHeight + maskHeight / 2, 0]} />
    </group>
  );
}
