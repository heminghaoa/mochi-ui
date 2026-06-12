import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, describe } from 'bun:test';
import { Icon } from '../Icon';
import { IconSprite } from '../IconSprite';
import { Button } from '../Button';
import { Badge } from '../Badge';

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------
describe('Icon', () => {
  test('renders an svg with class pi and correct use href', () => {
    render(<Icon name="leaf" data-testid="i" />);
    const el = screen.getByTestId('i') as SVGSVGElement;
    expect(el.tagName.toLowerCase()).toBe('svg');
    expect(el.className).toContain('pi');
    const use = el.querySelector('use');
    expect(use).not.toBeNull();
    expect(use!.getAttribute('href')).toBe('#pi-leaf');
  });

  test('aria-hidden is true by default', () => {
    render(<Icon name="leaf" data-testid="i2" />);
    const el = screen.getByTestId('i2');
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  test('size prop sets inline width and height', () => {
    render(<Icon name="leaf" size={32} data-testid="i3" />);
    const el = screen.getByTestId('i3') as SVGSVGElement;
    expect(el.style.width).toBe('32px');
    expect(el.style.height).toBe('32px');
  });

  test('aria-hidden absent when aria-label is provided', () => {
    render(<Icon name="leaf" aria-label="叶子" data-testid="i4" />);
    const el = screen.getByTestId('i4');
    expect(el.hasAttribute('aria-hidden')).toBe(false);
  });

  test('user className is appended after pi', () => {
    render(<Icon name="leaf" className="extra" data-testid="i5" />);
    const el = screen.getByTestId('i5');
    expect(el.className).toBe('pi extra');
  });
});

// ---------------------------------------------------------------------------
// IconSprite
// ---------------------------------------------------------------------------
describe('IconSprite', () => {
  test('injects all 25 symbols into the document', () => {
    render(<IconSprite />);
    const symbols = document.querySelectorAll('symbol');
    expect(symbols.length).toBe(25);
  });

  test('pi-leaf symbol is present', () => {
    render(<IconSprite />);
    const leaf = document.querySelector('symbol#pi-leaf');
    expect(leaf).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
describe('Button', () => {
  test('default class is btn (meadow, md, no ghost)', () => {
    render(<Button data-testid="btn">Click</Button>);
    const el = screen.getByTestId('btn');
    expect(el.className).toBe('btn');
  });

  test('color=sky size=sm ghost produces correct classes', () => {
    render(
      <Button color="sky" size="sm" ghost data-testid="btn2">
        Sky
      </Button>,
    );
    const el = screen.getByTestId('btn2');
    expect(el.className).toContain('sky');
    expect(el.className).toContain('small');
    expect(el.className).toContain('ghost');
  });

  test('user className is appended', () => {
    render(<Button className="custom" data-testid="btn3">X</Button>);
    const el = screen.getByTestId('btn3');
    expect(el.className).toContain('custom');
  });

  test('onClick fires', () => {
    let fired = false;
    render(
      <Button data-testid="btn4" onClick={() => { fired = true; }}>
        Go
      </Button>,
    );
    fireEvent.click(screen.getByTestId('btn4'));
    expect(fired).toBe(true);
  });

  test('burst="leaf" click creates .burst-zone in document (matchMedia returns false → not reduced motion)', () => {
    // happy-dom's matchMedia returns matches:false — burst runs normally
    render(<Button burst="leaf" data-testid="btn5">Burst</Button>);
    fireEvent.click(screen.getByTestId('btn5'));
    const zone = document.querySelector('.burst-zone');
    expect(zone).not.toBeNull();
    // cleanup
    zone?.remove();
  });
});

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------
describe('Badge', () => {
  test('default badge has classes badge and green', () => {
    render(<Badge data-testid="b1">leaf</Badge>);
    const el = screen.getByTestId('b1');
    expect(el.className).toContain('badge');
    expect(el.className).toContain('green');
  });

  test('color=coral → class contains badge and pink', () => {
    render(<Badge color="coral" data-testid="b2">hot</Badge>);
    const el = screen.getByTestId('b2');
    expect(el.className).toContain('badge');
    expect(el.className).toContain('pink');
  });

  test('color=lilac → class contains purple', () => {
    render(<Badge color="lilac" data-testid="b3">magic</Badge>);
    const el = screen.getByTestId('b3');
    expect(el.className).toContain('purple');
  });

  test('user className is appended', () => {
    render(<Badge className="extra" data-testid="b4">X</Badge>);
    const el = screen.getByTestId('b4');
    expect(el.className).toContain('extra');
  });
});
