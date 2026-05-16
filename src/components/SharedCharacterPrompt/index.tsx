import { useEffect, useState } from 'react';
import { useGame } from '../../context/Game';
import { BaseMatoran } from '../../types/Matoran';
import {
  findSharedCustomCharacterIdentityMatch,
  parseCustomCharacterShare,
  SHARE_QUERY_PARAM,
} from '../../services/customCharacterShare';
import { SharedCharacterReceivedDialog } from './SharedCharacterReceivedDialog';

/**
 * On mount, inspects `?recruit=…` in the URL and, if it parses to a valid custom-character
 * payload, registers it and shows a one-shot welcome dialog. The query param is consumed
 * (removed from the URL) so it isn't reapplied on refresh / share.
 */
export function SharedCharacterPrompt() {
  const { customCharacters, registerSharedCustomCharacter } = useGame();
  const [welcome, setWelcome] = useState<{
    alreadyOnList: boolean;
    received: BaseMatoran;
  } | null>(null);

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
      const alreadyOnList =
        findSharedCustomCharacterIdentityMatch(customCharacters, parsed) !== undefined;
      const registered = registerSharedCustomCharacter(parsed);
      setWelcome({ alreadyOnList, received: registered });
    }
    // Intentionally only run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!welcome) return null;

  return (
    <SharedCharacterReceivedDialog
      alreadyOnList={welcome.alreadyOnList}
      onDismiss={() => setWelcome(null)}
      received={welcome.received}
    />
  );
}
