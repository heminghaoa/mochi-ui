import { render, screen, fireEvent, act, cleanup } from '@testing-library/react';
import { test, expect, describe, afterEach } from 'bun:test';
import { Tabs } from '../Tabs';
import { Dialog } from '../Dialog';
import { Toaster, toast } from '../Toast';

afterEach(() => cleanup());

// ---------------------------------------------------------------------------
// Tabs – uncontrolled
// ---------------------------------------------------------------------------
describe('Tabs (uncontrolled)', () => {
  test('defaultValue="a": tab a selected, panel b hidden', () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a" data-testid="tab-a">A</Tabs.Tab>
          <Tabs.Tab value="b" data-testid="tab-b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" data-testid="panel-a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b" data-testid="panel-b">Panel B</Tabs.Panel>
      </Tabs>,
    );
    expect(screen.getByTestId('tab-a').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('tab-b').getAttribute('aria-selected')).toBe('false');
    expect(screen.getByTestId('panel-a').hidden).toBe(false);
    expect(screen.getByTestId('panel-b').hidden).toBe(true);
  });

  test('clicking tab b switches selection', () => {
    render(
      <Tabs defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a" data-testid="tab-a">A</Tabs.Tab>
          <Tabs.Tab value="b" data-testid="tab-b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a" data-testid="panel-a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b" data-testid="panel-b">Panel B</Tabs.Panel>
      </Tabs>,
    );
    fireEvent.click(screen.getByTestId('tab-b'));
    expect(screen.getByTestId('tab-b').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('tab-a').getAttribute('aria-selected')).toBe('false');
    expect(screen.getByTestId('panel-b').hidden).toBe(false);
    expect(screen.getByTestId('panel-a').hidden).toBe(true);
  });

  test('onValueChange called with "b" when tab b clicked', () => {
    const received: string[] = [];
    render(
      <Tabs defaultValue="a" onValueChange={(v) => received.push(v)}>
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
          <Tabs.Tab value="b" data-testid="tab-b">B</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );
    fireEvent.click(screen.getByTestId('tab-b'));
    expect(received).toEqual(['b']);
  });
});

// ---------------------------------------------------------------------------
// Tabs – controlled
// ---------------------------------------------------------------------------
describe('Tabs (controlled)', () => {
  test('value="a" click tab b: aria-selected stays on a, callback receives "b"', () => {
    const received: string[] = [];
    render(
      <Tabs value="a" onValueChange={(v) => received.push(v)}>
        <Tabs.List>
          <Tabs.Tab value="a" data-testid="tab-a">A</Tabs.Tab>
          <Tabs.Tab value="b" data-testid="tab-b">B</Tabs.Tab>
        </Tabs.List>
      </Tabs>,
    );
    fireEvent.click(screen.getByTestId('tab-b'));
    // controlled – value stays "a"
    expect(screen.getByTestId('tab-a').getAttribute('aria-selected')).toBe('true');
    expect(screen.getByTestId('tab-b').getAttribute('aria-selected')).toBe('false');
    expect(received).toEqual(['b']);
  });
});

// ---------------------------------------------------------------------------
// Dialog
// ---------------------------------------------------------------------------
describe('Dialog', () => {
  test('open=false: role=dialog not in document', () => {
    render(<Dialog open={false} onOpenChange={() => {}}>Content</Dialog>);
    expect(document.querySelector('[role=dialog]')).toBeNull();
  });

  test('open=true: role=dialog rendered with aria-modal', () => {
    render(<Dialog open={true} onOpenChange={() => {}}>Content</Dialog>);
    const dialog = document.querySelector('[role=dialog]');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute('aria-modal')).toBe('true');
  });

  test('Escape keydown triggers onOpenChange(false)', () => {
    const calls: boolean[] = [];
    render(<Dialog open={true} onOpenChange={(v) => calls.push(v)}>Content</Dialog>);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(calls).toEqual([false]);
  });

  test('clicking backdrop (.dialog-backdrop) triggers onOpenChange(false)', () => {
    const calls: boolean[] = [];
    render(<Dialog open={true} onOpenChange={(v) => calls.push(v)}>Content</Dialog>);
    const backdrop = document.querySelector('.dialog-backdrop') as HTMLElement;
    expect(backdrop).not.toBeNull();
    // Dispatch click directly on the backdrop element so target === currentTarget
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(calls).toEqual([false]);
  });

  test('clicking inside dialog does NOT trigger onOpenChange', () => {
    const calls: boolean[] = [];
    render(
      <Dialog open={true} onOpenChange={(v) => calls.push(v)}>
        <button data-testid="inner">Inner</button>
      </Dialog>,
    );
    fireEvent.click(screen.getByTestId('inner'));
    expect(calls).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Toast / Toaster
// ---------------------------------------------------------------------------
describe('Toaster', () => {
  test('toast.ok pushes a message that appears in the Toaster', () => {
    render(<Toaster data-testid="zone" />);
    const zone = screen.getByTestId('zone');
    expect(zone.getAttribute('aria-live')).toBe('polite');

    act(() => {
      toast.ok('star', '收到啦');
    });

    // text visible
    expect(zone.textContent).toContain('收到啦');
    // .toast.ok exists
    const toastEl = zone.querySelector('.toast.ok');
    expect(toastEl).not.toBeNull();
    // ico contains use href=#pi-star
    const use = zone.querySelector('.ico use');
    expect(use).not.toBeNull();
    expect(use!.getAttribute('href')).toBe('#pi-star');
  });
});
