import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameStateEditor } from '../../components/GameStateEditor';
import './index.scss';

export default function GameStateEditorPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container game-state-editor-page">
      <div className="game-state-editor-page-header">
        <Link to="/settings" className="game-state-editor-back">
          <ArrowLeft size={18} aria-hidden /> Back to Settings
        </Link>
        <h1 className="title">Edit Game State</h1>
      </div>
      <GameStateEditor onApplied={() => navigate('/settings')} />
    </div>
  );
}
