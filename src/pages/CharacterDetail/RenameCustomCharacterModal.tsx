import { useState } from 'react';
import { Modal } from '../../components/Modal';

type Props = {
  currentName: string;
  onClose: () => void;
  onRename: (newName: string) => void;
};

/**
 * Modal shown after a custom character evolves, giving the player a chance to rename them.
 * The current name is pre-filled; the player can confirm it as-is or replace it.
 */
export function RenameCustomCharacterModal({ currentName, onClose, onRename }: Props) {
  const [name, setName] = useState(currentName);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onRename(trimmed);
  };

  return (
    <Modal classNames="rename-custom-modal" onClose={onClose}>
      <h2>Pick a new name?</h2>
      <p>
        Your matoran has reached a new stage. Many take a new name to honor the change. You can
        keep the old one if you prefer.
      </p>
      <input
        type="text"
        className="rename-custom-input"
        value={name}
        maxLength={32}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
        }}
        autoFocus
      />
      <div className="rename-custom-actions">
        <button
          type="button"
          className="elemental-btn"
          onClick={submit}
          disabled={!name.trim()}
        >
          Confirm
        </button>
        <button type="button" className="rename-custom-keep" onClick={onClose}>
          Keep current name
        </button>
      </div>
    </Modal>
  );
}
