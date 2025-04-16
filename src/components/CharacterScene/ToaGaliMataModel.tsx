import { useEffect, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';

export function ToaGaliMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF(
    import.meta.env.BASE_URL + 'toa_gali_mata.glb'
  );
  useEffect(() => {
    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === Mask.Kaukau;
      console.log(mask.name, isTarget);
      if (isTarget) {
        const mesh = mask as Mesh;
        mesh.material = materials['Gali Mask'].clone();
        const mat = mesh.material as MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
    console.log(nodes.Kaukau, nodes.Hau);
  }, [nodes, materials]);

  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === maskTarget;
      mask.visible = isTarget;
    });
  }, [nodes, matoran, materials]);

  return (
    <group ref={group} dispose={null}>
      <group name='Scene'>
        <group name='Toa'>
          <primitive object={nodes.Body} />
        </group>
      </group>
    </group>
  );
}
