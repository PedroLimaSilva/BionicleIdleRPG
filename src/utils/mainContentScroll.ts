export const CHARACTERS_RETURN_SCROLL_ID_KEY = 'characters-return-scroll-id';

const MAIN_CONTENT_SELECTOR = '.main-content';

export function getMainContentElement(): HTMLElement | null {
  return document.querySelector<HTMLElement>(MAIN_CONTENT_SELECTOR);
}

export function scrollMainContentToTop(): void {
  const main = getMainContentElement();
  if (!main) return;
  main.scrollTop = 0;
}

export function scrollMainContentElementIntoView(
  element: Element,
  options: ScrollIntoViewOptions = { block: 'nearest' }
): void {
  const main = getMainContentElement();
  if (!main) {
    element.scrollIntoView(options);
    return;
  }

  const mainRect = main.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const offsetTop = elementRect.top - mainRect.top + main.scrollTop;
  const offsetBottom = elementRect.bottom - mainRect.top + main.scrollTop;

  if (offsetTop < main.scrollTop) {
    main.scrollTop = offsetTop;
    return;
  }

  const visibleBottom = main.scrollTop + main.clientHeight;
  if (offsetBottom > visibleBottom) {
    main.scrollTop = offsetBottom - main.clientHeight;
  }
}

export function rememberCharactersReturnScrollId(characterId: string): void {
  try {
    sessionStorage.setItem(CHARACTERS_RETURN_SCROLL_ID_KEY, characterId);
  } catch {
    /* ignore storage errors */
  }
}

export function consumeCharactersReturnScrollId(): string | null {
  try {
    const id = sessionStorage.getItem(CHARACTERS_RETURN_SCROLL_ID_KEY);
    if (id) {
      sessionStorage.removeItem(CHARACTERS_RETURN_SCROLL_ID_KEY);
    }
    return id;
  } catch {
    return null;
  }
}
