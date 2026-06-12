import * as React from 'react';

export interface PlankProps extends React.ComponentPropsWithoutRef<'span'> {}

export const Plank = React.forwardRef<HTMLSpanElement, PlankProps>(
  ({ className, children, ...rest }, ref) => {
    const cls = ['plank', className].filter(Boolean).join(' ');
    return (
      <span ref={ref} className={cls} {...rest}>
        {children}
      </span>
    );
  },
);
Plank.displayName = 'Plank';
