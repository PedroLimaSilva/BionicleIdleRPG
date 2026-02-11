import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { EffectComposer, SSAO, SelectiveBloom } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { Mesh, MeshStandardMaterial, Object3D, OrthographicCamera } from 'three';

import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../types/Matoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { ToaGaliMataModel } from './ToaGaliMataModel';
import { ToaPohatuMataModel } from './ToaPohatuMataModel';
import { ToaKopakaMataModel } from './ToaKopakaMataModel';
import { ToaOnuaMataModel } from './ToaOnuaMataModel';
import { ToaLewaMataModel } from './ToaLewaMataModel';
import { ToaNuvaPlaceholderModel } from './ToaNuvaPlaceholderModel';
import { CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';
import { ToaTahuMataModel } from './ToaTahuMataModel';
import { ToaTahuNuvaModel } from './Nuva/TahuNuvaModel';

function CharacterModel({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  switch (matoran.stage) {
    case MatoranStage.ToaMata:
      switch (matoran.id) {
        case 'Toa_Gali':
          return <ToaGaliMataModel matoran={matoran} />;
        case 'Toa_Pohatu':
          return (
            <group position={[0, 6.4, 0]}>
              <ToaPohatuMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Kopaka':
          return (
            <group position={[0, 6.9, 0]}>
              <ToaKopakaMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Onua':
          return (
            <group position={[0, 7, 0]}>
              <ToaOnuaMataModel matoran={matoran} />
            </group>
          );
        case 'Toa_Lewa':
          return (
            <group position={[0, 7, 0]}>
              <ToaLewaMataModel matoran={matoran} />
            </group>
          );
        default:
          return <ToaTahuMataModel matoran={matoran} />;
      }
    case MatoranStage.ToaNuva:
      switch (matoran.id) {
        case 'Toa_Gali':
          return <ToaGaliMataModel matoran={matoran} />;
        case 'Toa_Tahu':
          return <ToaTahuNuvaModel matoran={matoran} />;
        default:
          return <ToaNuvaPlaceholderModel matoran={matoran} />;
      }
    case MatoranStage.Diminished:
    default:
      return <DiminishedMatoranModel matoran={matoran} />;
  }
}

/** Names that identify eye/glowing-eye/lens meshes in Matoran and Toa GLTFs (mesh or material). */
export const EYE_MESH_NAMES = ['Brain', 'Eye', 'glow', 'lens'];

function isEyeMesh(mesh: Mesh): boolean {
  const name = (mesh.name || '').toLowerCase();
  const matName = ((mesh.material as { name?: string })?.name ?? '').toLowerCase();
  return EYE_MESH_NAMES.some(
    (eye) => name.includes(eye.toLowerCase()) || matName.includes(eye.toLowerCase())
  );
}

/** Collects only eye meshes (by name) that have emissive material, for selective bloom */
function useEyeMeshes(
  characterRootRef: React.RefObject<Object3D | null>,
  matoran: BaseMatoran & RecruitedCharacterData
) {
  const [eyeMeshes, setEyeMeshes] = useState<Object3D[]>([]);

  useLayoutEffect(() => {
    const root = characterRootRef.current;
    if (!root) {
      setEyeMeshes([]);
      return;
    }
    const collect = () => {
      const collected: Object3D[] = [];
      root.traverse((obj) => {
        if (!(obj as Mesh).isMesh) return;
        const mesh = obj as Mesh;
        const mat = mesh.material as MeshStandardMaterial | undefined;
        if (mat && (mat.emissiveIntensity ?? 0) > 0 && isEyeMesh(mesh)) {
          collected.push(mesh);
        }
      });
      setEyeMeshes(collected);
    };
    const id = setTimeout(collect, 0);
    return () => clearTimeout(id);
  }, [matoran, characterRootRef]);

  return eyeMeshes;
}

/**
 * Positions the shared orthographic camera so it looks head-on at the
 * cylinder volume defined in BoundsCylinder.  Zoom is set so the
 * cylinder just fits the viewport – whichever dimension is tighter
 * (width or height) wins.
 *
 * Runs once on mount and again whenever the viewport is resized.
 */
function CharacterFraming() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;

    // Skip when container has no layout yet (e.g. hidden via CSS).
    // OrthographicCamera.updateProjectionMatrix() divides by zoom internally;
    // zoom=0 causes division by zero → Infinity/NaN in projection matrix.
    if (size.width <= 0 || size.height <= 0) return;

    // Look head-on from the front, vertically centered on the cylinder
    camera.position.set(0, CYLINDER_HEIGHT / 2, 100);
    camera.lookAt(0, CYLINDER_HEIGHT / 2, 0);
    camera.near = 0.1;
    camera.far = 1000;

    // Zoom so the cylinder just fits the viewport
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export function CharacterScene({ matoran }: { matoran: BaseMatoran & RecruitedCharacterData }) {
  const characterRootRef = useRef<Object3D>(null);
  const [lightsForBloom, setLightsForBloom] = useState<Object3D[]>([]);
  const eyeMeshes = useEyeMeshes(characterRootRef, matoran);

  return (
    <>
      <CharacterFraming />
      <Environment preset="city" />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[3, 5, 2]}
        intensity={1.2}
      />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[-3, 2, -2]}
        intensity={0.4}
      />
      <ambientLight intensity={0.2} />
      <group ref={characterRootRef}>
        <PresentationControls
          global={true}
          snap={false}
          speed={2}
          zoom={1}
          polar={[0, 0]}
          config={{ mass: 0.5, tension: 170, friction: 26 }}
        >
          <Suspense fallback={null}>
            <CharacterModel matoran={matoran} />
          </Suspense>
        </PresentationControls>
      </group>
      <EffectComposer multisampling={0} enableNormalPass resolutionScale={0.5}>
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={24}
          rings={4}
          intensity={1.0}
          radius={6}
          bias={0.5}
          luminanceInfluence={0.35}
        />
        {lightsForBloom.length > 0 ? (
          <SelectiveBloom
            selection={eyeMeshes}
            lights={lightsForBloom}
            luminanceThreshold={0.25}
            luminanceSmoothing={0.5}
            intensity={0.28}
            mipmapBlur
          />
        ) : (
          <></>
        )}
      </EffectComposer>
    </>
  );
}
