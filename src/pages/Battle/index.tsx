import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/Game';
import { MATORAN_DEX } from '../../data/matoran';
import { BattlePhase } from '../../hooks/useBattleState';
import { useEffect, useState } from 'react';
import { ENEMY_DEX } from '../../data/combat';
import { RecruitedCharacterData } from '../../types/Matoran';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { getLevelFromExp } from '../../game/Levelling';
import { isToaMata } from '../../services/matoranUtils';

const MAX_TEAM_SIZE = 3;

const NULL_MEMBER = { id: null };

export const BattlePage: React.FC = () => {
  const navigate = useNavigate();
  const { battle, recruitedCharacters } = useGame();
  const { currentEncounter, phase, confirmTeam, retreat } = battle;

  const [selectedTeam, setSelectedTeam] = useState<
    (RecruitedCharacterData | typeof NULL_MEMBER)[]
  >([NULL_MEMBER, NULL_MEMBER, NULL_MEMBER]);
  const [selectingIndex, setSelectingIndex] = useState<number>(0);

  useEffect(() => {
    if (!currentEncounter) {
      navigate('/battle/selector');
    }
  }, [navigate, currentEncounter]);

  if (!currentEncounter) {
    return null;
  }

  const handleClickRecruitedCharacter = (recruited: RecruitedCharacterData) => {
    let newSelectedTeam: (RecruitedCharacterData | typeof NULL_MEMBER)[] =
      selectedTeam.filter((s) => s.id !== recruited.id);
    console.log(
      'handleClickRecruitedCharacter',
      JSON.stringify(newSelectedTeam),
      selectingIndex,
      recruited
    );
    newSelectedTeam = newSelectedTeam.toSpliced(selectingIndex, 1, recruited);

    setSelectedTeam(newSelectedTeam);
    console.log(
      'handleClickRecruitedCharacter',
      JSON.stringify(newSelectedTeam)
    );
    setSelectingIndex((prev) => prev + 1);
  };

  const handleClickSelectedCharacter = (index: number) => {
    setSelectingIndex(index);
  };

  if (phase === BattlePhase.Preparing) {
    const selectable = recruitedCharacters.filter((c) => {
      return isToaMata(MATORAN_DEX[c.id]);
    }); // Add filters if needed
    return (
      <div className='page-container'>
        <h1 className='title'>Select Your Team</h1>
        <div className='battle-prep'>
          <h2>Preparing for: {currentEncounter.name}</h2>
          <div className='battle-prep__selected-team'>
            {selectedTeam.map((member, index) => {
              const focused = index === selectingIndex;
              if (member.id === null) {
                return (
                  <div
                    className={`character-card missing ${focused && 'focused'}`}
                    key={`missing+${index}`}
                    onClick={() => handleClickSelectedCharacter(index)}
                  >
                    +
                  </div>
                );
              }
              const matoran_dex = MATORAN_DEX[member.id];
              return (
                <div
                  className={`character-card element-${matoran_dex.element} ${
                    focused && 'focused'
                  }`}
                  key={`${member.id}+${index}`}
                  onClick={() => handleClickSelectedCharacter(index)}
                >
                  <MatoranAvatar
                    matoran={{ ...matoran_dex, ...member }}
                    styles={'matoran-avatar model-preview'}
                  />
                  <div className='card-header'>
                    {'  ' + matoran_dex.name}
                    <div className='level-label'>
                      Level {getLevelFromExp(member.exp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div
            className={`battle-prep__team-selector scroll-row ${
              selectingIndex < MAX_TEAM_SIZE ? '' : 'hidden'
            }`}
          >
            {selectable.map((recruited) => {
              const matoran_dex = MATORAN_DEX[recruited.id];
              return (
                <div
                  className={`card character-card element-${matoran_dex.element}`}
                  key={recruited.id}
                  onClick={() => {
                    handleClickRecruitedCharacter(recruited);
                  }}
                >
                  <MatoranAvatar
                    matoran={{ ...matoran_dex, ...recruited }}
                    styles={'matoran-avatar model-preview'}
                  />
                  <div className='card-header'>
                    {'  ' + matoran_dex.name}
                    <div className='level-label'>
                      Level {getLevelFromExp(recruited.exp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className='battle-buttons'>
            <button className='cancel-button' onClick={() => retreat()}>
              Retreat
            </button>
            <button
              className='confirm-button'
              disabled={
                selectedTeam.length < MAX_TEAM_SIZE ||
                selectedTeam.includes(NULL_MEMBER)
              }
              onClick={() =>
                confirmTeam(selectedTeam as RecruitedCharacterData[])
              }
            >
              Begin Battle
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === BattlePhase.Inprogress) {
    return (
      <div className='page-container'>
        <h1 className='title'>Wave {battle.currentWave}</h1>
        <p>Enemies:</p>
        <ul>
          {battle.enemies.map((enemy) => (
            <li key={enemy.id}>{ENEMY_DEX[enemy.id].name}</li>
          ))}
        </ul>
        {/* Add attack options, retreat button, etc. */}
        <div className='battle-buttons'>
          <button className='cancel-button' onClick={() => retreat()}>
            Retreat
          </button>
          <button className='confirm-button' disabled={true} onClick={() => {}}>
            Next Wave
          </button>
        </div>
      </div>
    );
  }

  if (phase === BattlePhase.Retreated) {
    return (
      <div className='page-container'>
        <h1>Battle results</h1>
        <p>Battle summary goes here</p>
        {/* Add attack options, retreat button, etc. */}
        <div className='battle-buttons' style={{ justifyContent: 'center' }}>
          <Link to='/battle/selector'>
            <button className='confirm-button' onClick={() => {}}>
              Collect Rewards
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return <div className='page-container'>Battle status: {phase}</div>;
};
