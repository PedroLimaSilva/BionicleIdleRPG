import { Combatant } from '../../types/Combat';
import { BohrokModel } from '../../rendering/3d/CharacterScene/BohrokModel';
import { RahkshiModel } from '../../rendering/3d/CharacterScene/Rahkshi';
import { KopakaMataModel } from '../../rendering/3d/CharacterScene/Mata/KopakaMataModel';
import { CHARACTER_DEX } from '../../data/dex/index';
import { Euler } from '@react-three/fiber';
import { TahuMataModel } from '../../rendering/3d/CharacterScene/Mata/TahuMataModel';
import { PohatuMataModel } from '../../rendering/3d/CharacterScene/Mata/PohatuMataModel';
import { OnuaMataModel } from '../../rendering/3d/CharacterScene/Mata/OnuaMataModel';
import { LewaMataModel } from '../../rendering/3d/CharacterScene/Mata/LewaMataModel';
import { GaliMataModel } from '../../rendering/3d/CharacterScene/Mata/GaliMataModel';
import { TahuNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/TahuNuvaModel';
import { GaliNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/GaliNuvaModel';
import { KopakaNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/KopakaNuvaModel';
import { LewaNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/LewaNuvaModel';
import { OnuaNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/OnuaNuvaModel';
import { PohatuNuvaModel } from '../../rendering/3d/CharacterScene/Nuva/PohatuNuvaModel';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Material, Mesh } from 'three';
import { disposeObject3DResources } from '../../rendering/3d/utils/disposeThreeObject';
import { KraataPower } from '../../types/Kraata';
import { TakanuvaModel } from '../../rendering/3d/CharacterScene/Nuva/TakanuvaModel';
import { LhikanModel } from '../../rendering/3d/CharacterScene/Metru/LhikanModel';
import { MatauModel } from '../../rendering/3d/CharacterScene/Metru/MatauModel';
import { NujuModel } from '../../rendering/3d/CharacterScene/Metru/NujuModel';
import { VakamaModel } from '../../rendering/3d/CharacterScene/Metru/VakamaModel';
import { WhenuaModel } from '../../rendering/3d/CharacterScene/Metru/WhenuaModel';
import { usesNujuToaMetruRig } from '../../rendering/3d/metruMatoran';
import { RahiPlaceholderModel } from '../../rendering/3d/CharacterScene/RahiPlaceholderModel';
import { NuiRamaModel } from '../../rendering/3d/CharacterScene/NuiRamaModel';
import { WorldSpaceHpBar } from './WorldSpaceHpBar';
import { DEFEAT_SINK_DURATION_SEC } from '../../rendering/3d/battleOutcomeVisualDelay';
import { battleSpeedProgress } from '../../utils/battleSpeed';

const ROTATION_RESTORE_DURATION = 0.25;
const DEFEAT_SINK_DEPTH = 0.55;

/** `useGLTF` template meshes (Toa, etc.) must not dispose shared geometry; clones (enemies) may. */
function canDisposeBattleModelGeometry(model: string): boolean {
  return (
    model === 'bohrok' ||
    model === 'rahkshi' ||
    model === 'rahi_placeholder' ||
    model === 'nui_rama'
  );
}

/** World-space Y offset for the floating HP bar, tuned per model family. */
function hpBarYOffset(model: string): number {
  switch (model) {
    case 'bohrok':
      return 0.6;
    case 'rahkshi':
      return 0.2;
    case 'rahi_placeholder':
      return 0.35;
    case 'nui_rama':
      return 0.38;
    default:
      return -0.1;
  }
}

/** Linear interpolation between two angles, taking the shortest path. */
function lerpAngle(from: number, to: number, t: number): number {
  let diff = to - from;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return from + diff * t;
}

interface CombatantModelProps {
  combatant: Combatant;
  position: [number, number, number];
  side: 'enemy' | 'team';
  /** When true, the caster's mask power is active (effect applied to targets) */
  maskPowerActive?: boolean;
}

export interface PlayAnimationOptions {
  /** When set, combatant rotates to face this target during the animation, then restores original orientation. */
  faceTargetId?: string;
  /** Internal: called when animation fully ends (used when CombatantModel calls child for Attack). */
  onAnimationComplete?: () => void;
}

export interface CombatantModelHandle {
  playAnimation: (
    name: 'Attack' | 'Hit' | 'Defeat' | 'Idle',
    options?: PlayAnimationOptions
  ) => Promise<void>;
  /** Resolves when the most recent Attack clip fully finishes (after contact frame). Only present on the outer CombatantModel wrapper, not inner model components. */
  waitForAttackComplete?: () => Promise<void>;
}

/** Compute Y rotation (radians) to face target from self position. Model +Z axis rotates to point at target. */
function getFacingRotation(
  selfPos: [number, number, number],
  targetPos: [number, number, number]
): number {
  const dx = targetPos[0] - selfPos[0];
  const dz = targetPos[2] - selfPos[2];
  return Math.atan2(dx, dz);
}

export const CombatantModel = forwardRef<CombatantModelHandle, CombatantModelProps>(
  ({ combatant, maskPowerActive = false, position, side }, ref) => {
    const modelGroup = useRef<Group>(null);
    const childRef = useRef<CombatantModelHandle | null>(null);

    const baseRotationY = side === 'team' ? Math.PI : 0;
    const [overrideRotationY, setOverrideRotationY] = useState<number | null>(null);
    const restoreRef = useRef<{ from: number; startTimeMs: number } | null>(null);
    const [modelDisposed, setModelDisposed] = useState(false);

    const defeatSinkRef = useRef<{
      active: boolean;
      startMs: number;
      onDone: (() => void) | null;
    }>({ active: false, onDone: null, startMs: 0 });
    const defeatFadeMaterialsRef = useRef<Material[]>([]);

    useFrame(() => {
      const restore = restoreRef.current;
      if (restore) {
        const elapsedSec = (performance.now() - restore.startTimeMs) / 1000;
        const t = battleSpeedProgress(elapsedSec, ROTATION_RESTORE_DURATION);
        setOverrideRotationY(lerpAngle(restore.from, baseRotationY, t));
        if (t >= 1) {
          restoreRef.current = null;
          setOverrideRotationY(null);
        }
      }

      const sink = defeatSinkRef.current;
      if (!sink.active) return;
      const g = modelGroup.current;
      if (!g) {
        sink.active = false;
        sink.onDone?.();
        sink.onDone = null;
        return;
      }

      const elapsedSec = (performance.now() - sink.startMs) / 1000;
      const t = battleSpeedProgress(elapsedSec, DEFEAT_SINK_DURATION_SEC);
      g.position.y = -t * DEFEAT_SINK_DEPTH;
      const fade = 1 - t;
      for (const mat of defeatFadeMaterialsRef.current) {
        const base = (mat.userData.defeatBaseOpacity as number | undefined) ?? 1;
        mat.opacity = base * fade;
      }
      if (t < 1) return;

      sink.active = false;
      for (const mat of defeatFadeMaterialsRef.current) {
        mat.dispose();
      }
      defeatFadeMaterialsRef.current = [];
      if (canDisposeBattleModelGeometry(combatant.model)) {
        disposeObject3DResources(g);
      }
      setModelDisposed(true);
      const done = sink.onDone;
      sink.onDone = null;
      done?.();
    });

    const rotationY = overrideRotationY ?? baseRotationY;
    const attackCompleteRef = useRef<Promise<void>>(Promise.resolve());

    useImperativeHandle(ref, () => ({
      playAnimation: async (name, options) => {
        const faceTargetId = options?.faceTargetId;
        const shouldFace =
          faceTargetId && (name === 'Attack' || name === 'Hit' || name === 'Defeat');

        let facingY: number | null = null;
        if (shouldFace) {
          const positions = (
            window as { combatantPositions?: Record<string, [number, number, number]> }
          ).combatantPositions;
          const selfPos = positions?.[combatant.id];
          const targetPos = positions?.[faceTargetId];

          if (selfPos && targetPos) {
            facingY = getFacingRotation(selfPos, targetPos);
            setOverrideRotationY(facingY);
          }
        }

        const startRestore = () => {
          if (facingY !== null) {
            restoreRef.current = { from: facingY, startTimeMs: performance.now() };
          }
        };

        const runDefeatSinkAndDispose = () =>
          new Promise<void>((resolve) => {
            const g = modelGroup.current;
            if (!g || !childRef.current) {
              resolve();
              return;
            }
            g.position.set(0, 0, 0);
            defeatFadeMaterialsRef.current = [];
            g.traverse((obj) => {
              if (!(obj instanceof Mesh)) return;
              const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
              const clones = mats.map((mat) => {
                const c = mat.clone();
                c.transparent = true;
                c.opacity = mat.opacity;
                c.needsUpdate = true;
                c.userData.defeatBaseOpacity = mat.opacity;
                defeatFadeMaterialsRef.current.push(c);
                return c;
              });
              obj.material = Array.isArray(obj.material) ? clones : clones[0]!;
            });
            defeatSinkRef.current = {
              active: true,
              onDone: resolve,
              startMs: performance.now(),
            };
          });

        if (name === 'Attack') {
          let resolveComplete!: () => void;
          attackCompleteRef.current = new Promise<void>((r) => {
            resolveComplete = r;
          });
          const callOptions: PlayAnimationOptions = {
            onAnimationComplete: () => {
              startRestore();
              resolveComplete();
            },
          };
          await (childRef.current?.playAnimation(name, callOptions) ?? Promise.resolve());
          // No inner model (unknown combatant.model): nothing runs onAnimationComplete.
          if (!childRef.current) {
            startRestore();
            resolveComplete();
          }
          return;
        }

        if (name === 'Defeat') {
          try {
            await (childRef.current?.playAnimation(name, options) ?? Promise.resolve());
          } finally {
            if (faceTargetId && facingY !== null) {
              startRestore();
            }
          }
          // Sink/fade runs on the render loop; do not block combat awaiting it.
          void runDefeatSinkAndDispose();
          return;
        }

        try {
          await (childRef.current?.playAnimation(name) ?? Promise.resolve());
        } finally {
          if (faceTargetId && name === 'Hit' && facingY !== null) {
            startRestore();
          }
        }
      },
      waitForAttackComplete: () => attackCompleteRef.current,
    }));

    const rotation: Euler = [0, rotationY, 0];

    const model = (() => {
      const displayModel = combatant.mataRenderModelId ?? combatant.model;
      switch (displayModel) {
        case 'bohrok':
          return (
            <group scale={0.175}>
              <BohrokModel ref={childRef} id={combatant.id.split('-')[0]} />
            </group>
          );
        case 'nui_rama':
          return (
            <group scale={0.04}>
              <NuiRamaModel ref={childRef} variant={combatant.nuiRamaVariant ?? 'orange'} />
            </group>
          );
        case 'rahi_placeholder':
          return (
            <group scale={1}>
              <RahiPlaceholderModel ref={childRef} element={combatant.element} />
            </group>
          );
        case 'rahkshi':
          return (
            <group scale={0.04} position={[0, 0, 0]}>
              <RahkshiModel ref={childRef} kraata={combatant.id.split('-')[0] as KraataPower} />
            </group>
          );
        case 'Toa_Kopaka':
          return (
            <group scale={0.04}>
              <KopakaMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Tahu':
          return (
            <group scale={0.04}>
              <TahuMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Pohatu':
          return (
            <group scale={0.04} position={[0, 0, 0]}>
              <PohatuMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Onua':
          return (
            <group scale={0.04}>
              <OnuaMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Lewa':
          return (
            <group scale={0.04}>
              <LewaMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Gali':
          return (
            <group scale={0.04}>
              <GaliMataModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Tahu_Nuva':
          return (
            <group scale={0.04}>
              <TahuNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Gali_Nuva':
          return (
            <group scale={0.04}>
              <GaliNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Pohatu_Nuva':
          return (
            <group scale={0.04}>
              <PohatuNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Onua_Nuva':
          return (
            <group scale={0.04}>
              <OnuaNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Kopaka_Nuva':
          return (
            <group scale={0.04}>
              <KopakaNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Lewa_Nuva':
          return (
            <group scale={0.04}>
              <LewaNuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Takanuva':
          return (
            <group scale={0.04}>
              <TakanuvaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Lhikan':
          return (
            <group scale={0.04}>
              <LhikanModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Matau':
          return (
            <group scale={0.04}>
              <MatauModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Nuju':
          return (
            <group scale={0.04}>
              <NujuModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Vakama':
          return (
            <group scale={0.04}>
              <VakamaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        case 'Toa_Whenua':
          return (
            <group scale={0.04}>
              <WhenuaModel
                ref={childRef}
                matoran={{
                  maskOverride: combatant.maskPower?.shortName,
                  ...CHARACTER_DEX[combatant.id],
                  ...combatant,
                  exp: 0,
                  maskPowerActive,
                }}
              />
            </group>
          );
        default:
          if (usesNujuToaMetruRig(displayModel)) {
            return (
              <group scale={0.04}>
                <NujuModel
                  ref={childRef}
                  matoran={{
                    maskOverride: combatant.maskPower?.shortName,
                    ...CHARACTER_DEX[combatant.id],
                    ...combatant,
                    exp: 0,
                    maskPowerActive,
                  }}
                />
              </group>
            );
          }
          return null;
      }
    })();
    return (
      <group position={position}>
        <group ref={modelGroup} rotation={rotation}>
          <WorldSpaceHpBar
            name={combatant.name}
            hp={combatant.hp}
            maxHp={combatant.maxHp}
            yOffset={hpBarYOffset(combatant.model)}
            popupDirection={side === 'team' ? 'down' : 'up'}
          />
          {!modelDisposed && model}
        </group>
      </group>
    );
  }
);
