import { useState } from 'react';
import { useGame } from '../../context/Game';
import { RecruitedCharacterData } from '../../types/Matoran';
import { MATORAN_DEX } from '../../data/matoran';
import { isToaMata } from '../../services/matoranUtils';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { MaskPowerTooltip } from '../../components/MaskPowerTooltip';
import { getLevelFromExp } from '../../game/Levelling';

const MAX_TEAM_SIZE = 3;

const enum TeamPosition {
  Left,
  Middle,
  Right,
}

export const BattlePrep: React.FC = () => {
  const { battle, recruitedCharacters } = useGame();
  const { currentEncounter, confirmTeam, retreat } = battle;

  const [selectedTeam, setSelectedTeam] = useState<
    Record<TeamPosition, RecruitedCharacterData | undefined>
  >({
    [TeamPosition.Left]: undefined,
    [TeamPosition.Middle]: undefined,
    [TeamPosition.Right]: undefined,
  });
  const [selectingIndex, setSelectingIndex] = useState<TeamPosition>(TeamPosition.Left);

  const handleClickRecruitedCharacter = (recruited: RecruitedCharacterData) => {
    const newSelectedTeam = { ...selectedTeam };

    // remove duplicate if clicking again from a different slot
    Object.entries(newSelectedTeam).forEach(([pos, member]) => {
      if (member?.id === recruited.id && parseInt(pos) !== selectingIndex) {
        newSelectedTeam[pos as unknown as TeamPosition] = undefined;
      }
    });

    newSelectedTeam[selectingIndex] = recruited;
    setSelectedTeam(newSelectedTeam);

    const nextEmpty = Object.values(newSelectedTeam).findIndex((member) => member === undefined);
    setSelectingIndex(nextEmpty !== -1 ? nextEmpty : MAX_TEAM_SIZE);
  };

  const handleClickSelectedCharacter = (index: number) => {
    setSelectingIndex(index);
  };

  const selectable = recruitedCharacters.filter((c) => isToaMata(MATORAN_DEX[c.id]));

  if (!currentEncounter) return null;

  return (
    <div className="page-container battle">
      <h1 className="title">Select Your Team</h1>
      <div className="battle-arena"></div>
      <div className="battle-prep">
        <h2>Preparing for: {currentEncounter.name}</h2>

        <div className="battle-prep__selected-team">
          {Object.values(selectedTeam).map((member, index) => {
            const focused = index === selectingIndex;
            if (!member) {
              return (
                <div
                  className={`character-card missing ${focused ? 'focused' : ''}`}
                  key={`missing+${index}`}
                  onClick={() => handleClickSelectedCharacter(index)}
                >
                  +
                </div>
              );
            }
            const matoran_dex = MATORAN_DEX[member.id];
            const activeMask = member.maskOverride ?? matoran_dex.mask;
            return (
              <div
                className={`character-card element-${matoran_dex.element} ${
                  focused ? 'focused' : ''
                }`}
                key={`${member.id}+${index}`}
                onClick={() => handleClickSelectedCharacter(index)}
              >
                <MaskPowerTooltip mask={activeMask}>
                  <MatoranAvatar
                    matoran={{ ...matoran_dex, ...member }}
                    styles="matoran-avatar model-preview"
                  />
                </MaskPowerTooltip>
                <div className="card-header">
                  {matoran_dex.name}
                  <div className="level-label">Level {getLevelFromExp(member.exp)}</div>
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
            const activeMask = recruited.maskOverride ?? matoran_dex.mask;
            return (
              <div
                className={`card character-card element-${matoran_dex.element}`}
                key={recruited.id}
                onClick={() => handleClickRecruitedCharacter(recruited)}
              >
                <MaskPowerTooltip mask={activeMask}>
                  <MatoranAvatar
                    matoran={{ ...matoran_dex, ...recruited }}
                    styles="matoran-avatar model-preview"
                  />
                </MaskPowerTooltip>
                <div className="card-header">
                  {matoran_dex.name}
                  <div className="level-label">Level {getLevelFromExp(recruited.exp)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="battle-buttons">
          <button className="cancel-button" onClick={retreat}>
            Retreat
          </button>
          <button
            className="confirm-button"
            disabled={Object.values(selectedTeam).some((m) => !m)}
            onClick={() => confirmTeam(Object.values(selectedTeam) as RecruitedCharacterData[])}
          >
            Begin Battle
          </button>
        </div>
      </div>
    </div>
  );
};
