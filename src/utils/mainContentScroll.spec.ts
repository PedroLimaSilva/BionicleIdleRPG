/**
 * @jest-environment jsdom
 */
import {
  CHARACTERS_RETURN_SCROLL_ID_KEY,
  consumeCharactersReturnScrollId,
  rememberCharactersReturnScrollId,
  scrollMainContentElementIntoView,
  scrollMainContentToTop,
} from './mainContentScroll';

describe('mainContentScroll', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main class="main-content" style="height: 100px; overflow: auto;">
        <div id="target" style="height: 20px; margin-top: 200px;">target</div>
      </main>
    `;
    sessionStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    sessionStorage.clear();
  });

  it('scrolls main content to top', () => {
    const main = document.querySelector<HTMLElement>('.main-content')!;
    main.scrollTop = 120;
    scrollMainContentToTop();
    expect(main.scrollTop).toBe(0);
  });

  it('scrolls a target element into view within main content', () => {
    const main = document.querySelector<HTMLElement>('.main-content')!;
    const target = document.getElementById('target')!;
    scrollMainContentElementIntoView(target);
    expect(main.scrollTop).toBeGreaterThan(0);
    const mainRect = main.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    expect(targetRect.top).toBeGreaterThanOrEqual(mainRect.top);
    expect(targetRect.bottom).toBeLessThanOrEqual(mainRect.bottom + 1);
  });

  it('remembers and consumes return scroll id', () => {
    rememberCharactersReturnScrollId('Jala');
    expect(sessionStorage.getItem(CHARACTERS_RETURN_SCROLL_ID_KEY)).toBe('Jala');
    expect(consumeCharactersReturnScrollId()).toBe('Jala');
    expect(sessionStorage.getItem(CHARACTERS_RETURN_SCROLL_ID_KEY)).toBeNull();
  });
});
