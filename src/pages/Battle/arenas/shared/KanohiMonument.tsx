import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

const MASKS_GLB = import.meta.env.BASE_URL + 'masks.glb';
const KIT_2001_GLB = import.meta.env.BASE_URL + 'kit_2001.glb';

interface KanohiMonumentProps {
  /** Mask node name in `masks.glb` (e.g. 'Hau', 'Kaukau'). */
  maskName?: string;
  position: [number, number, number];
  rotationY?: number;
  /** Target height of the carved mask in world units. */
  maskHeight?: number;
  /** Target height of the stone Matoran head in world units. */
  headHeight?: number;
  /** Height of the stone plinth column in world units. */
  pedestalHeight?: number;
  receiveShadow?: boolean;
  castShadow?: boolean;
  /** Sandstone color for the carved figure. */
  stoneColor?: string;
  /** Accent color for inlaid lines / eyes ("glow" materials) and the base band. */
  accent?: string;
}

type StandardMat = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

function isStandardMat(mat: unknown): mat is StandardMat {
  return mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial;
}

function findMeshNode(root: THREE.Object3D, name: string): THREE.Object3D | undefined {
  let found: THREE.Object3D | undefined;
  root.traverse((child) => {
    if (!found && child.name === name && (child as THREE.Mesh).isMesh) found = child;
  });
  return found;
}

interface StonePartOptions {
  stoneColor: string;
  accent: string;
  /** Carved mask: keep glow materials as accent emissive; everything else stone. */
  isMask?: boolean;
  castShadow: boolean;
  receiveShadow: boolean;
}

/**
 * Clone a mesh node, recolor it to sandstone (with accent emissive on "glow"
 * materials), reset its transform, then center it on the origin and scale it to
 * `targetHeight`. Returns a wrapper group plus its scaled footprint.
 */
function makeStonePart(
  source: THREE.Object3D,
  targetHeight: number,
  { accent, castShadow, isMask, receiveShadow, stoneColor }: StonePartOptions
): { group: THREE.Group; size: THREE.Vector3 } {
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
    if (!isStandardMat(mat)) return;
    const m = mat.clone();
    const isGlow = m.name.toLowerCase().includes('glow');
    if (isMask && isGlow) {
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
  });

  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const scale = size.y > 0 ? targetHeight / size.y : 1;

  clone.position.sub(center);
  const group = new THREE.Group();
  group.add(clone);
  group.scale.setScalar(scale);
  return { group, size: size.multiplyScalar(scale) };
}

/**
 * A giant carved Kanohi monument: a sandstone Matoran head (kit_2001
 * `McToranFace`) wearing a Kanohi mask from `masks.glb`, on a stone plinth.
 * Reuses character meshes per issue #366 to echo the desert reference. Each part
 * is recolored, centered, and scaled to a target height.
 */
export function KanohiMonument({
  accent = '#2f6fb0',
  castShadow = false,
  headHeight = 1.1,
  maskHeight = 1.15,
  maskName = 'Hau',
  pedestalHeight = 1.1,
  position,
  receiveShadow = false,
  rotationY = 0,
  stoneColor = '#c4b187',
}: KanohiMonumentProps) {
  const { scene: masksScene } = useGLTF(MASKS_GLB);
  const { scene: kitScene } = useGLTF(KIT_2001_GLB);

  const built = useMemo(() => {
    const opts = { accent, castShadow, receiveShadow, stoneColor };

    const headSrc = findMeshNode(kitScene, 'McToranFace');
    let maskSrc = findMeshNode(masksScene, maskName);
    if (!maskSrc) {
      masksScene.traverse((c) => {
        if (!maskSrc && (c as THREE.Mesh).isMesh) maskSrc = c;
      });
    }
    if (!maskSrc) return null;

    const head = headSrc ? makeStonePart(headSrc, headHeight, opts) : null;
    const mask = makeStonePart(maskSrc, maskHeight, { ...opts, isMask: true });

    const headSize = head?.size.y ?? headHeight;
    if (head) head.group.position.set(0, pedestalHeight + headSize / 2, 0);
    // The mask sits over the front of the head.
    mask.group.position.set(0, pedestalHeight + headSize * 0.5, 0.12);

    const plinthWidth = Math.max(0.55, (head?.size.x ?? 0.6) * 1.15);

    return { head, mask, plinthWidth };
  }, [
    masksScene,
    kitScene,
    maskName,
    stoneColor,
    accent,
    headHeight,
    maskHeight,
    pedestalHeight,
    castShadow,
    receiveShadow,
  ]);

  if (!built) return null;

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Stone plinth column */}
      <mesh
        position={[0, pedestalHeight / 2, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      >
        <boxGeometry args={[built.plinthWidth, pedestalHeight, built.plinthWidth * 0.85]} />
        <meshStandardMaterial color={stoneColor} roughness={1} metalness={0} />
      </mesh>
      {/* Wider base slab */}
      <mesh position={[0, 0.08, 0]} castShadow={castShadow} receiveShadow={receiveShadow}>
        <boxGeometry args={[built.plinthWidth * 1.5, 0.16, built.plinthWidth * 1.3]} />
        <meshStandardMaterial color={stoneColor} roughness={1} metalness={0} />
      </mesh>
      {/* Tribe-colored accent band atop the plinth */}
      <mesh position={[0, pedestalHeight + 0.005, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[built.plinthWidth * 0.32, built.plinthWidth * 0.46, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {built.head && <primitive object={built.head.group} />}
      <primitive object={built.mask.group} />
    </group>
  );
}

useGLTF.preload(KIT_2001_GLB);
