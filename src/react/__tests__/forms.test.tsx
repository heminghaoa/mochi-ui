import { render, screen, fireEvent } from '@testing-library/react';
import { test, expect, describe } from 'bun:test';
import { Field } from '../Field';
import { Input } from '../Input';
import { Select } from '../Select';
import { Textarea } from '../Textarea';
import { Switch } from '../Switch';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';

// ---------------------------------------------------------------------------
// Field
// ---------------------------------------------------------------------------
describe('Field', () => {
  test('renders label text and htmlFor association so getByLabelText finds the input', () => {
    render(
      <Field label="Username" htmlFor="username">
        <Input id="username" />
      </Field>,
    );
    // getByLabelText uses the htmlFor→id association
    const input = screen.getByLabelText('Username');
    expect(input.tagName.toLowerCase()).toBe('input');
  });

  test('wrapping div has class field', () => {
    render(
      <Field label="Email" htmlFor="email" data-testid="field">
        <Input id="email" />
      </Field>,
    );
    const div = screen.getByTestId('field');
    expect(div.className).toContain('field');
  });
});

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------
describe('Input', () => {
  test('has class input', () => {
    render(<Input data-testid="inp" />);
    expect(screen.getByTestId('inp').className).toContain('input');
  });

  test('user className is appended', () => {
    render(<Input className="extra" data-testid="inp2" />);
    expect(screen.getByTestId('inp2').className).toContain('extra');
  });

  test('controlled value + onChange callback fires with new value', () => {
    let captured = '';
    render(
      <Input
        data-testid="inp3"
        value={captured}
        onChange={(e) => { captured = e.target.value; }}
      />,
    );
    fireEvent.change(screen.getByTestId('inp3'), { target: { value: 'hello' } });
    expect(captured).toBe('hello');
  });
});

// ---------------------------------------------------------------------------
// Select
// ---------------------------------------------------------------------------
describe('Select', () => {
  test('has class select', () => {
    render(
      <Select data-testid="sel">
        <option value="a">A</option>
      </Select>,
    );
    expect(screen.getByTestId('sel').className).toContain('select');
  });

  test('controlled onChange fires with selected value', () => {
    let captured = '';
    render(
      <Select
        data-testid="sel2"
        value={captured}
        onChange={(e) => { captured = e.target.value; }}
      >
        <option value="x">X</option>
        <option value="y">Y</option>
      </Select>,
    );
    fireEvent.change(screen.getByTestId('sel2'), { target: { value: 'y' } });
    expect(captured).toBe('y');
  });
});

// ---------------------------------------------------------------------------
// Textarea
// ---------------------------------------------------------------------------
describe('Textarea', () => {
  test('has class textarea', () => {
    render(<Textarea data-testid="ta" />);
    expect(screen.getByTestId('ta').className).toContain('textarea');
  });

  test('controlled onChange fires with new value', () => {
    let captured = '';
    render(
      <Textarea
        data-testid="ta2"
        value={captured}
        onChange={(e) => { captured = e.target.value; }}
      />,
    );
    fireEvent.change(screen.getByTestId('ta2'), { target: { value: 'world' } });
    expect(captured).toBe('world');
  });
});

// ---------------------------------------------------------------------------
// Switch
// ---------------------------------------------------------------------------
describe('Switch', () => {
  test('uncontrolled: defaultChecked=false, click → input.checked becomes true and onCheckedChange called with true', () => {
    let received: boolean | null = null;
    render(<Switch defaultChecked={false} onCheckedChange={(v) => { received = v; }} data-testid="sw" />);
    const label = screen.getByTestId('sw');
    const input = label.querySelector('input') as HTMLInputElement;
    expect(input.checked).toBe(false);
    fireEvent.click(input);
    expect(input.checked).toBe(true);
    expect(received).toBe(true);
  });

  test('controlled: checked={false}, click does NOT flip input.checked but callback is still called', () => {
    let received: boolean | null = null;
    render(<Switch checked={false} onCheckedChange={(v) => { received = v; }} data-testid="sw2" />);
    const label = screen.getByTestId('sw2');
    const input = label.querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    // controlled — no internal state flip
    expect(input.checked).toBe(false);
    expect(received).toBe(true);
  });

  test('aria-label lands on the label element', () => {
    render(<Switch aria-label="Toggle dark mode" data-testid="sw3" />);
    const label = screen.getByTestId('sw3');
    expect(label.getAttribute('aria-label')).toBe('Toggle dark mode');
  });

  test('label has class switch', () => {
    render(<Switch data-testid="sw4" />);
    expect(screen.getByTestId('sw4').className).toContain('switch');
  });

  test('disabled: click does not trigger onCheckedChange', () => {
    let called = false;
    render(<Switch disabled onCheckedChange={() => { called = true; }} data-testid="sw5" />);
    const input = screen.getByTestId('sw5').querySelector('input') as HTMLInputElement;
    fireEvent.click(input);
    expect(called).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Checkbox
// ---------------------------------------------------------------------------
describe('Checkbox', () => {
  test('clicking children text also toggles the checkbox (label wrap)', () => {
    render(<Checkbox defaultChecked={false}>Accept terms</Checkbox>);
    const input = screen.getByRole('checkbox') as HTMLInputElement;
    expect(input.checked).toBe(false);
    // click the text label — label wraps the input, so it toggles
    fireEvent.click(screen.getByText('Accept terms'));
    expect(input.checked).toBe(true);
  });

  test('checkmark svg is present inside .box', () => {
    render(<Checkbox>Check me</Checkbox>);
    const box = document.querySelector('.box');
    expect(box).not.toBeNull();
    const svg = box!.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  test('label has class check', () => {
    render(<Checkbox data-testid="cb">Label</Checkbox>);
    expect(screen.getByTestId('cb').className).toContain('check');
  });

  test('onCheckedChange fires with correct value', () => {
    let received: boolean | null = null;
    render(<Checkbox defaultChecked={false} onCheckedChange={(v) => { received = v; }}>Click</Checkbox>);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(received).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Radio
// ---------------------------------------------------------------------------
describe('Radio', () => {
  test('two radios with same name: selecting second via change event unchecks first', () => {
    render(
      <div>
        <Radio name="fruit" value="apple" defaultChecked={true} data-testid="r1">
          Apple
        </Radio>
        <Radio name="fruit" value="banana" defaultChecked={false} data-testid="r2">
          Banana
        </Radio>
      </div>,
    );
    const r1 = screen.getByTestId('r1').querySelector('input') as HTMLInputElement;
    const r2 = screen.getByTestId('r2').querySelector('input') as HTMLInputElement;
    expect(r1.checked).toBe(true);
    // fireEvent.change simulates the browser's radio selection reliably in happy-dom
    fireEvent.change(r2, { target: { checked: true } });
    expect(r2.checked).toBe(true);
    // native radio group exclusion: r1 should now be unchecked
    expect(r1.checked).toBe(false);
  });

  test('label has class radio and contains .ring span', () => {
    render(<Radio data-testid="rad">Option</Radio>);
    const label = screen.getByTestId('rad');
    expect(label.className).toContain('radio');
    expect(label.querySelector('.ring')).not.toBeNull();
  });
});
