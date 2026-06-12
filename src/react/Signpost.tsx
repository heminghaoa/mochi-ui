import * as React from 'react';

export interface SignpostProps extends React.ComponentPropsWithoutRef<'nav'> {}

export const Signpost = React.forwardRef<HTMLElement, SignpostProps>(
  ({ className, children, ...rest }, ref) => {
    const cls = ['signpost', className].filter(Boolean).join(' ');
    return (
      <nav ref={ref} className={cls} {...rest}>
        {children}
      </nav>
    );
  },
);
Signpost.displayName = 'Signpost';
