import { useEffect, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';

export function ToaOnuaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes, materials } = useGLTF(import.meta.env.BASE_URL + 'toa_onua_mata.glb');


  useEffect(() => {
    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === Mask.Kaukau;
      if (isTarget) {
        const mesh = mask as Mesh;
        mesh.material = materials['Onua Mask'].clone();
        const mat = mesh.material as MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
  }, [nodes, materials]);


  useEffect(() => {
    const maskTarget = matoran.maskOverride || matoran.mask;

    nodes.Masks.children.forEach((mask) => {
      const isTarget = mask.name === maskTarget;
      mask.visible = isTarget;
    });
  }, [nodes, matoran]);

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
