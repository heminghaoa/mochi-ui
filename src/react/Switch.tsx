'use client';
import * as React from 'react';

export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      className,
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
    const cls = ['switch', className].filter(Boolean).join(' ');

    return (
      <label className={cls} {...labelProps}>
        <input
          ref={ref}
          type="checkbox"
          checked={inputChecked}
          disabled={disabled}
          onChange={handleChange}
        />
        <span className="track" />
      </label>
    );
  },
);
Switch.displayName = 'Switch';
