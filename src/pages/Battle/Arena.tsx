import * as THREE from 'three';
import { useGLTF, Environment } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Combatant } from '../../types/Combat';
import { CombatantModel, CombatantModelHandle } from './CombatantModel';
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

type GLTFResult = GLTF & {
  nodes: {
    Ground: THREE.Mesh;
    PlaneEM: THREE.Mesh;
    PlaneTM: THREE.Mesh;
    PlaneEL: THREE.Mesh;
    PlaneER: THREE.Mesh;
    PlaneTL: THREE.Mesh;
    PlaneTR: THREE.Mesh;
  };
  materials: {
    Ground: THREE.MeshStandardMaterial;
    Places: THREE.MeshStandardMaterial;
  };
};

interface ArenaProps {
  team: Combatant[];
  enemies: Combatant[];
}

const TEAM_POSITIONS: [number, number, number][] = [
  [-0.5, -0.5, 0.75],
  [0, -0.5, 0.5],
  [0.5, -0.5, 0.75],
];
const ENEMY_POSITIONS: [number, number, number][] = [
  [0, 0, -0.5],
  [-0.5, 0, -0.75],
  [0.5, 0, -0.75],
];

/** World-size of the arena box used for orthographic framing. */
const ARENA_BOX_SIZE = 2;
/** Multiplier > 1 zooms out to add margin around the arena. */
const ARENA_MARGIN = 1.5;
/** Arena center (camera looks at this). */
const ARENA_CENTER: [number, number, number] = [0, -0.25, 0];

/**
 * Camera above the arena looking down. In portrait (width < height) uses a
 * front view so team/enemies stack vertically (team bottom, enemies top).
 * In landscape uses an angled view (team bottom-left, enemies top-right).
 */
function ArenaFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (camera.type !== 'OrthographicCamera') return;

    if (size.width <= 0 || size.height <= 0) return;

    const [cx, cy, cz] = ARENA_CENTER;
    const d = ARENA_BOX_SIZE;
    const isPortrait = size.width < size.height;

    if (isPortrait) {
      // Angled from the front: small x-offset so not head-on. Team (pos z) → bottom, enemies (neg z) → top.
      camera.position.set(cx + d * 0.35, cy + d * 0.8, cz + d * 1.2);
    } else {
      // Angled view: team bottom-left, enemies top-right
      camera.position.set(cx + d * 0.75, cy + d * 0.5, cz + d * 0.75);
    }
    camera.lookAt(cx, cy, cz);
    camera.near = 0.1;
    camera.far = 1000;

    // Portrait: fit height so vertical extent is primary; landscape: fit the tighter dimension
    const zoom = isPortrait
      ? size.height / (ARENA_BOX_SIZE * ARENA_MARGIN)
      : Math.min(
          size.width / (ARENA_BOX_SIZE * ARENA_MARGIN),
          size.height / (ARENA_BOX_SIZE * ARENA_MARGIN)
        );
    camera.zoom = zoom;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export function Arena({ team, enemies }: ArenaProps) {
  const combatantRefs = useRef<Record<string, CombatantModelHandle>>({});

  const { nodes, materials } = useGLTF(
    import.meta.env.BASE_URL + '/arena.glb'
  ) as unknown as GLTFResult;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).combatantRefs = combatantRefs.current;
  }, [team, enemies]);
  return (
    <group dispose={null}>
      <ArenaFraming />
      <Environment preset="city" />
      <directionalLight position={[3, 5, 2]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <ambientLight intensity={0.2} />
      <group name="Scene">
        {/* <mesh
            name='Ground'
            geometry={nodes.Ground.geometry}
            material={materials.Ground}
          /> */}
        <mesh
          name="PlaneEM"
          geometry={nodes.PlaneEM.geometry}
          material={materials.Places}
          position={[0, 0.025, -0.5]}
        />
        <mesh
          name="PlaneTM"
          geometry={nodes.PlaneTM.geometry}
          material={materials.Places}
          position={[0, -0.075, 0.5]}
        />
        <mesh
          name="PlaneEL"
          geometry={nodes.PlaneEL.geometry}
          material={materials.Places}
          position={[-0.5, 0.025, -0.75]}
        />
        <mesh
          name="PlaneER"
          geometry={nodes.PlaneER.geometry}
          material={materials.Places}
          position={[0.5, 0.025, -0.75]}
        />
        <mesh
          name="PlaneTL"
          geometry={nodes.PlaneTL.geometry}
          material={materials.Places}
          position={[-0.5, -0.075, 0.75]}
        />
        <mesh
          name="PlaneTR"
          geometry={nodes.PlaneTR.geometry}
          material={materials.Places}
          position={[0.5, -0.075, 0.75]}
        />

        {team.map((c, i) => (
          <CombatantModel
            key={c.id}
            combatant={c}
            side="team"
            position={TEAM_POSITIONS[i]}
            ref={(ref) => {
              if (ref) combatantRefs.current[c.id] = ref;
            }}
          />
        ))}

        {enemies.map((c, i) => {
          return (
            <CombatantModel
              key={c.id}
              combatant={c}
              side="enemy"
              position={ENEMY_POSITIONS[i]}
              ref={(ref) => {
                if (ref) combatantRefs.current[c.id] = ref;
              }}
            />
          );
        })}
      </group>
    </group>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + '/arena.glb');
