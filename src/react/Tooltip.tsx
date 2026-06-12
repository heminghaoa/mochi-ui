import * as React from 'react';

export interface TooltipProps extends Omit<React.ComponentPropsWithoutRef<'span'>, 'content'> {
  content: React.ReactNode;
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  ({ content, children, className, ...rest }, ref) => {
    const cls = ['tip-wrap', className].filter(Boolean).join(' ');
    return (
      <span ref={ref} className={cls} tabIndex={0} {...rest}>
        {children}
        <span className="tip">{content}</span>
      </span>
    );
  },
);
Tooltip.displayName = 'Tooltip';
