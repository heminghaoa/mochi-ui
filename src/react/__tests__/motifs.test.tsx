import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { test, expect, describe, afterEach, beforeEach } from 'bun:test';
import { Signpost } from '../Signpost';
import { NavLink } from '../NavLink';
import { Plank } from '../Plank';
import { CloudSign } from '../CloudSign';
import { WobbleBubble } from '../WobbleBubble';
import { Photo } from '../Photo';
import { ToTop } from '../ToTop';

afterEach(() => cleanup());

// ---------------------------------------------------------------------------
// Signpost
// ---------------------------------------------------------------------------
describe('Signpost', () => {
  test('renders nav.signpost with children', () => {
    render(<Signpost data-testid="sp" aria-label="Main nav">content</Signpost>);
    const el = screen.getByTestId('sp');
    expect(el.tagName.toLowerCase()).toBe('nav');
    expect(el.className).toContain('signpost');
    expect(el.textContent).toBe('content');
  });

  test('extra className is appended', () => {
    render(<Signpost className="extra" data-testid="sp2">x</Signpost>);
    expect(screen.getByTestId('sp2').className).toContain('extra');
  });
});

// ---------------------------------------------------------------------------
// NavLink
// ---------------------------------------------------------------------------
describe('NavLink', () => {
  test('active=true: has class active and aria-current=page', () => {
    render(<NavLink active data-testid="nl">Home</NavLink>);
    const el = screen.getByTestId('nl');
    expect(el.className).toContain('active');
    expect(el.getAttribute('aria-current')).toBe('page');
  });

  test('active=false (default): no active class, no aria-current', () => {
    render(<NavLink data-testid="nl2">Away</NavLink>);
    const el = screen.getByTestId('nl2');
    expect(el.className).not.toContain('active');
    expect(el.getAttribute('aria-current')).toBeNull();
  });

  test('renders as anchor tag with class nav-link', () => {
    render(<NavLink data-testid="nl3">Link</NavLink>);
    const el = screen.getByTestId('nl3');
    expect(el.tagName.toLowerCase()).toBe('a');
    expect(el.className).toContain('nav-link');
  });
});

// ---------------------------------------------------------------------------
// Plank
// ---------------------------------------------------------------------------
describe('Plank', () => {
  test('renders span.plank with children', () => {
    render(<Plank data-testid="pl">Village notice</Plank>);
    const el = screen.getByTestId('pl');
    expect(el.tagName.toLowerCase()).toBe('span');
    expect(el.className).toContain('plank');
    expect(el.textContent).toBe('Village notice');
  });

  test('extra className is appended', () => {
    render(<Plank className="custom" data-testid="pl2">x</Plank>);
    expect(screen.getByTestId('pl2').className).toContain('custom');
  });
});

// ---------------------------------------------------------------------------
// CloudSign
// ---------------------------------------------------------------------------
describe('CloudSign', () => {
  test('title renders inside h3', () => {
    render(<CloudSign title="Open a new meadow" data-testid="cs" />);
    const el = screen.getByTestId('cs');
    const h3 = el.querySelector('h3');
    expect(h3).not.toBeNull();
    expect(h3!.textContent).toBe('Open a new meadow');
  });

  test('svg has aria-hidden=true', () => {
    render(<CloudSign title="Test" data-testid="cs2" />);
    const svg = screen.getByTestId('cs2').querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });

  test('children absent: no p element rendered', () => {
    render(<CloudSign title="No body" data-testid="cs3" />);
    const el = screen.getByTestId('cs3');
    expect(el.querySelector('p')).toBeNull();
  });

  test('children present: p element rendered with content', () => {
    render(
      <CloudSign title="With body" data-testid="cs4">
        Some description text
      </CloudSign>,
    );
    const el = screen.getByTestId('cs4');
    const p = el.querySelector('p');
    expect(p).not.toBeNull();
    expect(p!.textContent).toBe('Some description text');
  });

  test('has class cloud-sign', () => {
    render(<CloudSign title="x" data-testid="cs5" />);
    expect(screen.getByTestId('cs5').className).toContain('cloud-sign');
  });
});

