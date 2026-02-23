import { useState, useCallback } from 'react';
import { MATORAN_DEX } from '../../data/matoran';
import type { VisualNovelCutscene as VisualNovelCutsceneType } from '../../types/Cutscenes';
import './index.scss';

type Props = {
  cutscene: VisualNovelCutsceneType;
  onClose: () => void;
};

export function VisualNovelCutscene({ cutscene, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const line = cutscene.dialogue[currentIndex];
  const isLast = currentIndex >= cutscene.dialogue.length - 1;

  const handleAdvance = useCallback(() => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast, onClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleAdvance();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [handleAdvance, onClose]
  );

  const backgroundStyle =
    typeof cutscene.background === 'string'
      ? { backgroundImage: `url(${cutscene.background})` }
      : cutscene.background.type === 'gradient'
        ? {
            background: `linear-gradient(180deg, ${cutscene.background.from} 0%, ${cutscene.background.to} 100%)`,
          }
        : {};

  if (!line) {
    return null;
  }

  const speaker = MATORAN_DEX[line.speakerId];
  const speakerName = speaker?.name ?? line.speakerId;
  const portraitColor = speaker?.colors?.body ?? '#6D6E5C';

  return (
    <div
      className="visual-novel-cutscene"
      role="dialog"
      aria-modal="true"
      aria-label="Cutscene"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="visual-novel-cutscene__background" style={backgroundStyle} />

      <div className="visual-novel-cutscene__content">
        <div className="visual-novel-cutscene__portrait-area">
          {line.portraitUrl ? (
            <img
              src={line.portraitUrl}
              alt={speakerName}
              className="visual-novel-cutscene__portrait visual-novel-cutscene__portrait--img"
            />
          ) : (
            <div
              className="visual-novel-cutscene__portrait visual-novel-cutscene__portrait--avatar"
              style={{ backgroundColor: portraitColor }}
              aria-hidden
            >
              <span className="visual-novel-cutscene__portrait-initial">
                {speakerName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="visual-novel-cutscene__dialogue-box">
          <div className="visual-novel-cutscene__speaker-name">{speakerName}</div>
          <p className="visual-novel-cutscene__text">{line.text}</p>
          <button
            type="button"
            className="visual-novel-cutscene__advance"
            onClick={handleAdvance}
            aria-label={isLast ? 'Close cutscene' : 'Next'}
          >
            {isLast ? 'Close' : 'Next ›'}
          </button>
        </div>
      </div>

      <button
        type="button"
        className="visual-novel-cutscene__close"
        onClick={onClose}
        aria-label="Close cutscene"
      >
        ✕
      </button>
    </div>
  );
}
