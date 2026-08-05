import * as React from 'react';
import type { PokoColor } from './Button.js';

const COLOR_CLASS: Record<PokoColor, string> = {
  meadow: 'green',
  sky:    'blue',
  butter: 'yellow',
  coral:  'pink',
  lilac:  'purple',
};

export interface BadgeProps extends React.ComponentPropsWithoutRef<'span'> {
  color?: PokoColor;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ color = 'meadow', className, children, ...rest }, ref) => {
    const cls = ['badge', COLOR_CLASS[color], className].filter(Boolean).join(' ');
    return (
      <span ref={ref} className={cls} {...rest}>
        {children}
      </span>
    );
  },
);
Badge.displayName = 'Badge';
