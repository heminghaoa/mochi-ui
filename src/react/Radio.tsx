'use client';
import * as React from 'react';

export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  name?: string;
  value?: string | number | readonly string[];
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled,
      name,
      value,
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
    const cls = ['radio', className].filter(Boolean).join(' ');

    return (
      <label className={cls} {...labelProps}>
        <input
          ref={ref}
          type="radio"
          checked={inputChecked}
          disabled={disabled}
          name={name}
          value={value}
          onChange={handleChange}
        />
        <span className="ring" />
        {children}
      </label>
    );
  },
);
Radio.displayName = 'Radio';
