import { addAfterEffect } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import {
  countSceneGraphRenderStats,
  formatCharacterRenderCostLog,
  type SceneGraphRenderStats,
} from './sceneDrawCallStats';
import { isTestMode } from '../../utils/testMode';
import type { Object3D } from 'three';

type LoggerPhase = 'idle' | 'await-baseline' | 'await-final';

type LoggerSession = {
  sessionKey: string;
  baseline: SceneGraphRenderStats | null;
  targetGeneration: number;
  loggedGeneration: number;
  phase: LoggerPhase;
  framesRemaining: number;
};

type SceneDrawCallLoggerProps = {
  /** Bumps when the scene reports ready (e.g. kit attachments attached). */
  readyGeneration: number;
  /** Console label, e.g. character id. */
  label: string;
  /** Resets the baseline/final capture when the viewed character changes. */
  sessionKey: string;
  /** Character subtree to measure (excludes HDRI / lights / bloom). */
  measureRootRef: RefObject<Object3D | null>;
};

function createSession(sessionKey: string): LoggerSession {
  return {
    baseline: null,
    framesRemaining: 1,
    loggedGeneration: -1,
    phase: 'await-baseline',
    sessionKey,
    targetGeneration: 0,
  };
}

/**
 * Logs stable scene-graph render cost for a character sheet: baseline after the
 * character root mounts, final after kit attachments finish. Uses mesh/material
 * counts rather than `renderer.info` so refresh rate does not skew the result.
 */
export function SceneDrawCallLogger({
  label,
  measureRootRef,
  readyGeneration,
  sessionKey,
}: SceneDrawCallLoggerProps) {
  const sessionRef = useRef<LoggerSession>(createSession(sessionKey));

  useEffect(() => {
    if (isTestMode()) return;
    sessionRef.current = createSession(sessionKey);
  }, [sessionKey]);

  useEffect(() => {
    if (isTestMode()) return;
    if (readyGeneration <= 0) return;

    const session = sessionRef.current;
    if (session.sessionKey !== sessionKey) return;
    if (session.loggedGeneration === readyGeneration) return;

    session.targetGeneration = readyGeneration;
    session.phase = 'await-final';
    session.framesRemaining = 2;
  }, [readyGeneration, sessionKey]);

  useEffect(() => {
    if (isTestMode()) return;

    return addAfterEffect(() => {
      const session = sessionRef.current;
      if (session.sessionKey !== sessionKey) return;
      if (session.framesRemaining <= 0 || session.phase === 'idle') return;

      session.framesRemaining -= 1;
      if (session.framesRemaining > 0) return;

      const stats = countSceneGraphRenderStats(measureRootRef.current);

      if (session.phase === 'await-baseline') {
        session.baseline = stats;
        session.phase = 'idle';
        return;
      }

      if (session.phase === 'await-final') {
        if (!session.baseline || session.loggedGeneration === session.targetGeneration) return;
        session.loggedGeneration = session.targetGeneration;
        session.phase = 'idle';
        console.info(formatCharacterRenderCostLog(label, session.baseline, stats));
      }
    });
  }, [label, measureRootRef, sessionKey]);

  return null;
}
