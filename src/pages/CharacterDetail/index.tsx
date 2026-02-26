import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../../context/Game';

import './index.scss';
import { CharacterScene } from '../../components/CharacterScene';
import { ElementTag } from '../../components/ElementTag';
import { useEffect, useMemo, useState } from 'react';
import { useSceneCanvas } from '../../hooks/useSceneCanvas';
import { QUESTS } from '../../data/quests';
import {
  getRecruitedMatoran,
  isMatoran,
  isToa,
  isToaMata,
  isBohrok,
} from '../../services/matoranUtils';
import {
  canEvolveBohrokToKal,
  BOHROK_KAL_EVOLUTION_COST,
} from '../../game/BohrokEvolution';
import { LevelProgress } from './LevelProgress';
import { MaskCollection } from './MaskCollection';
import { KranaCollection } from './KranaCollection';
import { JobAssignment } from './JobAssignment';
import { Tabs } from '../../components/Tabs';
import { CharacterChronicle } from './Chronicle';
import { isKranaCollectionActive } from '../../game/Krana';
import { MASK_POWERS } from '../../data/combat';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recruitedCharacters, completedQuests, protodermis, evolveBohrokToKal } = useGame();

  const { setScene } = useSceneCanvas();

  const matoran = useMemo(
    () => getRecruitedMatoran(String(id), recruitedCharacters)!,
    [id, recruitedCharacters]
  );

  const [activeTab, setActiveTab] = useState('stats');

  const tabs = useMemo(() => {
    const base = ['stats'];
    if (isToa(matoran)) {
      base.push('inventory');
    }
    if (isToaMata(matoran) && isKranaCollectionActive(completedQuests)) {
      base.push('krana');
    }
    if (matoran.quest || isMatoran(matoran)) {
      base.push('tasks');
    }
    if (matoran.chronicleId) {
      base.push('chronicle');
    }
    return base;
  }, [matoran, completedQuests]);

  useEffect(() => {
    if (matoran) {
      setScene(<CharacterScene matoran={matoran}></CharacterScene>);
    }
    return () => {
      setScene(null);
    };
  }, [matoran, setScene]);

  const { activeMask, maskDescription } = useMemo(() => {
    if (!isToa(matoran)) {
      return { activeMask: undefined, maskDescription: '' };
    }
    const activeMask = matoran.maskOverride || matoran.mask;
    const maskDescription = MASK_POWERS[activeMask]?.description || 'Unknown Mask Power';
    return { activeMask, maskDescription };
  }, [matoran]);

  if (!matoran) {
    return <p>Something is wrong, this matoran does not exist</p>;
  }

  return (
    <div className={`page-container character-detail element-${matoran.element}`}>
      <div className="character-detail-visualization">
        <div className="character-header">
          <h1 className="character-name">{matoran.name}</h1>
        </div>

        <div id="model-frame">
          <div className="divider"></div>
        </div>
      </div>
      <div className="character-detail-tabs">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={(tab: string) => setActiveTab(tab)} />
      </div>
      <div className="character-detail-content">
        <div className="character-detail-section" id={activeTab}>
          {activeTab === 'stats' && (
            <>
              <LevelProgress exp={matoran.exp} />
              <ElementTag element={matoran.element} showName={true} />
              {isBohrok(matoran) && canEvolveBohrokToKal(matoran) && (
                <div className="bohrok-evolve-section">
                  <p>
                    This Bohrok has reached level 100 and can evolve into Bohrok Kal.
                  </p>
                  <button
                    type="button"
                    className="evolve-button"
                    disabled={protodermis < BOHROK_KAL_EVOLUTION_COST}
                    onClick={() =>
                      evolveBohrokToKal(matoran.id, (evolvedId) =>
                        navigate(`/characters/${evolvedId}`, { replace: true })
                      )
                    }
                  >
                    Evolve to Bohrok Kal ({BOHROK_KAL_EVOLUTION_COST} protodermis)
                  </button>
                  {protodermis < BOHROK_KAL_EVOLUTION_COST && (
                    <p className="evolve-hint">
                      Need {BOHROK_KAL_EVOLUTION_COST - protodermis} more protodermis
                    </p>
                  )}
                </div>
              )}
              {isToa(matoran) && activeMask && (
                <div>
                  <h3>{MASK_POWERS[activeMask]?.longName ?? 'Unknown Mask'}</h3>
                  <p>{maskDescription}</p>
                </div>
              )}
            </>
          )}
          {activeTab === 'inventory' && isToa(matoran) && <MaskCollection matoran={matoran} />}
          {activeTab === 'krana' && isToaMata(matoran) && <KranaCollection matoran={matoran} />}

          {activeTab === 'tasks' && (
            <div>
              {/* Job Assignement  */}
              {isMatoran(matoran) && <JobAssignment matoran={matoran} />}

              {/* Assigned Quest  */}
              {matoran.quest && (
                <div>
                  <p>Assigned Quest:</p>
                  <Link to="/quests">
                    <p>{QUESTS.find((q) => q.id === matoran.quest)!.name}</p>
                  </Link>
                </div>
              )}
            </div>
          )}
          {activeTab === 'chronicle' && matoran.chronicleId && (
            <CharacterChronicle matoran={matoran} />
          )}
        </div>
      </div>
    </div>
  );
};
