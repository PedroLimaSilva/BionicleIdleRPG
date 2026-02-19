import './index.scss';

interface TooltipProps {
  /** Tooltip content. When undefined/null/empty, children render without tooltip (for conditional tooltips). */
  content?: React.ReactNode;
  /** Wrapped element(s) that trigger the tooltip on hover/focus. */
  children: React.ReactNode;
}

/**
 * General-purpose tooltip that works on hover (desktop) and focus (mobile, keyboard).
 * Uses CSS anchor positioning with position-try-fallbacks to avoid rendering off-screen.
 * Replaces title attributes for better mobile support.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const hasContent = content !== undefined && content !== null && content !== '';

  if (!hasContent) {
    return <>{children}</>;
  }

  return (
    <span className="tooltip">
      <span className="tooltip__trigger" tabIndex={0}>
        {children}
      </span>
      <span className="tooltip__content" role="tooltip">
        {content}
      </span>
    </span>
  );
}
