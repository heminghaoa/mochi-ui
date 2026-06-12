import * as React from 'react';

export interface SelectProps extends React.ComponentPropsWithoutRef<'select'> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...rest }, ref) => {
    const cls = ['select', className].filter(Boolean).join(' ');
    return (
      <select ref={ref} className={cls} {...rest}>
        {children}
      </select>
    );
  },
);
Select.displayName = 'Select';
