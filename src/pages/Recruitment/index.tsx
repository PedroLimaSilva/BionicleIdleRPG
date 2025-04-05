import { startTransition, useEffect, useMemo, useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { InventoryBar } from '../../components/InventoryBar';
import { ListedMatoran } from '../../types/Matoran';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../providers/Game';
import { CharacterScene } from '../../components/CharacterScene';

export const Recruitment: React.FC = () => {
  const navigate = useNavigate();
  const {
    widgets,
    recruitCharacter,
    availableCharacters,
    recruitedCharacters,
  } = useGame();

  // Compute unrecruited Matoran once
  const unrecruitedCharacters = useMemo(() => {
    const recruitedIds = new Set(recruitedCharacters.map((c) => c.id));
    return availableCharacters.filter((m) => !recruitedIds.has(m.id));
  }, [availableCharacters, recruitedCharacters]);

  const [selectedMatoran, setSelectedMatoran] = useState<ListedMatoran | null>(null);

  const canRecruit = useMemo(
    () => selectedMatoran && widgets >= selectedMatoran.cost,
    [selectedMatoran, widgets]
  );

  useEffect(() => {
    setSelectedMatoran(unrecruitedCharacters[0] || null);
  }, [unrecruitedCharacters]);

  const handleRecruit = (matoran: ListedMatoran) => {
    startTransition(() => {
      setSelectedMatoran(matoran);
    });
  };

  const confirmRecruitment = () => {
    if (selectedMatoran && canRecruit) {
      alert(`${selectedMatoran.name} has been recruited!`);
      recruitCharacter(selectedMatoran);
      setSelectedMatoran(null);
      navigate('/characters');
    }
  };

  return (
    <div className='recruitment-screen'>
      <InventoryBar />
      <div className='recruitment-preview'>
        {selectedMatoran && (
          <div className='model-display fade-in' key={selectedMatoran.id}>
            <CharacterScene matoran={selectedMatoran} />
          </div>
        )}
        <button
          className={`recruit-btn ${canRecruit ? '' : 'disabled'}`}
          onClick={confirmRecruitment}
        >
          Recruit
        </button>
      </div>

      <div className='matoran-selector'>
        <div className='scroll-row'>
          {unrecruitedCharacters.map((matoran) => (
            <div
              key={matoran.id}
              className={`matoran-card element-${matoran.element}`}
              onClick={() => handleRecruit(matoran)}
            >
              <MatoranAvatar
                matoran={matoran}
                styles={'mask-preview matoran-avatar'}
              />
              <div className='name'>{matoran.name}</div>
              <div className='cost'>{matoran.cost} widgets</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
