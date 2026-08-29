import { Suspense, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { Environment, PresentationControls } from '@react-three/drei';
import { ModelInteractionDetector, ModelInteractionProvider } from '../ModelInteractionContext';
import { useThree } from '@react-three/fiber';
import { EffectComposer, SSAO } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { DirectionalLight, Mesh, Object3D } from 'three';

import { useSettings } from '../../../context/useSettings';
import { CITY_ENVIRONMENT_PROPS } from '../utils/cityEnvironmentHdri';
import { shouldEnableSelectiveBloom, shouldEnableShadows } from '../../../utils/testMode';
import { CYLINDER_CENTER_Y, CYLINDER_HEIGHT, CYLINDER_RADIUS } from './BoundsCylinder';

import { BaseMatoran, MatoranStage, RecruitedCharacterData } from '../../../types/Matoran';
import { CombatantModelHandle } from '../../../pages/Battle/CombatantModel';
import { registerCharacterPreviewPlay } from '../utils/characterPreviewControls';
import { resolveCustomToaBuildId } from '../customToaBuild';
import { usesNujuToaMetruRig } from '../metruMatoran';
import { DiminishedMatoranModel } from './DiminishedMatoranModel';
import { RebuiltMatoranModel } from './RebuiltMatoranModel';
import { MetruMatoranModel } from './MetruMatoranModel';
import { GaliMataModel } from './Mata/GaliMataModel';
import { PohatuMataModel } from './Mata/PohatuMataModel';
import { KopakaMataModel } from './Mata/KopakaMataModel';
import { OnuaMataModel } from './Mata/OnuaMataModel';
import { LewaMataModel } from './Mata/LewaMataModel';
import { TahuMataModel } from './Mata/TahuMataModel';
import { TahuNuvaModel } from './Nuva/TahuNuvaModel';
import { GaliNuvaModel } from './Nuva/GaliNuvaModel';
import { BohrokModel } from './BohrokModel';
import { VahkiModel } from './VahkiModel';
import { useCharacterBloomMeshes } from './selectiveBloom';
import { StableSelectiveBloom } from './StableSelectiveBloom';
import { OnuaNuvaModel } from './Nuva/OnuaNuvaModel';
import { PohatuNuvaModel } from './Nuva/PohatuNuvaModel';
import { LewaNuvaModel } from './Nuva/LewaNuvaModel';
import { KopakaNuvaModel } from './Nuva/KopakaNuvaModel';
import { TakanuvaModel } from './Nuva/TakanuvaModel';
import { LhikanModel } from './Metru/LhikanModel';
import { MatauModel } from './Metru/MatauModel';
import { NujuModel } from './Metru/NujuModel';
import { NokamaModel } from './Metru/NokamaModel';
import { OnewaModel } from './Metru/OnewaModel';
import { VakamaModel } from './Metru/VakamaModel';
import { WhenuaModel } from './Metru/WhenuaModel';

/** Vertical center of the character framing volume. */
const CHARACTER_CENTER_Y = CYLINDER_CENTER_Y;

/** Scale down environment map contribution so IBL doesn't wash out shadows. */
function EnvironmentIntensity({ value }: { value: number }) {
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (scene as any).environmentIntensity = value;
  }, [scene, value]);
  return null;
}

export type CharacterSceneMatoran = BaseMatoran &
  RecruitedCharacterData & {
    maskPowerActive?: boolean;
    unlockAllMasks?: boolean;
  };

const CharacterModel = forwardRef<
  CombatantModelHandle,
  {
    matoran: CharacterSceneMatoran;
    /**
     * Fires once after the concrete model has mounted (and again when the
     * character identity changes in place). CharacterModel lives inside the
     * `<Suspense>` boundary, so this `useEffect` only runs after the model's
     * GLB has resolved and its own children's effects (e.g. weathered-metal
     * material application) have fired — children-first ordering guarantees
     * materials are up to date before we ask for a bloom rescan. Gali also
     * fires this from `useKitAttachments`'s `onAttached` so the post-kit
     * glow meshes are picked up.
     */
    onModelReady?: () => void;
  }
