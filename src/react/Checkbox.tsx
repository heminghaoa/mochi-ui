'use client';
import * as React from 'react';

export interface CheckboxProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      className,
      children,
      ...labelProps
    },
    ref,
  ) => {
    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
      if (!isControlled) {
        setInternalChecked(e.target.checked);
      }
      onCheckedChange?.(e.target.checked);
      onChange?.(e);
    };

    const inputChecked = isControlled ? checked : internalChecked;
    const cls = ['check', className].filter(Boolean).join(' ');

    return (
      <label className={cls} {...labelProps}>
        <input
          ref={ref}
          type="checkbox"
          checked={inputChecked}
          disabled={disabled}
          onChange={handleChange}
        />
        <span className="box">
          <svg width="16" height="13" viewBox="0 0 16 13" aria-hidden="true">
            <path d="M2 7l4 4 8-9" stroke="#5C4A36" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {children}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';
