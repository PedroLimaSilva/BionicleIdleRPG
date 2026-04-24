import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import { DamagePopup, DamagePopupEvent } from './Cards/DamagePopup';
import './WorldSpaceHpBar.scss';

interface WorldSpaceHpBarProps {
  name: string;
  hp: number;
  maxHp: number;
  /** Y offset above the combatant's base position in world units. */
  yOffset?: number;
  /** Direction damage/healing numbers animate toward. */
  popupDirection?: 'up' | 'down';
}

function fillTier(ratio: number): 'high' | 'mid' | 'low' | 'empty' {
  if (ratio <= 0) return 'empty';
  if (ratio < 0.35) return 'low';
  if (ratio < 0.65) return 'mid';
  return 'high';
}

export function WorldSpaceHpBar({
  hp,
  maxHp,
  name,
  popupDirection = 'up',
  yOffset = 0.18,
}: WorldSpaceHpBarProps) {
  const prevHpRef = useRef(hp);
  const popupSeqRef = useRef(0);
  const [damage, setDamage] = useState<DamagePopupEvent | null>(null);
  const [healing, setHealing] = useState<DamagePopupEvent | null>(null);

  useEffect(() => {
    if (hp < prevHpRef.current) {
      setDamage({ id: ++popupSeqRef.current, maxHp, value: prevHpRef.current - hp });
      setHealing(null);
    } else if (hp > prevHpRef.current) {
      setHealing({ id: ++popupSeqRef.current, maxHp, value: hp - prevHpRef.current });
      setDamage(null);
    }
    prevHpRef.current = hp;
  }, [hp, maxHp]);

  const safeMax = maxHp > 0 ? maxHp : 0;
  const ratio = safeMax > 0 ? Math.min(1, Math.max(0, hp / safeMax)) : 0;
  const pct = Math.round(ratio * 100);
  const defeated = hp <= 0;
  const tier = defeated ? 'defeated' : fillTier(ratio);

  return (
    <Html center position={[0, yOffset, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`world-hp${defeated ? ' world-hp--defeated' : ''}`}>
        <span className="world-hp__name">{name}</span>
        <div className="world-hp__bar-host">
          <div className="world-hp__track">
            <div
              className={`world-hp__fill world-hp__fill--${tier}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          {damage && (
            <DamagePopup
              popup={damage}
              direction={popupDirection}
              onComplete={(id) => setDamage((c) => (c?.id === id ? null : c))}
            />
          )}
          {healing && (
            <DamagePopup
              popup={healing}
              direction={popupDirection}
              isHealing
              onComplete={(id) => setHealing((c) => (c?.id === id ? null : c))}
            />
          )}
        </div>
      </div>
    </Html>
  );
}
