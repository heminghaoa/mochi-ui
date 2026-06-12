'use client';
import * as React from 'react';

export interface SliderProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type' | 'onChange' | 'value' | 'defaultValue'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ value, defaultValue, onValueChange, min = 0, max = 100, step = 1, className, ...rest }, ref) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue ?? min);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      const num = Number(e.target.value);
      if (!isControlled) {
        setInternalValue(num);
      }
      onValueChange?.(num);
    };

    const inputValue = isControlled ? value : internalValue;
    const cls = ['slider', className].filter(Boolean).join(' ');

    return (
      <input
        ref={ref}
        type="range"
        className={cls}
        value={inputValue}
        min={min}
        max={max}
        step={step}
        onChange={handleChange}
        {...rest}
      />
    );
  },
);
Slider.displayName = 'Slider';
