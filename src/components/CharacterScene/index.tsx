import { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Bounds, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Matoran } from '../../types/Matoran';
import { Mesh, MeshStandardMaterial } from 'three';
import { Color } from '../../types/Colors';

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

export function CharacterScene({ matoran }: { matoran: Matoran }) {
  const { nodes, materials } = useGLTF(
    import.meta.env.BASE_URL + 'matoran_master.glb'
  );
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
  }, [nodes, materials, matoran]);

  return (
    <Canvas camera={{ position: [0, 1.5, 15], fov: 50 }}>
      <Stage>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.2}>
            <primitive object={nodes.Body} scale={1} />
          </Bounds>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
          />
        </Suspense>
      </Stage>
    </Canvas>
  );
}
