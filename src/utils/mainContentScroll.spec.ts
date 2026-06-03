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

    // jsdom does not compute layout; mock rects so scroll math is exercised.
    const mainRect = {
      top: 0,
      left: 0,
      bottom: 100,
      right: 300,
      width: 300,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    } as DOMRect;
    const targetRect = {
      top: 250,
      left: 0,
      bottom: 270,
      right: 100,
      width: 100,
      height: 20,
      x: 0,
      y: 250,
      toJSON: () => ({}),
    } as DOMRect;

    jest.spyOn(main, 'getBoundingClientRect').mockReturnValue(mainRect);
    jest.spyOn(target, 'getBoundingClientRect').mockReturnValue(targetRect);
    Object.defineProperty(main, 'clientHeight', { configurable: true, value: 100 });

    main.scrollTop = 0;
    scrollMainContentElementIntoView(target);

    // Target bottom (270) is below visible area (100) → scroll to 170.
    expect(main.scrollTop).toBe(170);
  });

  it('remembers and consumes return scroll id', () => {
    rememberCharactersReturnScrollId('Jala');
    expect(sessionStorage.getItem(CHARACTERS_RETURN_SCROLL_ID_KEY)).toBe('Jala');
    expect(consumeCharactersReturnScrollId()).toBe('Jala');
    expect(sessionStorage.getItem(CHARACTERS_RETURN_SCROLL_ID_KEY)).toBeNull();
  });
});
