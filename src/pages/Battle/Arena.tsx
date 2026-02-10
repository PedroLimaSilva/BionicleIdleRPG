import * as THREE from 'three';
import { useGLTF, OrthographicCamera, Stage } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import { Combatant } from '../../types/Combat';
import { CombatantModel, CombatantModelHandle } from './CombatantModel';
import { useEffect, useRef } from 'react';

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
  [-0.5, 0, 0.75],
  [0, 0, 0.5],
  [0.5, 0, 0.75],
];
const ENEMY_POSITIONS: [number, number, number][] = [
  [0, 0, -0.5],
  [-0.5, 0, -0.75],
  [0.5, 0, -0.75],
];

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
    <Stage shadows="contact">
      <group dispose={null}>
        <group name="Scene">
          <OrthographicCamera
            name="Camera"
            makeDefault={true}
            zoom={200}
            far={1000}
            near={0.1}
            position={[1.49, 2.11, 2.681]}
            rotation={[-0.632, 0.436, 0.3]}
          />
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
            position={[0, 0.025, 0.5]}
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
            position={[-0.5, 0.025, 0.75]}
          />
          <mesh
            name="PlaneTR"
            geometry={nodes.PlaneTR.geometry}
            material={materials.Places}
            position={[0.5, 0.025, 0.75]}
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
    </Stage>
  );
}

useGLTF.preload(import.meta.env.BASE_URL + '/arena.glb');