>(function CharacterModel({ matoran, onModelReady }, ref) {
  useEffect(() => {
    onModelReady?.();
  }, [matoran.customMataModelId, matoran.id, matoran.stage, onModelReady]);

  switch (matoran.stage) {
    case MatoranStage.ToaMata: {
      const buildId = resolveCustomToaBuildId(matoran);
      switch (buildId) {
        case 'Toa_Gali':
          return <GaliMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Pohatu':
          return <PohatuMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Kopaka':
          return <KopakaMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Onua':
          return <OnuaMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Lewa':
          return <LewaMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        default:
          return <TahuMataModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
      }
    }
    case MatoranStage.ToaNuva: {
      const buildId = resolveCustomToaBuildId(matoran);
      switch (buildId) {
        case 'Takanuva':
          return <TakanuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Kopaka_Nuva':
          return <KopakaNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Lewa_Nuva':
          return <LewaNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Pohatu_Nuva':
          return <PohatuNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Onua_Nuva':
          return <OnuaNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Gali_Nuva':
          return <GaliNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Tahu_Nuva':
          return <TahuNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        default:
          return <TahuNuvaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
      }
    }
    case MatoranStage.Bohrok:
    case MatoranStage.BohrokKal:
      return (
        <group scale={4.5}>
          <BohrokModel ref={ref} key={matoran.id} id={matoran.id} />
        </group>
      );
    case MatoranStage.Vahki:
      // Bind pose faces +Z (battle forward). Character-sheet camera looks from +Z, so yaw 180°.
      return (
        <group rotation={[0, Math.PI, 0]}>
          <VahkiModel
            ref={ref}
            key={matoran.id}
            id={matoran.id}
            onKitMeshesAttached={onModelReady}
          />
        </group>
      );
    case MatoranStage.Diminished:
      return <DiminishedMatoranModel matoran={matoran} onKitMeshesAttached={onModelReady} />;
    case MatoranStage.Rebuilt:
      return <RebuiltMatoranModel matoran={matoran} onKitMeshesAttached={onModelReady} />;
    case MatoranStage.ToaMetru: {
      const buildId = resolveCustomToaBuildId(matoran);
      if (usesNujuToaMetruRig(buildId)) {
        return <NujuModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
      }
      switch (buildId) {
        case 'Toa_Matau':
          return <MatauModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Nuju':
          return <NujuModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Nokama':
          return <NokamaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Onewa':
          return <OnewaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Vakama':
          return <VakamaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Whenua':
          return <WhenuaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        case 'Toa_Lhikan':
          return <LhikanModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
        default:
          return <VakamaModel ref={ref} matoran={matoran} onKitMeshesAttached={onModelReady} />;
      }
    }
    case MatoranStage.Metru:
      return (
        <MetruMatoranModel key={matoran.id} matoran={matoran} onKitMeshesAttached={onModelReady} />
      );
    default:
      return <DiminishedMatoranModel matoran={matoran} onKitMeshesAttached={onModelReady} />;
  }
});

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
    if (camera.type !== 'OrthographicCamera') return;

    // Skip when container has no layout yet (e.g. hidden via CSS).
    // OrthographicCamera.updateProjectionMatrix() divides by zoom internally;
    // zoom=0 causes division by zero → Infinity/NaN in projection matrix.
    if (size.width <= 0 || size.height <= 0) return;

    // Look head-on from the front, same world-space aim for every model
    camera.position.set(0, CYLINDER_CENTER_Y, 100);
    camera.lookAt(0, CYLINDER_CENTER_Y, 0);
    camera.near = 0.1;
    camera.far = 1000;

    // Zoom so the cylinder just fits the viewport
    camera.zoom = Math.min(size.width / (CYLINDER_RADIUS * 2), size.height / CYLINDER_HEIGHT);
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

