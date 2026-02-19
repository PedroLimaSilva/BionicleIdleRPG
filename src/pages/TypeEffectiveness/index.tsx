import { ELEMENT_EFFECTIVENESS } from '../../services/combatUtils';
import { ElementTribe } from '../../types/Matoran';
import { ElementTag } from '../../components/ElementTag';

import './index.scss';

const ELEMENT_ORDER: ElementTribe[] = [
  ElementTribe.Fire,
  ElementTribe.Water,
  ElementTribe.Ice,
  ElementTribe.Stone,
  ElementTribe.Earth,
  ElementTribe.Air,
];

function getMultiplierLabel(multiplier: number): string {
  if (multiplier === 0.5) return '½';
  if (multiplier === 1.0) return '1';
  if (multiplier === 1.5) return '1.5';
  return String(multiplier);
}

function getCellClassName(multiplier: number): string {
  if (multiplier === 0.5) return 'type-effectiveness__cell--weak';
  if (multiplier === 1.5) return 'type-effectiveness__cell--strong';
  return 'type-effectiveness__cell--normal';
}

export default function TypeEffectivenessPage() {
  return (
    <div className="page-container type-effectiveness">
      <h1 className="title">Type Effectiveness</h1>
      <p className="type-effectiveness__intro">
        Damage multiplier when an element (row) attacks another element (column).
      </p>
      <div className="type-effectiveness__table-wrap">
        <table className="type-effectiveness__table">
          <thead>
            <tr>
              <th className="type-effectiveness__corner"></th>
              {ELEMENT_ORDER.map((defender) => (
                <th key={defender} className="type-effectiveness__header">
                  <ElementTag element={defender} showName />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ELEMENT_ORDER.map((attacker) => (
              <tr key={attacker}>
                <th className="type-effectiveness__row-header">
                  <ElementTag element={attacker} showName />
                </th>
                {ELEMENT_ORDER.map((defender) => {
                  const multiplier =
                    ELEMENT_EFFECTIVENESS[attacker]?.[defender] ?? 1.0;
                  return (
                    <td
                      key={defender}
                      className={`type-effectiveness__cell ${getCellClassName(multiplier)}`}
                      title={`${attacker} → ${defender}: ${multiplier}×`}
                    >
                      {getMultiplierLabel(multiplier)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="type-effectiveness__legend">
        <span className="type-effectiveness__legend-item type-effectiveness__cell--strong">
          1.5× Super effective
        </span>
        <span className="type-effectiveness__legend-item type-effectiveness__cell--normal">
          1× Normal
        </span>
        <span className="type-effectiveness__legend-item type-effectiveness__cell--weak">
          ½× Not very effective
        </span>
      </div>
    </div>
  );
}
