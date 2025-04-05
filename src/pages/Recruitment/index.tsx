import { startTransition, useEffect, useMemo, useState } from 'react';

import './index.scss';
import { MatoranAvatar } from '../../components/MatoranAvatar';
import { InventoryBar } from '../../components/InventoryBar';
import { Matoran } from '../../types/Matoran';
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
  const [selectedMatoran, setSelectedMatoran] = useState<Matoran | null>(null);
  const canRecruit = useMemo(
    () => selectedMatoran && widgets >= selectedMatoran.cost,
    [selectedMatoran, widgets]
  );

  useEffect(() => {
    setSelectedMatoran(
      availableCharacters.filter(
        (m) => !recruitedCharacters.find((c) => c.id === m.id)
      )[0]
    );
  }, [availableCharacters, recruitedCharacters]);

  const handleRecruit = (matoran: Matoran) => {
    startTransition(() => {
      setSelectedMatoran(matoran);
    });
  };

  const confirmRecruitment = () => {
    if (selectedMatoran && canRecruit) {
      alert(`${selectedMatoran.name} has been recruited!`);
      recruitCharacter(selectedMatoran, selectedMatoran.cost);
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
            <CharacterScene matoran={selectedMatoran}></CharacterScene>
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
          {availableCharacters
            .filter((m) => !recruitedCharacters.find((c) => c.id === m.id))
            .map((matoran) => (
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
