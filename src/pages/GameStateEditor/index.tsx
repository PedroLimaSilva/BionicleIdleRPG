import { useNavigate } from 'react-router-dom';
import { GameStateEditor } from '../../components/GameStateEditor';

export default function GameStateEditorPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container game-state-editor-page">
      <GameStateEditor onApplied={() => navigate('/settings')} />
    </div>
  );
}
