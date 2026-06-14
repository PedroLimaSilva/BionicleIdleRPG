import { PresentationControls, PerspectiveCamera } from '@react-three/drei';
import { Combatant } from '../../types/Combat';
import { hasActiveEffectFromSource } from '../../services/combatUtils';
import { CombatantModel, CombatantModelHandle } from './CombatantModel';
import { useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSettings } from '../../context/useSettings';
import { shouldEnableShadows } from '../../utils/testMode';
import { HitImpactParticles } from './HitImpactParticles';
import { subscribeBattleCameraEmphasis } from '../../utils/battleCameraEmphasis';
import {
  CAMERA_EMPHASIS_HOLD_MS,
  CAMERA_EMPHASIS_OUT_MS,
} from '../../game/battleOutcomeVisualDelay';
import { scaleBattleDurationMs } from '../../utils/battleSpeed';
import * as THREE from 'three';
import { ARENA_MARGIN } from './arenaLayout';
import { ArenaEnvironment } from './ArenaEnvironment';
import { shouldSkipArenaShadow } from './arenas/arenaGlbUtils';
import { getArenaDefinition } from './arenas/registry';
import type { ArenaId, ArenaLayout } from './arenas/types';
import type { ElementTribe } from '../../types/Matoran';

interface ArenaProps {
  team: Combatant[];
  enemies: Combatant[];
  currentWave: number;
  arenaId?: ArenaId;
  /** Element tribe of the encounter headliner, used to recolor the arena. */
  tribe?: ElementTribe;
}

const CAMERA_EMPHASIS_IN_MS = 320;
const CAMERA_EMPHASIS_RETARGET_MS = 240;
const CAMERA_EMPHASIS_ZOOM_MULT = 1.05;
/** Shoulder offset — camera sits behind and above the Toa, looking past them at the enemy. */
const SHOULDER_RIGHT = 0.3;
const SHOULDER_UP = 0.8;
const SHOULDER_BACK = 1.2;

/**
 * Perspective camera framing for the battle arena. In portrait uses a front
 * view; in landscape an angled view. FOV is computed dynamically so the arena
 * always fits the viewport.
 *
 * Camera emphasis uses a snapshot-based transition: every event captures the
 * current animated camera state as "from" and smoothly lerps to the computed
 * "to", so back-to-back attacks never cause a positional jump.
 */
