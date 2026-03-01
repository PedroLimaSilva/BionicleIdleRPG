import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { CHARACTER_DEX } from '../../data/dex/index';

import type {
  VisualNovelCutscene as VisualNovelCutsceneType,
  VisualNovelStep,
} from '../../types/Cutscenes';
import { isDialogueStep } from '../../types/Cutscenes';
import './index.scss';
import { MatoranAvatar } from '../MatoranAvatar';
import { useTypewriter } from './TypewriterText';

type Props = {
  cutscene: VisualNovelCutsceneType;
  onClose: () => void;
};

function resolveBackgroundStyle(
  bg: string | { type: 'gradient'; from: string; to: string }
): React.CSSProperties {
  if (typeof bg === 'string') {
    return { backgroundImage: `url(${bg})` };
  }
  if (bg.type === 'gradient') {
    return {
      background: `linear-gradient(180deg, ${bg.from} 0%, ${bg.to} 100%)`,
    };
  }
  return {};
}

export function VisualNovelCutscene({ cutscene, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeBackground, setActiveBackground] = useState(cutscene.background);
  const step = cutscene.steps[currentIndex];
  const isLast = currentIndex >= cutscene.steps.length - 1;
  const advanceOrSkipRef = useRef<(() => void) | null>(null);

  const handleAdvance = useCallback(() => {
    if (isLast) {
      onClose();
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [isLast, onClose]);

  useEffect(() => {
    if (step?.type === 'background') {
      setActiveBackground(step.background);
      if (step.autoProceed !== false) {
        handleAdvance();
      }
    }
  }, [step, handleAdvance]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isDialogueOrNarration = step?.type === 'dialogue' || step?.type === 'narration';
        if (isDialogueOrNarration && advanceOrSkipRef.current) {
          advanceOrSkipRef.current();
        } else {
          handleAdvance();
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [step?.type, handleAdvance, onClose]
  );

  const backgroundStyle = useMemo(
    () => resolveBackgroundStyle(activeBackground),
    [activeBackground]
  );

  if (!step) {
    return null;
  }

  let stepView;
  switch (step.type) {
    case 'video':
      stepView = <VideoStepView videoId={step.videoId} onAdvance={handleAdvance} isLast={isLast} />;
      break;
    case 'dialogue':
      stepView = (
        <DialogueStepView
          step={step}
          onAdvance={handleAdvance}
          isLast={isLast}
          advanceOrSkipRef={advanceOrSkipRef}
        />
      );
      break;
    case 'narration':
      stepView = (
        <NarrationStepView
          text={step.text}
          onAdvance={handleAdvance}
          isLast={isLast}
          advanceOrSkipRef={advanceOrSkipRef}
        />
      );
      break;
    case 'background':
      if (step.autoProceed === false) {
        stepView = <BackgroundStepView onAdvance={handleAdvance} isLast={isLast} />;
      }
      break;
    default:
      stepView = null;
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

      <div key={currentIndex} style={{ display: 'contents' }}>
        {stepView}
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

function NarrationStepView({
  text,
  onAdvance,
  isLast,
  advanceOrSkipRef,
}: {
  text: string;
  onAdvance: () => void;
  isLast: boolean;
  advanceOrSkipRef: React.MutableRefObject<(() => void) | null>;
}) {
  const { displayedText, isComplete, skip } = useTypewriter(text);

  const handleClick = useCallback(() => {
    if (isComplete) {
      onAdvance();
    } else {
      skip();
    }
  }, [isComplete, onAdvance, skip]);

  advanceOrSkipRef.current = handleClick;

  return (
    <div className="visual-novel-cutscene__content visual-novel-cutscene__content--narration">
      <div
        className="visual-novel-cutscene__narration-box"
        onClick={handleClick}
        aria-label={isLast ? 'Close cutscene' : 'Next'}
      >
        <div className="visual-novel-cutscene__text">
          <p>
            {displayedText}
            {!isComplete && <span className="visual-novel-cutscene__cursor" />}
          </p>
          <span className={`visual-novel-cutscene__advance`}>
            {isLast ? 'Press to close' : 'Press to continue'}
          </span>
        </div>
      </div>
    </div>
  );
}

function DialogueStepView({
  step,
  onAdvance,
  isLast,
  advanceOrSkipRef,
}: {
  step: Extract<VisualNovelStep, { type: 'dialogue' }>;
  onAdvance: () => void;
  isLast: boolean;
  advanceOrSkipRef: React.MutableRefObject<(() => void) | null>;
}) {
  const { displayedText, isComplete, skip } = useTypewriter(step.text);
  const handleClick = useCallback(() => {
    if (isComplete) {
      onAdvance();
    } else {
      skip();
    }
  }, [isComplete, onAdvance, skip]);

  advanceOrSkipRef.current = handleClick;

  if (!isDialogueStep(step)) return null;
  const speaker = CHARACTER_DEX[step.speakerId];
  const speakerName = speaker?.name ?? step.speakerId;
  const position = step.position ?? 'left';
  const useImage =
    step.portraitType === 'image' || (step.portraitType !== 'avatar' && step.portraitUrl);

  const portrait =
    step.portraitType !== 'none' ? (
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
      )
    ) : undefined;

  return (
    <div
      className={`visual-novel-cutscene__content visual-novel-cutscene__content--dialogue visual-novel-cutscene__content--${position}`}
    >
      <div
        className="visual-novel-cutscene__dialogue-box"
        onClick={handleClick}
        aria-label={isLast ? 'Close cutscene' : 'Next'}
      >
        <div className="visual-novel-cutscene__speaker-side">{portrait}</div>
        <div className={`visual-novel-cutscene__speaker-name element-${speaker?.element}`}>
          {speakerName}
        </div>
        <div className={`visual-novel-cutscene__text element-${speaker?.element}`}>
          <p>
            {displayedText}
            {!isComplete && <span className="visual-novel-cutscene__cursor" />}{' '}
          </p>
          <span className={`visual-novel-cutscene__advance`}>
            {isLast ? 'Press to close' : 'Press to continue'}
          </span>
        </div>
      </div>
    </div>
  );
}

function BackgroundStepView({ onAdvance, isLast }: { onAdvance: () => void; isLast: boolean }) {
  return (
    <div
      className="visual-novel-cutscene__content visual-novel-cutscene__content--background"
      onClick={onAdvance}
      aria-label={isLast ? 'Close cutscene' : 'Next'}
    >
      <span className="visual-novel-cutscene__advance">
        {isLast ? 'Press to close' : 'Press to continue'}
      </span>
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
