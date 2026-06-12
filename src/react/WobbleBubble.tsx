import * as React from 'react';

export interface WobbleBubbleProps extends React.ComponentPropsWithoutRef<'div'> {
  seal?: boolean;
}

export const WobbleBubble = React.forwardRef<HTMLDivElement, WobbleBubbleProps>(
  ({ seal, className, children, ...rest }, ref) => {
    const cls = ['wobble-bubble', seal && 'seal', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        <div className="inner">{children}</div>
      </div>
    );
  },
);
WobbleBubble.displayName = 'WobbleBubble';
