import * as React from 'react';

export interface FieldProps extends React.ComponentPropsWithoutRef<'div'> {
  label: React.ReactNode;
  htmlFor?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ label, htmlFor, className, children, ...rest }, ref) => {
    const cls = ['field', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
      </div>
    );
  },
);
Field.displayName = 'Field';
