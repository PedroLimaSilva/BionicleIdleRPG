import { useEffect, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { Color, LegoColor } from '../../types/Colors';

export function ToaLewaMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes, materials, animations } = useGLTF(
    import.meta.env.BASE_URL + 'toa_lewa_mata.glb'
  );

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions['Idle'];
    if (!idle) return;

    idle.reset().play();

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    nodes.Masks.children.forEach((mask) => {
      const mesh = mask as Mesh;
      mesh.material = materials['Lewa Green02'].clone();
      const mat = mesh.material as MeshStandardMaterial;
      mat.color.set(
        (matoran.maskColorOverride || matoran.colors.mask) as Color
      );
      mat.metalness =
        matoran.maskColorOverride === LegoColor.PearlGold ? 0.5 : 0;
      if (mask.name === Mask.Kaukau) {
        mat.transparent = true;
        mat.opacity = 0.8;
      }
    });
  }, [nodes, materials, matoran]);

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
