import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ElementTag } from '../../components/ElementTag';
import { Tooltip } from '../../components/Tooltip';
import { ITEM_DICTIONARY } from '../../data/loot';
import { useGame } from '../../context/Game';
import { COMBATANT_DEX, ENCOUNTERS } from '../../data/combat';
import { getVisibleEncounters } from '../../game/encounterVisibility';
import { ELEMENT_TO_KRANA_COLOR, isKranaCollected, parseKranaDropId } from '../../game/Krana';
import type { KranaCollection } from '../../types/Krana';

/** Returns loot items to display, excluding already-collected krana. */
function getDisplayableLoot(
  loot: { id: string; chance: number }[],
  collectedKrana: KranaCollection
) {
  return loot.filter((drop) => {
    const parsed = parseKranaDropId(drop.id);
    if (parsed) {
      return !isKranaCollected(collectedKrana, parsed.element, parsed.kranaId);
    }
    return true;
  });
}

/** Renders a loot item - krana uses the same images as KranaCollection. */
function LootTag({ drop }: { drop: { id: string } }) {
  const parsed = parseKranaDropId(drop.id);
  const color = parsed ? ELEMENT_TO_KRANA_COLOR[parsed.element] : undefined;
  if (parsed) {
    return (
      <Tooltip content={`Krana ${parsed.kranaId}`}>
        <span
          className={`loot-tag krana-collection__img-wrap loot-tag--krana krana-color--${color}`}
        >
          <img
            src={`${import.meta.env.BASE_URL}/avatar/Krana/${parsed.kranaId}.webp`}
            alt={`Krana ${parsed.kranaId}`}
            className="loot-tag__krana-img"
          />
        </span>
      </Tooltip>
    );
  }
  const item = ITEM_DICTIONARY[drop.id as keyof typeof ITEM_DICTIONARY];
  const label = item?.name ?? drop.id;
  return <span className="loot-tag">{label}</span>;
}

export const BattleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { battle, completedQuests, collectedKrana } = useGame();
  const visibleEncounters = useMemo(
    () => getVisibleEncounters(ENCOUNTERS, collectedKrana, completedQuests),
    [collectedKrana, completedQuests]
  );
  return (
    <div className="page-container">
      <h1 className="title">Select an Encounter</h1>
      <Link to="/type-effectiveness" className="battle-selector__type-chart-link">
        View type effectiveness chart
      </Link>
      <div className="encounter-list">
        {visibleEncounters.map((encounter) => {
          const displayableLoot = getDisplayableLoot(encounter.loot, collectedKrana);
          return (
            <div key={encounter.id} className="encounter">
              <div className="encounter-header">
                {encounter.headliner && (
                  <ElementTag element={COMBATANT_DEX[encounter.headliner].element} />
                )}
                <h2>{encounter.name}</h2>
                <span className="difficulty">Difficulty: {encounter.difficulty}</span>
              </div>
              <img
                className="enemy-avatar"
                src={`${import.meta.env.BASE_URL}/avatar/Bohrok/${
                  ['bohrok_kal_pair', 'bohrok_kal_trio'].includes(encounter.headliner)
                    ? 'Tahnok'
                    : COMBATANT_DEX[encounter.headliner].name.replace(/ Kal$/, '')
                }.webp`}
                alt=""
              />
              <p className="description">{encounter.description}</p>
              {displayableLoot.length > 0 && (
                <div className="loot-section">
                  <span className="loot-label">Possible loot:</span>
                  <div className="loot-tags">
                    {displayableLoot.map((drop) => (
                      <LootTag key={drop.id} drop={drop} />
                    ))}
                  </div>
                </div>
              )}
              <button
                className="confirm-button"
                onClick={() => {
                  battle.startBattle(encounter);
                  navigate('/battle');
                }}
              >
                Start Battle
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
