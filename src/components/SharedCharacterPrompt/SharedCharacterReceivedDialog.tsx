import { BaseMatoran } from '../../types/Matoran';
import { MatoranAvatar } from '../../rendering/2d/MatoranAvatar';
import './index.scss';

type Props = {
  alreadyOnList?: boolean;
  onDismiss: () => void;
  received: BaseMatoran;
};

/** Welcome overlay after a shared custom character is registered (URL or in-app redeem). */
export function SharedCharacterReceivedDialog({
  alreadyOnList = false,
  onDismiss,
  received,
}: Props) {
  return (
    <div
      className={`shared-character-backdrop element-${received.element}`}
      role="dialog"
      aria-modal="true"
      data-testid="shared-character-prompt"
    >
      <div className="shared-character-panel">
        <MatoranAvatar matoran={{ ...received, exp: 0 }} styles="shared-character-avatar" />
        <h2 className="shared-character-title">
          {alreadyOnList ? 'Already in recruitment' : 'A New Friend Approaches!'}
        </h2>
        <p className="shared-character-body">
          {alreadyOnList ? (
            <>
              <strong>{received.name}</strong> was already on your recruitment list from this share
              link.
            </>
          ) : (
            <>
              Someone shared <strong>{received.name}</strong>, a custom matoran of{' '}
              {received.element}, with you. They have been added to your recruitment list.
            </>
          )}
        </p>
        <button
          type="button"
          className={`elemental-btn element-${received.element}`}
          onClick={onDismiss}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
