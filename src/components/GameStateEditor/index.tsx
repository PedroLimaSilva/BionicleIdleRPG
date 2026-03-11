import { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/Game';
import { QUESTS } from '../../data/quests';
import { TOA_DEX } from '../../data/dex/toa';
import { MATORAN_DEX } from '../../data/dex/matoran';
import { CHARACTER_DEX } from '../../data/dex';
import { RecruitedCharacterData } from '../../types/Matoran';
import { KranaCollection, KranaElement, KranaId } from '../../types/Krana';
import { KraataCollection, KraataPower, KRAATA_POWER_NAMES } from '../../types/Kraata';
import { ElementTribe } from '../../types/Matoran';
import { getLevelFromExp } from '../../game/Levelling';
import './index.scss';

const RECRUITABLE_IDS = [...Object.keys(TOA_DEX), ...Object.keys(MATORAN_DEX)];

const KranaElementValues: KranaElement[] = [
  ElementTribe.Water,
  ElementTribe.Fire,
  ElementTribe.Air,
  ElementTribe.Ice,
  ElementTribe.Stone,
  ElementTribe.Earth,
];

const KranaIds: KranaId[] = ['Xa', 'Bo', 'Su', 'Za', 'Vu', 'Ja', 'Yo', 'Ca'];

const KRAATA_STAGES = [1, 2, 3, 4, 5, 6] as const;

interface GameStateEditorProps {
  onApplied?: () => void;
}

export function GameStateEditor({ onApplied }: GameStateEditorProps) {
  const game = useGame();
  const {
    completedQuests,
    recruitedCharacters,
    collectedKrana,
    kraataCollection,
    protodermis,
    protodermisCap,
    setCompletedQuests,
    setRecruitedCharacters,
    setCollectedKrana,
    setKraataCollection,
    setProtodermis,
    setProtodermisCap,
  } = game;

  const [draftCompleted, setDraftCompleted] = useState<string[]>([]);
  const [draftRecruited, setDraftRecruited] = useState<RecruitedCharacterData[]>([]);
  const [draftKrana, setDraftKrana] = useState<KranaCollection>({});
  const [draftKraata, setDraftKraata] = useState<KraataCollection>({});
  const [draftProtodermis, setDraftProtodermis] = useState(0);
  const [draftProtodermisCap, setDraftProtodermisCap] = useState(0);

  const hasSynced = useRef(false);

  // Sync draft from live state once when the page mounts
  useEffect(() => {
    if (hasSynced.current) return;
    hasSynced.current = true;
    setDraftCompleted([...completedQuests]);
    setDraftRecruited(recruitedCharacters.map((c) => ({ ...c })));
    setDraftKrana(
      Object.fromEntries(
        Object.entries(collectedKrana).map(([k, v]) => [k, v ? [...v] : []])
      ) as KranaCollection
    );
    setDraftKraata(
      Object.fromEntries(
        Object.entries(kraataCollection).map(([power, stages]) => [
          power,
          stages ? { ...stages } : {},
        ])
      ) as KraataCollection
    );
    setDraftProtodermis(protodermis);
    setDraftProtodermisCap(protodermisCap);
  }, [
    completedQuests,
    recruitedCharacters,
    collectedKrana,
    kraataCollection,
    protodermis,
    protodermisCap,
  ]);

  const handleApply = () => {
    setCompletedQuests(draftCompleted);
    setRecruitedCharacters(draftRecruited);
    setCollectedKrana(draftKrana);
    setKraataCollection(draftKraata);
    setProtodermisCap(draftProtodermisCap);
    setProtodermis(Math.min(draftProtodermis, draftProtodermisCap));
    onApplied?.();
  };

  const setRecruitedExp = (characterId: string, exp: number) => {
    setDraftRecruited((prev) =>
      prev.map((c) => (c.id === characterId ? { ...c, exp: Math.max(0, exp) } : c))
    );
  };

  const toggleQuest = (questId: string) => {
    setDraftCompleted((prev) =>
      prev.includes(questId) ? prev.filter((id) => id !== questId) : [...prev, questId].sort()
    );
  };

  const toggleRecruited = (characterId: string) => {
    const inList = draftRecruited.some((c) => c.id === characterId);
    if (inList) {
      setDraftRecruited((prev) => prev.filter((c) => c.id !== characterId));
    } else {
      setDraftRecruited((prev) => [...prev, { id: characterId, exp: 0 }]);
    }
  };

  const toggleKrana = (element: KranaElement, kranaId: KranaId) => {
    const current = draftKrana[element] ?? [];
    const next = current.includes(kranaId)
      ? current.filter((id) => id !== kranaId)
      : [...current, kranaId];
    setDraftKrana((prev) => ({ ...prev, [element]: next }));
  };

  const setKraataCount = (power: KraataPower, stage: number, count: number) => {
    setDraftKraata((prev) => {
      const stages = prev[power] ?? {};
      const nextStages = { ...stages };
      if (count <= 0) {
        delete nextStages[stage];
      } else {
        nextStages[stage] = count;
      }
      if (Object.keys(nextStages).length === 0) {
        const next = { ...prev };
        delete next[power];
        return next;
      }
      return { ...prev, [power]: nextStages };
    });
  };

  return (
    <div className="game-state-editor">
      <div className="game-state-editor-header">
        <p className="game-state-editor-hint">
          Changes apply only when you click Apply. The next auto-save will persist them.
        </p>
      </div>

        <div className="game-state-editor-body">
          <section className="game-state-section">
            <h3>Protodermis</h3>
            <div className="game-state-protodermis">
              <label className="game-state-field">
                <span>Current</span>
                <input
                  type="number"
                  min={0}
                  value={draftProtodermis}
                  onChange={(e) =>
                    setDraftProtodermis(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                />
              </label>
              <label className="game-state-field">
                <span>Cap</span>
                <input
                  type="number"
                  min={0}
                  value={draftProtodermisCap}
                  onChange={(e) =>
                    setDraftProtodermisCap(Math.max(0, parseInt(e.target.value, 10) || 0))
                  }
                />
              </label>
            </div>
          </section>

          <section className="game-state-section">
            <h3>Completed Quests</h3>
            <div className="game-state-checklist">
              {QUESTS.map((q) => (
                <label key={q.id} className="game-state-check">
                  <input
                    type="checkbox"
                    checked={draftCompleted.includes(q.id)}
                    onChange={() => toggleQuest(q.id)}
                  />
                  <span>{q.name}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="game-state-section">
            <h3>Recruited Characters</h3>
            <p className="game-state-section-hint">Check to recruit; set Exp to change level.</p>
            <div className="game-state-checklist game-state-recruited-list">
              {RECRUITABLE_IDS.map((id) => {
                const base = CHARACTER_DEX[id];
                const name = base?.name ?? id;
                const recruited = draftRecruited.find((c) => c.id === id);
                const exp = recruited?.exp ?? 0;
                const level = getLevelFromExp(exp);
                return (
                  <div key={id} className="game-state-recruited-row">
                    <label className="game-state-check">
                      <input
                        type="checkbox"
                        checked={!!recruited}
                        onChange={() => toggleRecruited(id)}
                      />
                      <span>{name}</span>
                    </label>
                    {recruited && (
                      <label className="game-state-exp-input">
                        <span>Exp</span>
                        <input
                          type="number"
                          min={0}
                          value={exp}
                          onChange={(e) =>
                            setRecruitedExp(id, Math.max(0, parseInt(e.target.value, 10) || 0))
                          }
                        />
                        <span className="game-state-level-badge">Lv.{level}</span>
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="game-state-section">
            <h3>Collected Krana</h3>
            <p className="game-state-section-hint">By element (Bohrok Krana)</p>
            {KranaElementValues.map((element) => {
              const ids = draftKrana[element] ?? [];
              return (
                <div key={element} className="game-state-krana-row">
                  <strong>{element}:</strong>
                  <div className="game-state-krana-ids">
                    {KranaIds.map((kranaId) => (
                      <label key={kranaId} className="game-state-check game-state-check-inline">
                        <input
                          type="checkbox"
                          checked={ids.includes(kranaId)}
                          onChange={() => toggleKrana(element, kranaId)}
                        />
                        <span>{kranaId}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>

          <section className="game-state-section">
            <h3>Kraata Collection</h3>
            <p className="game-state-section-hint">Power → stage (1–6) → count</p>
            <div className="game-state-kraata-grid">
              {(Object.values(KraataPower) as KraataPower[]).map((power) => {
                const stages = draftKraata[power] ?? {};
                return (
                  <div key={power} className="game-state-kraata-power">
                    <div className="game-state-kraata-power-name">
                      {KRAATA_POWER_NAMES[power] ?? power}
                    </div>
                    <div className="game-state-kraata-stages">
                      {KRAATA_STAGES.map((stage) => (
                        <label key={stage} className="game-state-kraata-stage">
                          <span>{stage}</span>
                          <input
                            type="number"
                            min={0}
                            value={stages[stage] ?? 0}
                            onChange={(e) =>
                              setKraataCount(power, stage, Math.max(0, parseInt(e.target.value, 10) || 0))
                            }
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="game-state-editor-footer">
          <button type="button" className="confirm-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
  );
}
