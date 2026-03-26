import { useEffect, useState } from 'react';
import { ElementTribe } from '../../types/Matoran';
import { PROTODERMIS_TO_EXP_RATIO } from '../../game/ProtodermisConversion';
import './index.scss';

type ProtodermisTrainingProps = {
  characterId: string;
  element: ElementTribe;
  protodermis: number;
  convertProtodermisToExp: (characterId: string, protodermisSpent: number) => boolean;
};

export const ProtodermisTraining: React.FC<ProtodermisTrainingProps> = ({
  characterId,
  element,
  protodermis,
  convertProtodermisToExp,
}) => {
  const [spend, setSpend] = useState(1);

  useEffect(() => {
    setSpend((s) => Math.min(Math.max(1, s), Math.max(protodermis, 1)));
  }, [protodermis]);

  const spendClamped = Math.min(Math.max(1, spend), Math.max(protodermis, 1));
  const canConvert = protodermis >= 1 && spendClamped >= 1 && spendClamped <= protodermis;

  return (
    <div className="protodermis-training">
      <h4 className="protodermis-training__title">Train with protodermis</h4>
      <p className="protodermis-training__hint">
        Spend protodermis to grant this Toa experience ({PROTODERMIS_TO_EXP_RATIO} protodermis →{' '}
        {PROTODERMIS_TO_EXP_RATIO} XP).
      </p>
      <div className="protodermis-training__row">
        <label className="protodermis-training__label" htmlFor="protodermis-training-amount">
          Amount
        </label>
        <input
          id="protodermis-training-amount"
          className="protodermis-training__input"
          type="number"
          min={1}
          max={Math.max(protodermis, 1)}
          value={spend}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (Number.isNaN(v)) {
              setSpend(1);
              return;
            }
            setSpend(Math.min(Math.max(1, v), Math.max(protodermis, 1)));
          }}
        />
        <button
          type="button"
          className="protodermis-training__max"
          disabled={protodermis < 1}
          onClick={() => setSpend(protodermis)}
        >
          Max
        </button>
      </div>
      <button
        type="button"
        className={`elemental-btn element-${element}${canConvert ? '' : ' disabled'}`}
        disabled={!canConvert}
        onClick={() => canConvert && convertProtodermisToExp(characterId, spendClamped)}
      >
        Convert to XP
      </button>
    </div>
  );
};