// ---------------------------------------------------------------------------
// WobbleBubble
// ---------------------------------------------------------------------------
describe('WobbleBubble', () => {
  test('seal=true: class contains seal', () => {
    render(<WobbleBubble seal data-testid="wb">Sealed text</WobbleBubble>);
    const el = screen.getByTestId('wb');
    expect(el.className).toContain('seal');
  });

  test('seal absent: no seal class', () => {
    render(<WobbleBubble data-testid="wb2">Normal</WobbleBubble>);
    expect(screen.getByTestId('wb2').className).not.toContain('seal');
  });

  test('children render inside .inner', () => {
    render(<WobbleBubble data-testid="wb3">Spring festival</WobbleBubble>);
    const inner = screen.getByTestId('wb3').querySelector('.inner');
    expect(inner).not.toBeNull();
    expect(inner!.textContent).toBe('Spring festival');
  });

  test('has class wobble-bubble', () => {
    render(<WobbleBubble data-testid="wb4">x</WobbleBubble>);
    expect(screen.getByTestId('wb4').className).toContain('wobble-bubble');
  });
});

// ---------------------------------------------------------------------------
// Photo
// ---------------------------------------------------------------------------
describe('Photo', () => {
  test('caption present: .cap renders with caption text', () => {
    render(
      <Photo caption="Village gate" data-testid="ph">
        <span>image</span>
      </Photo>,
    );
    const el = screen.getByTestId('ph');
    const cap = el.querySelector('.cap');
    expect(cap).not.toBeNull();
    expect(cap!.textContent).toBe('Village gate');
  });

  test('caption absent: no .cap element', () => {
    render(
      <Photo data-testid="ph2">
        <span>image</span>
      </Photo>,
    );
    expect(screen.getByTestId('ph2').querySelector('.cap')).toBeNull();
  });

  test('children render inside .shot', () => {
    render(
      <Photo data-testid="ph3">
        <span data-testid="content">img</span>
      </Photo>,
    );
    const shot = screen.getByTestId('ph3').querySelector('.shot');
    expect(shot).not.toBeNull();
    expect(shot!.querySelector('[data-testid="content"]')).not.toBeNull();
  });

  test('has class photo and .frame child', () => {
    render(<Photo data-testid="ph4">x</Photo>);
    const el = screen.getByTestId('ph4');
    expect(el.className).toContain('photo');
    expect(el.querySelector('.frame')).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ToTop
// ---------------------------------------------------------------------------
describe('ToTop', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 });
  });

  test('initial state: no show class (scrollY=0)', () => {
    render(<ToTop data-testid="tt" />);
    const el = screen.getByTestId('tt');
    expect(el.className).not.toContain('show');
  });

  test('scrollY>threshold: show class is added after scroll event', () => {
    render(<ToTop threshold={400} data-testid="tt2" />);
    const el = screen.getByTestId('tt2');

    act(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 500 });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(el.className).toContain('show');
  });

  test('click calls window.scrollTo with top:0', () => {
    const originalScrollTo = window.scrollTo;
    const calls: ScrollToOptions[] = [];
    window.scrollTo = (options?: ScrollToOptions | number) => {
      if (typeof options === 'object' && options !== null) {
        calls.push(options as ScrollToOptions);
      }
    };

    render(<ToTop data-testid="tt3" />);
    fireEvent.click(screen.getByTestId('tt3'));

    expect(calls.length).toBeGreaterThan(0);
    expect(calls[0].top).toBe(0);

    window.scrollTo = originalScrollTo;
  });

  test('unmount then scroll event does not throw', () => {
    const { unmount } = render(<ToTop data-testid="tt4" />);
    unmount();
    // Should not throw after unmount
    expect(() => {
      Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 600 });
      window.dispatchEvent(new Event('scroll'));
    }).not.toThrow();
  });

  test('default aria-label is "Back to top"', () => {
    render(<ToTop data-testid="tt5" />);
    expect(screen.getByTestId('tt5').getAttribute('aria-label')).toBe('Back to top');
  });

  test('custom aria-label is applied', () => {
    render(<ToTop aria-label="回到顶部" data-testid="tt6" />);
    expect(screen.getByTestId('tt6').getAttribute('aria-label')).toBe('回到顶部');
  });
});
