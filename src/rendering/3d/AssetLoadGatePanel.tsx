import '../../context/GameLoadGate.scss';

export function AssetLoadGatePanel({
  loaded,
  text,
  total,
}: {
  loaded: number;
  text: string;
  total: number;
}) {
  const max = Math.max(total, 1);
  const percent = total === 0 ? 100 : Math.round((loaded / max) * 100);

  return (
    <div className="game-load-gate" role="status" aria-live="polite" aria-busy="true">
      <div className="game-load-gate__panel">
        <div className="game-load-gate__spinner" aria-hidden="true" />
        <p className="game-load-gate__text">{text}</p>
        <div
          aria-valuemax={max}
          aria-valuemin={0}
          aria-valuenow={loaded}
          className="game-load-gate__bar"
          role="progressbar"
        >
          <div className="game-load-gate__bar-fill" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}
