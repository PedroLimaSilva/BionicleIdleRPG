import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CompositedImage } from '../../components/CompositedImage';
import { ElementTag } from '../../components/ElementTag';
import { useGame } from '../../context/Game';
import { COMBATANT_DEX, ENCOUNTERS } from '../../data/combat';
import { getVisibleEncounters } from '../../game/encounterVisibility';

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
        {visibleEncounters.map((encounter) => (
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
            <p className="loot">Loot: {encounter.loot.map((l) => l.id).join(', ')}</p>
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
        ))}
      </div>
    </div>
  );
};
