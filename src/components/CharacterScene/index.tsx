import { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  Bounds,
  OrbitControls,
  Stage,
  useAnimations,
  useGLTF,
} from '@react-three/drei';
import { Matoran } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { Color } from '../../types/Colors';
import { useAnimationController } from '../../providers/useAnimationController';

const MAT_COLOR_MAP = {
  // Head: 'head',
  'Foot.L': 'feet',
  'Foot.R': 'feet',
  'Arm.L': 'arms',
  'Arm.R': 'arms',
  Torso: 'body',
  Mask: 'mask',
  Brain: 'eyes',
};

function Model({ matoran }: { matoran: Matoran }) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(
    import.meta.env.BASE_URL + 'matoran_master.glb'
  );
  const { actions, mixer } = useAnimations(animations, group);

  useAnimationController({
    mixer,
    idle: actions['IdleArms'],
    flavors: [actions['Tilt Head']].filter(Boolean),
  });

  useEffect(() => {
    const colorMap = matoran.colors;
    const applyColor = (materialName: string, color: Color) => {
      const mat = materials[materialName] as MeshStandardMaterial;
      if (mat && 'color' in mat) {
        mat.color.set(color);
        if (materialName === 'Brain') {
          mat.emissive.set(color);
        }
      }
    };

    Object.entries(MAT_COLOR_MAP).forEach(([materialName, colorName]) => {
      applyColor(
        materialName,
        colorMap[colorName as keyof Matoran['colors']] as Color
      );
    });

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === matoran.mask;
      mask.visible = isTarget;

      if (isTarget && matoran.isMaskTransparent && (mask as Mesh).isMesh) {
        const mesh = mask as Mesh;
        mesh.material = materials['Mask'].clone();
        const mat = mesh.material as MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
  }, [nodes, materials, matoran, actions]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Matoran'>
          <primitive object={nodes.Body} />
        </group>
      </group>
    </group>
  );
}

export function CharacterScene({ matoran }: { matoran: Matoran }) {
  return (
    <Stage>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Bounds fit clip observe margin={1.2}>
          <Model matoran={matoran} />
        </Bounds>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
        />
      </Suspense>
    </Stage>
  );
}
