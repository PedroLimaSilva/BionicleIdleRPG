import { Bone, Material, Mesh, Object3D, SkinnedMesh } from 'three';

function parallelTraverse(
  source: Object3D,
  cloned: Object3D,
  visit: (sourceNode: Object3D, clonedNode: Object3D) => void
): void {
  visit(source, cloned);
  for (let i = 0; i < source.children.length; i++) {
    parallelTraverse(source.children[i], cloned.children[i], visit);
  }
}

function cloneMaterials(material: Material | Material[]): Material | Material[] {
  return Array.isArray(material) ? material.map((entry) => entry.clone()) : material.clone();
}

/**
 * Instance a shared GLTF root the way `SkeletonUtils.clone` does, then clone
 * mesh materials. `Object3D.clone(true)` keeps the source skeleton and
 * materials, so gauntlet Rahkshi (one `rahkshi.glb` rig, many combatants)
 * would all pose and tint as one.
 */
export function cloneGltfInstance(source: Object3D): Object3D {
  const cloned = source.clone(true);
  const sourceOfClone = new Map<Object3D, Object3D>();
  const cloneOfSource = new Map<Object3D, Object3D>();

  parallelTraverse(source, cloned, (sourceNode, clonedNode) => {
    sourceOfClone.set(clonedNode, sourceNode);
    cloneOfSource.set(sourceNode, clonedNode);
  });

  cloned.traverse((node) => {
    const mesh = node as Mesh;
    if (mesh.isMesh && mesh.material) {
      mesh.material = cloneMaterials(mesh.material);
    }

    const skinned = node as SkinnedMesh;
    if (!skinned.isSkinnedMesh || !skinned.skeleton) return;

    const sourceMesh = sourceOfClone.get(node) as SkinnedMesh;
    skinned.skeleton = sourceMesh.skeleton.clone();
    skinned.bindMatrix.copy(sourceMesh.bindMatrix);
    skinned.skeleton.bones = sourceMesh.skeleton.bones.map((bone) => {
      const clonedBone = cloneOfSource.get(bone);
      if (!clonedBone) {
        throw new Error(`cloneGltfInstance: missing cloned bone "${bone.name}"`);
      }
      return clonedBone as Bone;
    });
    skinned.bind(skinned.skeleton, skinned.bindMatrix);
  });

  return cloned;
}
