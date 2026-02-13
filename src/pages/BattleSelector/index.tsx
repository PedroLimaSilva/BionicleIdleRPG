import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompositedImage } from '../../components/CompositedImage';
import { ElementTag } from '../../components/ElementTag';
import { ITEM_DICTIONARY } from '../../data/loot';
import { useGame } from '../../context/Game';
import { COMBATANT_DEX, ENCOUNTERS } from '../../data/combat';
import { getVisibleEncounters } from '../../game/encounterVisibility';
import { formatKranaLootLabel, isKranaCollected, parseKranaDropId } from '../../game/Krana';
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

/** Formats a loot item for display (never shows raw krana loot ids). */
function formatLootLabel(id: string): string {
  const kranaLabel = formatKranaLootLabel(id);
  if (kranaLabel) return kranaLabel;
  const item = ITEM_DICTIONARY[id as keyof typeof ITEM_DICTIONARY];
  return item?.name ?? id;
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
              <CompositedImage
                className="enemy-avatar"
                images={[
                  `${import.meta.env.BASE_URL}/avatar/Bohrok/${
                    COMBATANT_DEX[encounter.headliner].name
                  }.png`,
                ]}
                colors={['#fff']}
              />
              <p className="description">{encounter.description}</p>
              {displayableLoot.length > 0 && (
                <div className="loot-section">
                  <span className="loot-label">Possible loot:</span>
                  <div className="loot-tags">
                    {displayableLoot.map((drop) => (
                      <span key={drop.id} className="loot-tag">
                        {formatLootLabel(drop.id)}
                      </span>
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
