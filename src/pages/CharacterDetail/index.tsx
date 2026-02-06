import { Link, useParams } from 'react-router-dom';
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
} from '../../services/matoranUtils';
import { LevelProgress } from './LevelProgress';
import { MaskCollection } from './MaskCollection';
import { JobAssignment } from './JobAssignment';

export const CharacterDetail: React.FC = () => {
  const { id } = useParams();
  const { recruitedCharacters } = useGame();

  const { setScene } = useSceneCanvas();

  const matoran = useMemo(
    () => getRecruitedMatoran(String(id), recruitedCharacters)!,
    [id, recruitedCharacters],
  );

  const [activeTab, setActiveTab] = useState('stats');

  const tabs = useMemo(() => {
    const base = ['stats'];
    if (isToa(matoran)) {
      base.push('equipment');
    }
    if (matoran.quest || isMatoran(matoran)) {
      base.push('tasks');
    }
    return base;
  }, [matoran]);

  useEffect(() => {
    if (matoran) {
      setScene(<CharacterScene matoran={matoran}></CharacterScene>);
    }
    return () => {
      setScene(null);
    };
  }, [matoran, setScene]);

  // const combatantStats = useMemo(() => {
  //   return COMBATANT_DEX[matoran.id] || null;
  // }, [matoran]);

  if (!matoran) {
    return <p>Something is wrong, this matoran does not exist</p>;
  }
  return (
    <div
      className={`page-container character-detail element-${matoran.element}`}
    >
      <div className='character-detail-visualization'>
        <div className='character-header'>
          <h1 className='character-name'>{matoran.name}</h1>
        </div>

        <div id='model-frame'>
          <div className='divider'></div>
        </div>
      </div>
      <div className='character-detail-tabs'>
        <div className='character-detail-tabs-inner'>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className='character-detail-content'>
        <div className='divider'></div>
        <div className='character-detail-section'>
          {activeTab === 'stats' && (
            <>
              <LevelProgress exp={matoran.exp} />
              <ElementTag element={matoran.element} showName={true} />
              {/* combatantStats && (
                <div className='character-detail-section combatant-stats'>
                  <h3>Combat Stats</h3>
                  <ul>
                    <li>
                      <strong>HP:</strong> {combatantStats.baseHp}
                    </li>
                    <li>
                      <strong>Attack:</strong> {combatantStats.baseAttack}
                    </li>
                    <li>
                      <strong>Defense:</strong> {combatantStats.baseDefense}
                    </li>
                    <li>
                      <strong>Speed:</strong> {combatantStats.baseSpeed}
                    </li>
                  </ul>
                </div>
              )*/}
            </>
          )}
          {activeTab === 'equipment' && isToa(matoran) && (
            <MaskCollection matoran={matoran} />
          )}

          {activeTab === 'tasks' && (
            <div>
              {/* Job Assignement  */}
              {isMatoran(matoran) && <JobAssignment matoran={matoran} />}

              {/* Assigned Quest  */}
              {matoran.quest && (
                <div>
                  <p>Assigned Quest:</p>
                  <Link to='/quests'>
                    <p>{QUESTS.find((q) => q.id === matoran.quest)!.name}</p>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
