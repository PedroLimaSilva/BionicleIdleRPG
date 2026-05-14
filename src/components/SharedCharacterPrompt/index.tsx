import { useEffect, useState } from 'react';
import { useGame } from '../../context/Game';
import { BaseMatoran } from '../../types/Matoran';
import { MatoranAvatar } from '../MatoranAvatar';
import {
  parseCustomCharacterShare,
  SHARE_QUERY_PARAM,
} from '../../services/customCharacterShare';
import './index.scss';

/**
 * On mount, inspects `?recruit=…` in the URL and, if it parses to a valid custom-character
 * payload, registers it and shows a one-shot welcome dialog. The query param is consumed
 * (removed from the URL) so it isn't reapplied on refresh / share.
 */
export function SharedCharacterPrompt() {
  const { registerSharedCustomCharacter } = useGame();
  const [received, setReceived] = useState<BaseMatoran | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const token = url.searchParams.get(SHARE_QUERY_PARAM);
    if (!token) return;

    const parsed = parseCustomCharacterShare(token);

    // Strip the param so the dialog doesn't reappear on reload.
    url.searchParams.delete(SHARE_QUERY_PARAM);
    window.history.replaceState({}, '', url.toString());

    if (parsed) {
      registerSharedCustomCharacter(parsed);
      setReceived(parsed);
    }
    // Intentionally only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!received) return null;

  return (
    <div
      className={`shared-character-backdrop element-${received.element}`}
      role="dialog"
      aria-modal="true"
      data-testid="shared-character-prompt"
    >
      <div className="shared-character-panel">
        <MatoranAvatar matoran={{ ...received, exp: 0 }} styles="shared-character-avatar" />
        <h2 className="shared-character-title">A New Friend Approaches!</h2>
        <p className="shared-character-body">
          Someone shared <strong>{received.name}</strong>, a custom matoran of {received.element},
          with you. They have been added to your recruitment list.
        </p>
        <button
          type="button"
          className={`elemental-btn element-${received.element}`}
          onClick={() => setReceived(null)}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
