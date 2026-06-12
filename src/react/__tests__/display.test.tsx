import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, describe } from 'bun:test';
import { Progress } from '../Progress';
import { Slider } from '../Slider';
import { Card } from '../Card';
import { Avatar } from '../Avatar';
import { Tooltip } from '../Tooltip';

// ---------------------------------------------------------------------------
// Progress
// ---------------------------------------------------------------------------
describe('Progress', () => {
  test('value=60: fill has --p:60% and aria-valuenow=60', () => {
    render(<Progress value={60} data-testid="pg" />);
    const fill = document.querySelector('.fill') as HTMLElement;
    expect(fill).not.toBeNull();
    expect(fill.style.getPropertyValue('--p')).toBe('60%');
    expect(Number(fill.getAttribute('aria-valuenow'))).toBe(60);
  });

  test('value=150 clamps to 100', () => {
    render(<Progress value={150} data-testid="pg2" />);
    const fill = document.querySelector('.grow[data-testid="pg2"] .fill') as HTMLElement;
    expect(fill.style.getPropertyValue('--p')).toBe('100%');
    expect(Number(fill.getAttribute('aria-valuenow'))).toBe(100);
  });

  test('variant sunny adds class sunny', () => {
    render(<Progress value={50} variant="sunny" data-testid="pg3" />);
    const wrap = screen.getByTestId('pg3');
    expect(wrap.className).toContain('sunny');
  });

  test('label renders in meta', () => {
    render(<Progress value={40} label="Loading" data-testid="pg4" />);
    expect(screen.getByText('Loading')).not.toBeNull();
  });

  test('no label: meta only has value % span', () => {
    render(<Progress value={40} data-testid="pg5" />);
    const meta = document.querySelector('[data-testid="pg5"] .meta');
    expect(meta).not.toBeNull();
    const spans = meta!.querySelectorAll('span');
    // only the percent span, no label span
    expect(spans.length).toBe(1);
    expect(spans[0].textContent).toBe('40%');
  });
});

// ---------------------------------------------------------------------------
// Slider
// ---------------------------------------------------------------------------
describe('Slider', () => {
  test('defaultValue=30, change to 70 → onValueChange(70) and input.value="70"', () => {
    let received: number | null = null;
    render(
      <Slider defaultValue={30} onValueChange={(v) => { received = v; }} data-testid="sl" />,
    );
    const input = screen.getByTestId('sl') as HTMLInputElement;
    expect(input.value).toBe('30');
    fireEvent.change(input, { target: { value: '70' } });
    expect(received).toBe(70);
    expect(input.value).toBe('70');
  });

  test('controlled value=20: change event fires callback but input stays 20', () => {
    let received: number | null = null;
    render(
      <Slider value={20} onValueChange={(v) => { received = v; }} data-testid="sl2" />,
    );
    const input = screen.getByTestId('sl2') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '80' } });
    expect(received).toBe(80);
    expect(input.value).toBe('20');
  });

  test('has class slider', () => {
    render(<Slider data-testid="sl3" />);
    expect(screen.getByTestId('sl3').className).toContain('slider');
  });
});

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------
describe('Card', () => {
  test('Card has classes card and sticker', () => {
    render(<Card data-testid="card">content</Card>);
    const el = screen.getByTestId('card');
    expect(el.className).toContain('card');
    expect(el.className).toContain('sticker');
  });

  test('Card.Art default variant has class art and grass', () => {
    render(
      <Card>
        <Card.Art data-testid="art">img</Card.Art>
      </Card>,
    );
    const el = screen.getByTestId('art');
    expect(el.className).toContain('art');
    expect(el.className).toContain('grass');
  });

  test('Card.Art variant=dusk has class dusk', () => {
    render(
      <Card>
        <Card.Art variant="dusk" data-testid="art2">img</Card.Art>
      </Card>,
    );
    const el = screen.getByTestId('art2');
    expect(el.className).toContain('dusk');
  });

  test('Card.Body has class body', () => {
    render(
      <Card>
        <Card.Body data-testid="body">text</Card.Body>
      </Card>,
    );
    expect(screen.getByTestId('body').className).toContain('body');
  });

  test('Card.Row has class row', () => {
    render(
      <Card>
        <Card.Row data-testid="row">row</Card.Row>
      </Card>,
    );
    expect(screen.getByTestId('row').className).toContain('row');
  });
});

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------
describe('Avatar', () => {
  test('default renders with class avatar and g, and contains use[href=#pi-face]', () => {
    render(<Avatar data-testid="av" />);
    const el = screen.getByTestId('av');
    expect(el.className).toContain('avatar');
    expect(el.className).toContain('g');
    const use = el.querySelector('use');
    expect(use).not.toBeNull();
    expect(use!.getAttribute('href')).toBe('#pi-face');
  });

  test('color="coral" → class avatar p', () => {
    render(<Avatar color="coral" data-testid="av2" />);
    const el = screen.getByTestId('av2');
    expect(el.className).toContain('avatar');
    expect(el.className).toContain('p');
  });

  test('children override the default icon', () => {
    render(<Avatar data-testid="av3">AB</Avatar>);
    const el = screen.getByTestId('av3');
    expect(el.textContent).toBe('AB');
    expect(el.querySelector('use')).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------
describe('Tooltip', () => {
  test('content renders inside .tip', () => {
    render(
      <Tooltip content="Hello tip">
        <span>Trigger</span>
      </Tooltip>,
    );
    const tip = document.querySelector('.tip');
    expect(tip).not.toBeNull();
    expect(tip!.textContent).toBe('Hello tip');
  });

  test('tip-wrap has tabIndex 0', () => {
    render(
      <Tooltip content="Keyboard accessible" data-testid="tw">
        <span>Hover me</span>
      </Tooltip>,
    );
    const wrap = screen.getByTestId('tw');
    expect(wrap.className).toContain('tip-wrap');
    expect(wrap.getAttribute('tabindex')).toBe('0');
  });

  test('children are rendered inside tip-wrap', () => {
    render(
      <Tooltip content="tip text">
        <button data-testid="trigger">Click</button>
      </Tooltip>,
    );
    expect(screen.getByTestId('trigger')).not.toBeNull();
  });
});
