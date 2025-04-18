import { useEffect, useRef } from 'react';
import { Group, Mesh, MeshStandardMaterial } from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { BaseMatoran, Mask, RecruitedCharacterData } from '../../types/Matoran';
import { Color, LegoColor } from '../../types/Colors';
import { GLTF } from 'three-stdlib';

type ActionName = 'Tahu Idle';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Body: THREE.Mesh;
    Masks: THREE.Group;
    Face: THREE.Mesh;
    Akaku: THREE.Mesh;
    Hau: THREE.Mesh;
    Huna: THREE.Mesh;
    Kakama: THREE.Mesh;
    Kaukau: THREE.Mesh;
    Komau: THREE.Mesh;
    Mahiki: THREE.Mesh;
    Matatu: THREE.Mesh;
    Miru: THREE.Mesh;
    Pakari: THREE.Mesh;
    Rau: THREE.Mesh;
    Ruru: THREE.Mesh;
  };
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial; // Mask
    PaletteMaterial002: THREE.MeshStandardMaterial;
    PaletteMaterial003: THREE.MeshStandardMaterial;
    PaletteMaterial004: THREE.MeshStandardMaterial;
    PaletteMaterial005: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

export function ToaTahuMataModel({
  matoran,
}: {
  matoran: RecruitedCharacterData & BaseMatoran;
}) {
  const group = useRef<Group>(null);
  const { nodes, animations, materials } = useGLTF(
    import.meta.env.BASE_URL + 'toa_tahu_mata.glb'
  ) as GLTFResult;

  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const idle = actions['Tahu Idle'];
    if (!idle) return;

    idle.reset().play();

    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions]);

  useEffect(() => {
    nodes.Masks.children.forEach((mask) => {
      const mesh = mask as Mesh;
      mesh.material = materials['Tahu Red'].clone();
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