function ArenaFraming({ layout }: { layout: ArenaLayout }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  const basePositionRef = useRef(new THREE.Vector3());
  const baseLookAtRef = useRef(new THREE.Vector3(...layout.center));
  const baseZoomRef = useRef(1);

  const curPositionRef = useRef(new THREE.Vector3());
  const curLookAtRef = useRef(new THREE.Vector3(...layout.center));
  const curZoomRef = useRef(1);

  const fromPositionRef = useRef(new THREE.Vector3());
  const fromLookAtRef = useRef(new THREE.Vector3());
  const fromZoomRef = useRef(1);
  const toPositionRef = useRef(new THREE.Vector3());
  const toLookAtRef = useRef(new THREE.Vector3());
  const toZoomRef = useRef(1);

  const transitionRef = useRef<{ startMs: number; durationMs: number } | null>(null);
  const emphasisActiveRef = useRef(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingZoomOutRef = useRef(false);
  const pendingZoomOutResolveRef = useRef<(() => void) | null>(null);
  const transitionResolveRef = useRef<(() => void) | null>(null);

  const tmpA = useRef(new THREE.Vector3());
  const tmpB = useRef(new THREE.Vector3());
  const tmpC = useRef(new THREE.Vector3());
  const tmpD = useRef(new THREE.Vector3());

  const computeEmphasisTarget = (
    attackerArr: [number, number, number],
    targetArr: [number, number, number],
    attackerSide: 'team' | 'enemy'
  ) => {
    const attackerPos = tmpA.current.set(attackerArr[0], attackerArr[1], attackerArr[2]);
    const targetPos = tmpB.current.set(targetArr[0], targetArr[1], targetArr[2]);

    const toaPos = attackerSide === 'team' ? attackerPos : targetPos;
    const enemyPos = attackerSide === 'team' ? targetPos : attackerPos;

    const forward = tmpC.current.copy(enemyPos).sub(toaPos);
    forward.y = 0;
    if (forward.lengthSq() < 0.0001) forward.set(0, 0, -1);
    forward.normalize();

    const right = tmpD.current.set(forward.z, 0, -forward.x);

    toPositionRef.current
      .copy(toaPos)
      .addScaledVector(forward, -SHOULDER_BACK)
      .addScaledVector(right, SHOULDER_RIGHT);
    toPositionRef.current.y = toaPos.y + SHOULDER_UP;

    toLookAtRef.current.copy(enemyPos).setY(enemyPos.y + 0.25);
    toZoomRef.current = baseZoomRef.current * CAMERA_EMPHASIS_ZOOM_MULT;
  };

  const startZoomOut = useCallback(() => {
    const now = performance.now();
    snapshotFrom();
    toPositionRef.current.copy(basePositionRef.current);
    toLookAtRef.current.copy(baseLookAtRef.current);
    toZoomRef.current = baseZoomRef.current;
    transitionRef.current = {
      durationMs: scaleBattleDurationMs(CAMERA_EMPHASIS_OUT_MS),
      startMs: now,
    };
  }, []);

  const snapshotFrom = () => {
    fromPositionRef.current.copy(curPositionRef.current);
    fromLookAtRef.current.copy(curLookAtRef.current);
    fromZoomRef.current = curZoomRef.current;
  };

  useEffect(() => {
    if (size.width <= 0 || size.height <= 0) return;

    const [cx, cy, cz] = layout.center;
    const d = layout.boxSize;
    const isPortrait = size.width < size.height;

    const [mx, my, mz] = isPortrait ? layout.cameraPortrait : layout.cameraLandscape;
    basePositionRef.current.set(cx + d * mx, cy + d * my, cz + d * mz);
    baseLookAtRef.current.set(cx, cy, cz);
    camera.near = 0.01;
    camera.far = 100;

    const distance = basePositionRef.current.distanceTo(baseLookAtRef.current);
    const halfArena = (layout.boxSize * ARENA_MARGIN) / 2;
    const aspect = size.width / size.height;

    const vFovForHeight = 2 * Math.atan(halfArena / distance) * THREE.MathUtils.RAD2DEG;
    const vFovForWidth = 2 * Math.atan(halfArena / (distance * aspect)) * THREE.MathUtils.RAD2DEG;
    const fov = Math.max(vFovForHeight, vFovForWidth);

    (camera as THREE.PerspectiveCamera).fov = fov;
    baseZoomRef.current = 1;

    if (!transitionRef.current && !emphasisActiveRef.current) {
      camera.position.copy(basePositionRef.current);
      camera.lookAt(baseLookAtRef.current);
      camera.zoom = 1;
      camera.updateProjectionMatrix();
      curPositionRef.current.copy(basePositionRef.current);
      curLookAtRef.current.copy(baseLookAtRef.current);
      curZoomRef.current = 1;
    }
  }, [camera, size, layout]);

  useEffect(() => {
    const unsubscribe = subscribeBattleCameraEmphasis(
      ({ attackerId, attackerSide, phase, resolve, targetId }) => {
        if (phase === 'start') {
          pendingZoomOutRef.current = false;
          emphasisActiveRef.current = true;

          if (holdTimerRef.current !== null) {
            clearTimeout(holdTimerRef.current);
            holdTimerRef.current = null;
          }

          const positions = (
            window as { combatantPositions?: Record<string, [number, number, number]> }
          ).combatantPositions;
          const attacker = attackerId ? positions?.[attackerId] : undefined;
          const target = targetId ? positions?.[targetId] : undefined;
          if (!attacker || !target) {
            resolve?.();
            return;
          }

          transitionResolveRef.current?.();
          transitionResolveRef.current = resolve ?? null;

          snapshotFrom();
          computeEmphasisTarget(attacker, target, attackerSide ?? 'team');

          const isRetarget = transitionRef.current !== null;
          transitionRef.current = {
            durationMs: scaleBattleDurationMs(
              isRetarget ? CAMERA_EMPHASIS_RETARGET_MS : CAMERA_EMPHASIS_IN_MS
            ),
            startMs: performance.now(),
          };
          return;
        }

        // phase === 'end': schedule the zoom-out after a short hold
        const beginZoomOut = () => {
          holdTimerRef.current = null;
          if (transitionRef.current) {
            pendingZoomOutRef.current = true;
            pendingZoomOutResolveRef.current = resolve ?? null;
          } else {
            transitionResolveRef.current?.();
            transitionResolveRef.current = resolve ?? null;
            startZoomOut();
          }
        };

        if (holdTimerRef.current !== null) {
          clearTimeout(holdTimerRef.current);
        }
        holdTimerRef.current = setTimeout(
          beginZoomOut,
          scaleBattleDurationMs(CAMERA_EMPHASIS_HOLD_MS)
        );
      }
    );
    return unsubscribe;
  }, [startZoomOut]);

  useFrame(() => {
    const transition = transitionRef.current;

    if (!transition) {
      if (emphasisActiveRef.current) {
        camera.position.copy(curPositionRef.current);
        camera.lookAt(curLookAtRef.current);
        camera.zoom = curZoomRef.current;
        camera.updateProjectionMatrix();
      }
      return;
    }

    const rawT = Math.min(
      1,
      (performance.now() - transition.startMs) / Math.max(1, transition.durationMs)
    );
    const t = THREE.MathUtils.smoothstep(rawT, 0, 1);

    curPositionRef.current.lerpVectors(fromPositionRef.current, toPositionRef.current, t);
    curLookAtRef.current.lerpVectors(fromLookAtRef.current, toLookAtRef.current, t);
    curZoomRef.current = THREE.MathUtils.lerp(fromZoomRef.current, toZoomRef.current, t);

    camera.position.copy(curPositionRef.current);
    camera.lookAt(curLookAtRef.current);
    camera.zoom = curZoomRef.current;
    camera.updateProjectionMatrix();

    if (rawT >= 1) {
      transitionRef.current = null;

      if (pendingZoomOutRef.current) {
        pendingZoomOutRef.current = false;
        const prevResolve = transitionResolveRef.current;
        transitionResolveRef.current = pendingZoomOutResolveRef.current;
        pendingZoomOutResolveRef.current = null;
        prevResolve?.();
        startZoomOut();
      } else {
        const isZoomOutDone =
          curPositionRef.current.distanceToSquared(basePositionRef.current) < 0.001 &&
          Math.abs(curZoomRef.current - baseZoomRef.current) < 0.1;
        if (isZoomOutDone) {
          emphasisActiveRef.current = false;
        }

        const prevResolve = transitionResolveRef.current;
        transitionResolveRef.current = null;
        prevResolve?.();
      }
    }
  });

  return null;
}

export function Arena({ arenaId, currentWave, enemies, team, tribe }: ArenaProps) {
  const combatantRefs = useRef<Record<string, CombatantModelHandle>>({});
  const sceneGroupRef = useRef<THREE.Group>(null);
  const { shadowsEnabled } = useSettings();
  const effectiveShadows = shadowsEnabled && shouldEnableShadows();

  const arenaDef = getArenaDefinition(arenaId);
  const layout = arenaDef.layout;
  const teamPositions = layout.team;
  const enemyPositions = layout.enemy;
  const recolor = arenaDef.recolorForTribe?.(tribe);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).combatantRefs = combatantRefs.current;
  }, [team, enemies]);

  // Drop refs for ids no longer in this battle (e.g. prior wave). Otherwise window.combatantRefs
  // can still point at a living model under a dead key—Hit would run on the wrong mixer and
  // stopAllAction() cancels the real attacker's Attack clip.
  useEffect(() => {
    const currentIds = new Set([...team.map((c) => c.id), ...enemies.map((c) => c.id)]);
    for (const id of Object.keys(combatantRefs.current)) {
      if (!currentIds.has(id)) delete combatantRefs.current[id];
    }
  }, [team, enemies]);

  useEffect(() => {
    const positions: Record<string, [number, number, number]> = {};
    team.forEach((c, i) => {
      positions[c.id] = teamPositions[i];
    });
    enemies.forEach((c, i) => {
      positions[c.id] = enemyPositions[i];
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).combatantPositions = positions;
  }, [team, enemies, teamPositions, enemyPositions]);

  useEffect(() => {
    if (!effectiveShadows || !sceneGroupRef.current) return;
    const applyShadowProps = () => {
      sceneGroupRef.current?.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (shouldSkipArenaShadow(mesh)) {
            return;
          }
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      });
    };
    applyShadowProps();
    const t = setTimeout(applyShadowProps, 500);
    return () => clearTimeout(t);
  }, [effectiveShadows, team, enemies]);

  return (
    <>
      <PerspectiveCamera makeDefault />
      <ArenaFraming layout={layout} />
      <ArenaEnvironment arenaId={arenaId} receiveShadow={effectiveShadows} recolor={recolor} />
      <PresentationControls
        enabled={false}
        global={true}
        snap={false}
        speed={2}
        zoom={1}
        polar={[-Math.PI / 2, 0]}
        config={{ friction: 26, mass: 0.5, tension: 170 }}
      >
        <group dispose={null} name="Scene" ref={sceneGroupRef}>
          <HitImpactParticles />

          {team.map((c, i) => (
            <CombatantModel
              key={c.id}
              combatant={c}
              side="team"
              position={teamPositions[i]}
              maskPowerActive={
                !!c.maskPower?.active || hasActiveEffectFromSource(team, enemies, c.id)
              }
              ref={(ref) => {
                if (ref) combatantRefs.current[c.id] = ref;
                else delete combatantRefs.current[c.id];
              }}
            />
          ))}

          {enemies.map((c, i) => {
            return (
              <CombatantModel
                key={`${c.id}-w${currentWave}`}
                combatant={c}
                side="enemy"
                position={enemyPositions[i]}
                ref={(ref) => {
                  if (ref) combatantRefs.current[c.id] = ref;
                  else delete combatantRefs.current[c.id];
                }}
              />
            );
          })}
        </group>
      </PresentationControls>
    </>
  );
}