export function CharacterScene({
  enablePreviewControls = false,
  matoran,
}: {
  enablePreviewControls?: boolean;
  matoran: CharacterSceneMatoran;
}) {
  const characterRootRef = useRef<Object3D>(null);
  const modelRef = useRef<CombatantModelHandle>(null);
  const [lightsForBloom, setLightsForBloom] = useState<Object3D[]>([]);
  // Bumped by CharacterModel's post-mount effect (all models) and by
  // useKitAttachments.onAttached (Gali specifically). Each bump triggers a
  // fresh bloom-mesh collection; the initial collection on mount may see an
  // empty tree while Suspense resolves, so a deterministic post-mount bump is
  // required for non-kit models.
  const [bloomRecollectionRevision, setBloomRecollectionRevision] = useState(0);
  const bumpBloomRecollection = useCallback(() => setBloomRecollectionRevision((n) => n + 1), []);
  const bloomMeshes = useCharacterBloomMeshes(characterRootRef, matoran, bloomRecollectionRevision);
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();
  useEffect(() => {
    if (!effectiveShadows || !characterRootRef.current) return;
    const applyShadowProps = () => {
      characterRootRef.current?.traverse((child) => {
        if ((child as Mesh).isMesh) {
          const mesh = child as Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    };
    applyShadowProps();
    const t = setTimeout(applyShadowProps, 500);
    return () => clearTimeout(t);
  }, [effectiveShadows, matoran]);

  useEffect(() => {
    if (!enablePreviewControls) return;
    registerCharacterPreviewPlay(async (name, options) => {
      const play = modelRef.current?.playAnimation;
      if (play) return play(name, options);
    });
    return () => registerCharacterPreviewPlay(null);
  }, [enablePreviewControls, matoran.id]);

  const setMainLightRef = (el: DirectionalLight | null) => {
    if (el) {
      setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
      el.target.position.set(0, CHARACTER_CENTER_Y, 0);
      if (el.parent && !el.target.parent) {
        el.parent.add(el.target);
      }
    }
  };

  return (
    <>
      <CharacterFraming />
      <Environment {...CITY_ENVIRONMENT_PROPS} />
      <EnvironmentIntensity value={0.4} />
      <directionalLight
        ref={setMainLightRef}
        position={[3, CHARACTER_CENTER_Y + 8, 10]}
        intensity={1.2}
        castShadow={effectiveShadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-CYLINDER_RADIUS * 2}
        shadow-camera-right={CYLINDER_RADIUS * 2}
        shadow-camera-top={CYLINDER_HEIGHT * 0.75}
        shadow-camera-bottom={-CYLINDER_HEIGHT * 0.75}
        shadow-bias={-0.0005}
        shadow-normalBias={0.01}
      />
      <directionalLight
        ref={(el) => {
          if (el) setLightsForBloom((prev) => (prev.includes(el) ? prev : [...prev, el]));
        }}
        position={[-3, CHARACTER_CENTER_Y + 2, -2]}
        intensity={0.15}
      />
      <ambientLight intensity={0.05} />
      {effectiveShadows && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[CYLINDER_RADIUS * 3, CYLINDER_RADIUS * 3]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      )}
      <group ref={characterRootRef}>
        <ModelInteractionProvider>
          <ModelInteractionDetector />
          <PresentationControls global={true} snap={false} speed={2} zoom={1} polar={[0, 0]}>
            <Suspense fallback={null}>
              <CharacterModel
                ref={modelRef}
                matoran={matoran}
                onModelReady={bumpBloomRecollection}
              />
            </Suspense>
          </PresentationControls>
        </ModelInteractionProvider>
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
        {lightsForBloom.length > 0 && shouldEnableSelectiveBloom() ? (
          <StableSelectiveBloom
            selection={bloomMeshes}
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
