import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ElementTag } from '../../components/ElementTag';
import { Tooltip } from '../../components/Tooltip';
import { useGame } from '../../context/Game';
import { COMBATANT_DEX, ENCOUNTERS } from '../../data/combat';
import { getVisibleEncounters } from '../../game/encounterVisibility';
import { ELEMENT_TO_KRANA_COLOR, isKranaCollected, parseKranaDropId } from '../../game/Krana';
import type { KranaCollection } from '../../types/Krana';
import type { EnemyEncounter } from '../../types/Combat';
import { isKraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';

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
  const isKraata = isKraataPower(drop.id);
  const label = isKraata
    ? `Kraata of ${KRAATA_POWER_NAMES[drop.id as keyof typeof KRAATA_POWER_NAMES] ?? drop.id}`
    : drop.id;
  return (
    <Tooltip content={label}>
      <span className={`loot-tag${isKraata ? ' loot-tag--kraata' : ''}`}>{label}</span>
    </Tooltip>
  );
}

/** Resolves avatar image src for a given encounter headliner. */
function getEncounterAvatarSrc(encounter: EnemyEncounter): string | null {
  const template = COMBATANT_DEX[encounter.headliner];
  if (!template) return null;

  if (template.model === 'rahkshi') return null;

  const name = ['bohrok_kal_pair', 'bohrok_kal_trio'].includes(encounter.headliner)
    ? 'Tahnok'
    : template.name;

  return `${import.meta.env.BASE_URL}/avatar/Bohrok/${name}.webp`;
}

export const BattleSelector: React.FC = () => {
  const navigate = useNavigate();
  const { battle, completedQuests, collectedKrana } = useGame();
  const visibleEncounters = useMemo(
    () => getVisibleEncounters(ENCOUNTERS, collectedKrana, completedQuests),
    [collectedKrana, completedQuests]
  );

  if (!visibleEncounters.length) {
    return (
      <div className="page-container">
        <h1 className="title">No encounters available</h1>
        <p>Complete quests to unlock encounters.</p>
        <Link to="/type-effectiveness" className="battle-selector__type-chart-link">
          View type effectiveness chart
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="title">Select an Encounter</h1>
      <Link to="/type-effectiveness" className="battle-selector__type-chart-link">
        View type effectiveness chart
      </Link>
      <div className="encounter-list">
        {visibleEncounters.map((encounter) => {
          const displayableLoot = getDisplayableLoot(encounter.loot, collectedKrana);
          const avatarSrc = getEncounterAvatarSrc(encounter);
          return (
            <div key={encounter.id} className="encounter">
              <div className="encounter-header">
                {encounter.headliner && (
                  <ElementTag element={COMBATANT_DEX[encounter.headliner].element} />
                )}
                <h2>{encounter.name}</h2>
                <span className="difficulty">Difficulty: {encounter.difficulty}</span>
              </div>
              {avatarSrc && <img className="enemy-avatar" src={avatarSrc} alt="" />}
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
