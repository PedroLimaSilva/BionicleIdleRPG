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
  /** Target height of the stone body (kit torso) in world units. */
  bodyHeight?: number;
  /** Target height of the stone head (kit Matoran face) in world units. */
  headHeight?: number;
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
 * A giant Toa/Matoran statue monument: a kit_2001 body + Matoran face ("mcface")
 * carved in sandstone, wearing a Kanohi mask from `masks.glb`. Reuses character
 * meshes per issue #366 to echo the desert reference more closely than a plain
 * pedestal. Each part is recolored, centered, and scaled to a target height.
 */
export function KanohiMonument({
  accent = '#2f6fb0',
  bodyHeight = 0.95,
  castShadow = false,
  headHeight = 0.5,
  maskHeight = 0.6,
  maskName = 'Hau',
  position,
  receiveShadow = false,
  rotationY = 0,
  stoneColor = '#c4b187',
}: KanohiMonumentProps) {
  const { scene: masksScene } = useGLTF(MASKS_GLB);
  const { scene: kitScene } = useGLTF(KIT_2001_GLB);

  const built = useMemo(() => {
    const opts = { accent, castShadow, receiveShadow, stoneColor };

    const torsoSrc = findMeshNode(kitScene, 'McTorso');
    const faceSrc = findMeshNode(kitScene, 'McToranFace');
    let maskSrc = findMeshNode(masksScene, maskName);
    if (!maskSrc) {
      masksScene.traverse((c) => {
        if (!maskSrc && (c as THREE.Mesh).isMesh) maskSrc = c;
      });
    }
    if (!maskSrc) return null;

    const slabHeight = 0.16;
    const body = torsoSrc ? makeStonePart(torsoSrc, bodyHeight, opts) : null;
    const head = faceSrc ? makeStonePart(faceSrc, headHeight, opts) : null;
    const mask = makeStonePart(maskSrc, maskHeight, { ...opts, isMask: true });

    let cursor = slabHeight;
    if (body) {
      body.group.position.set(0, cursor + body.size.y / 2, 0);
      cursor += body.size.y;
    }
    let headCenterY = cursor + headHeight / 2;
    if (head) {
      head.group.position.set(0, cursor + head.size.y / 2, 0);
      headCenterY = cursor + head.size.y / 2;
      cursor += head.size.y * 0.7; // mask overlaps the upper face
    }
    // The mask sits over the face, pushed slightly forward.
    mask.group.position.set(0, head ? headCenterY : cursor + maskHeight / 2, 0.12);

    const slabWidth = Math.max(0.7, (body?.size.x ?? 0.6) * 1.5);

    return { body, head, mask, slabHeight, slabWidth };
  }, [
    masksScene,
    kitScene,
    maskName,
    stoneColor,
    accent,
    bodyHeight,
    headHeight,
    maskHeight,
    castShadow,
    receiveShadow,
  ]);

  if (!built) return null;

  return (
    <group position={position} rotation-y={rotationY}>
      {/* Stone plinth */}
      <mesh
        position={[0, built.slabHeight / 2, 0]}
        castShadow={castShadow}
        receiveShadow={receiveShadow}
      >
        <boxGeometry args={[built.slabWidth, built.slabHeight, built.slabWidth * 0.8]} />
        <meshStandardMaterial color={stoneColor} roughness={1} metalness={0} />
      </mesh>
      {/* Tribe-colored accent band on the plinth */}
      <mesh position={[0, built.slabHeight + 0.005, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[built.slabWidth * 0.3, built.slabWidth * 0.42, 24]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={0.7}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {built.body && <primitive object={built.body.group} />}
      {built.head && <primitive object={built.head.group} />}
      <primitive object={built.mask.group} />
    </group>
  );
}

useGLTF.preload(KIT_2001_GLB);
