import { useState, useCallback } from 'react';
import { MATORAN_DEX } from '../../data/matoran';
import type {
  VisualNovelCutscene as VisualNovelCutsceneType,
  VisualNovelStep,
} from '../../types/Cutscenes';
import { isDialogueStep, isVideoStep } from '../../types/Cutscenes';
import './index.scss';
import { MatoranAvatar } from '../MatoranAvatar';

type Props = {
  cutscene: VisualNovelCutsceneType;
  onClose: () => void;
};

export function VisualNovelCutscene({ cutscene, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const step = cutscene.steps[currentIndex];
  const isLast = currentIndex >= cutscene.steps.length - 1;

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

  if (!step) {
    return null;
  }

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

      {isVideoStep(step) ? (
        <VideoStepView videoId={step.videoId} onAdvance={handleAdvance} isLast={isLast} />
      ) : (
        <DialogueStepView step={step} onAdvance={handleAdvance} isLast={isLast} />
      )}

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

function DialogueStepView({
  step,
  onAdvance,
  isLast,
}: {
  step: Extract<VisualNovelStep, { type: 'dialogue' }>;
  onAdvance: () => void;
  isLast: boolean;
}) {
  if (!isDialogueStep(step)) return null;
  const speaker = MATORAN_DEX[step.speakerId];
  const speakerName = speaker?.name ?? step.speakerId;
  const position = step.position ?? 'left';
  const useImage =
    step.portraitType === 'image' || (step.portraitType !== 'avatar' && step.portraitUrl);

  const portrait =
    useImage && step.portraitUrl ? (
      <img
        src={step.portraitUrl}
        alt={speakerName}
        className="visual-novel-cutscene__portrait-img"
      />
    ) : (
      <MatoranAvatar
        matoran={{ ...speaker, exp: 0 }}
        styles="visual-novel-cutscene__portrait-avatar"
      />
    );

  return (
    <div
      className={`visual-novel-cutscene__content visual-novel-cutscene__content--dialogue visual-novel-cutscene__content--${position}`}
    >
      <div className="visual-novel-cutscene__dialogue-box">
        <div className="visual-novel-cutscene__speaker-side">{portrait}</div>
        <div className="visual-novel-cutscene__speaker-name">{speakerName}</div>
        <div className="visual-novel-cutscene__text">
          <p>{step.text} </p>
          <button
            type="button"
            className="visual-novel-cutscene__advance"
            onClick={onAdvance}
            aria-label={isLast ? 'Close cutscene' : 'Next'}
          >
            {isLast ? 'Close' : 'Next ›'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VideoStepView({
  videoId,
  onAdvance,
  isLast,
}: {
  videoId: string;
  onAdvance: () => void;
  isLast: boolean;
}) {
  return (
    <div className="visual-novel-cutscene__content visual-novel-cutscene__content--video">
      <div className="visual-novel-cutscene__video-wrapper">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?si=nxWcOaAKDqTtrf2b`}
          title="Cutscene video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <button
        type="button"
        className="visual-novel-cutscene__advance visual-novel-cutscene__advance--video"
        onClick={onAdvance}
        aria-label={isLast ? 'Close cutscene' : 'Next'}
      >
        {isLast ? 'Close' : 'Next ›'}
      </button>
    </div>
  );
}
