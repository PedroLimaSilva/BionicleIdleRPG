type CombatHpBarProps = {
  hp: number;
  maxHp: number;
  defeated?: boolean;
};

function fillTier(ratio: number): 'high' | 'mid' | 'low' | 'empty' {
  if (ratio <= 0) return 'empty';
  if (ratio < 0.35) return 'low';
  if (ratio < 0.65) return 'mid';
  return 'high';
}

function healthDescription(defeated: boolean, ratio: number): string {
  if (defeated) return 'Defeated';
  if (ratio >= 0.99) return 'Health full';
  if (ratio >= 0.65) return 'Health high';
  if (ratio >= 0.35) return 'Health moderate';
  if (ratio > 0) return 'Health low';
  return 'No health';
}

export function CombatHpBar({ hp, maxHp, defeated = false }: CombatHpBarProps) {
  const safeMax = maxHp > 0 ? maxHp : 0;
  const ratio = safeMax > 0 ? Math.min(1, Math.max(0, hp / safeMax)) : 0;
  const pct = Math.round(ratio * 100);
  const tier = defeated ? 'defeated' : fillTier(ratio);

  return (
    <div
      className="combat-hp-bar"
      role="img"
      aria-label={healthDescription(defeated, ratio)}
    >
      <div className="combat-hp-bar__track">
        <div
          className={`combat-hp-bar__fill combat-hp-bar__fill--${tier}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
