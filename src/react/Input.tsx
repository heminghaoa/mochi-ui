import * as React from 'react';

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    const cls = ['input', className].filter(Boolean).join(' ');
    return <input ref={ref} className={cls} {...rest} />;
  },
);
Input.displayName = 'Input';
