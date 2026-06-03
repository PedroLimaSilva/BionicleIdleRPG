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
      bottom: 100,
      height: 100,
      left: 0,
      right: 300,
      toJSON: () => ({}),
      top: 0,
      width: 300,
      x: 0,
      y: 0,
    } as DOMRect;
    const targetRect = {
      bottom: 270,
      height: 20,
      left: 0,
      right: 100,
      toJSON: () => ({}),
      top: 250,
      width: 100,
      x: 0,
      y: 250,
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
