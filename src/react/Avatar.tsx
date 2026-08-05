import * as React from 'react';
import { Icon } from './Icon.js';

type AvatarColor = 'meadow' | 'sky' | 'butter' | 'coral';

const COLOR_CLASS: Record<AvatarColor, string> = {
  meadow: 'g',
  sky:    'b',
  butter: 'y',
  coral:  'p',
};

export interface AvatarProps extends React.ComponentPropsWithoutRef<'span'> {
  color?: AvatarColor;
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ color = 'meadow', className, children, ...rest }, ref) => {
    const cls = ['avatar', COLOR_CLASS[color], className].filter(Boolean).join(' ');
    return (
      <span ref={ref} className={cls} {...rest}>
        {children ?? <Icon name="face" />}
      </span>
    );
  },
);
Avatar.displayName = 'Avatar';
