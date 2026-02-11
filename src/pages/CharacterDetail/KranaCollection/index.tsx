import { useMemo } from 'react';
import { useGame } from '../../../context/Game';
import {
  ALL_KRANA_IDS,
  ELEMENT_TO_KRANA_COLOR,
  getElementKranaProgress,
} from '../../../game/Krana';
import type { KranaElement } from '../../../types/Krana';
import { BaseMatoran, RecruitedCharacterData } from '../../../types/Matoran';
import './index.scss';

interface KranaCollectionProps {
  matoran: BaseMatoran & RecruitedCharacterData;
}

export function KranaCollection({ matoran }: KranaCollectionProps) {
  const { collectedKrana } = useGame();

  const progress = useMemo(() => {
    const element = matoran.element as KranaElement;
    return getElementKranaProgress(collectedKrana, element);
  }, [collectedKrana, matoran.element]);

  const element = matoran.element as KranaElement;
  const kranaColor = ELEMENT_TO_KRANA_COLOR[element];

  return (
    <div className="krana-collection">
      <p className="krana-collection__progress">
        Krana Recovered: {progress.collected.length} / {progress.total}
      </p>
      <div className="krana-collection__grid">
        {ALL_KRANA_IDS.map((kranaId) => {
          const collected = progress.collected.includes(kranaId);
          return (
            <div
              key={kranaId}
              className={`krana-collection__slot krana-collection__slot--${
                collected ? 'collected' : 'uncollected'
              } krana-color--${kranaColor}`}
              title={
                collected ? `Krana ${kranaId} (collected)` : `Krana ${kranaId} (not yet recovered)`
              }
            >
              <div className="krana-collection__img-wrap">
                <img
                  src={`${import.meta.env.BASE_URL}/avatar/Krana/${kranaId}.webp`}
                  alt={kranaId}
                  className="krana-collection__img"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
