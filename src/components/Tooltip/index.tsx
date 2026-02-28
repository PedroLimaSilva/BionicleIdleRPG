import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import './index.scss';

const GAP = 8;
const MAX_WIDTH = 220;
const VIEWPORT_PADDING = 8;

interface TooltipProps {
  /** Tooltip content. When undefined/null/empty, children render without tooltip (for conditional tooltips). */
  content?: React.ReactNode;
  /** Wrapped element(s) that trigger the tooltip on hover/focus. */
  children: React.ReactNode;
}

function getScrollParents(element: HTMLElement): HTMLElement[] {
  const parents: HTMLElement[] = [];
  let current: HTMLElement | null = element;
  while (current) {
    const { overflow, overflowY, overflowX } = getComputedStyle(current);
    const isScrollable =
      overflow === 'auto' ||
      overflow === 'scroll' ||
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowX === 'auto' ||
      overflowX === 'scroll';
    if (isScrollable && current !== document.body) {
      parents.push(current);
    }
    current = current.parentElement;
  }
  return parents;
}

/**
 * General-purpose tooltip that works on hover (desktop) and focus (mobile, keyboard).
 * Renders via portal to escape overflow/transform ancestors. Uses JS positioning with
 * automatic flip when there's insufficient viewport space.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const hasContent = content !== undefined && content !== null && content !== '';

  const triggerRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const tooltipId = useId();

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const tooltipEl = contentRef.current;
    if (!trigger || !tooltipEl || !visible) return;

    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltipEl.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewportWidth - triggerRect.right;

    const tooltipWidth = Math.min(tooltipRect.width, MAX_WIDTH);
    const tooltipHeight = tooltipRect.height;

    type Placement = 'top' | 'bottom' | 'left' | 'right';

    const placements: Placement[] = ['top', 'bottom', 'left', 'right'];
    const requiredSpace: Record<Placement, { block: number; inline: number }> = {
      top: { block: tooltipHeight + GAP, inline: tooltipWidth },
      bottom: { block: tooltipHeight + GAP, inline: tooltipWidth },
      left: { block: tooltipHeight, inline: tooltipWidth + GAP },
      right: { block: tooltipHeight, inline: tooltipWidth + GAP },
    };

    let placement: Placement = 'top';
    for (const p of placements) {
      const { block, inline } = requiredSpace[p];
      const hasBlock =
        p === 'top'
          ? spaceAbove >= block
          : p === 'bottom'
            ? spaceBelow >= block
            : p === 'left'
              ? spaceLeft >= inline
              : spaceRight >= inline;
      const hasInline =
        p === 'top' || p === 'bottom'
          ? spaceLeft >= inline / 2 && spaceRight >= inline / 2
          : spaceAbove >= block / 2 && spaceBelow >= block / 2;
      if (hasBlock && hasInline) {
        placement = p;
        break;
      }
    }

    let top = 0;
    let left = triggerRect.left + triggerRect.width / 2;

    switch (placement) {
      case 'top':
        top = triggerRect.top - tooltipHeight - GAP;
        break;
      case 'bottom':
        top = triggerRect.bottom + GAP;
        break;
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.left - tooltipWidth - GAP;
        break;
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        left = triggerRect.right + GAP;
        break;
      default:
        top = triggerRect.top - tooltipHeight - GAP;
    }

    if (placement === 'top' || placement === 'bottom') {
      left = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
      left = Math.max(VIEWPORT_PADDING, Math.min(viewportWidth - tooltipWidth - VIEWPORT_PADDING, left));
    } else {
      top = Math.max(VIEWPORT_PADDING, Math.min(viewportHeight - tooltipHeight - VIEWPORT_PADDING, top));
    }

    setPosition({ top, left });
  }, [visible]);

  useLayoutEffect(() => {
    if (!visible) return;
    updatePosition();
  }, [visible, updatePosition]);

  useEffect(() => {
    if (!visible) return;

    const trigger = triggerRef.current;
    if (!trigger) return;

    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    const scrollParents = getScrollParents(trigger);
    scrollParents.forEach((el) => el.addEventListener('scroll', handleScrollOrResize));

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      scrollParents.forEach((el) => el.removeEventListener('scroll', handleScrollOrResize));
    };
  }, [visible, updatePosition]);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => {
    setVisible(false);
    setPosition(null);
  };

  if (!hasContent) {
    return <>{children}</>;
  }

  return (
    <>
      <span className="tooltip">
        <span
          ref={triggerRef}
          className="tooltip__trigger"
          tabIndex={0}
          onMouseEnter={showTooltip}
          onMouseLeave={hideTooltip}
          onFocus={showTooltip}
          onBlur={hideTooltip}
          aria-describedby={visible ? tooltipId : undefined}
        >
          {children}
        </span>
      </span>
      {visible &&
        createPortal(
          <div
            ref={contentRef}
            id={tooltipId}
            className="tooltip__content"
            role="tooltip"
            style={
              position
                ? {
                    position: 'fixed',
                    top: position.top,
                    left: position.left,
                    maxWidth: MAX_WIDTH,
                    opacity: 1,
                    visibility: 'visible',
                  }
                : {
                    position: 'fixed',
                    left: -9999,
                    top: 0,
                    opacity: 0,
                    visibility: 'hidden' as const,
                  }
            }
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
}
