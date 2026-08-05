'use client';
import * as React from 'react';
import { burst, type BurstType } from './burst.js';

export type PokoColor = 'meadow' | 'sky' | 'butter' | 'coral' | 'lilac';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color?: PokoColor;
  size?: 'md' | 'sm';
  ghost?: boolean;
  burst?: BurstType;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'meadow', size = 'md', ghost, burst: burstType, className, onClick, children, ...rest }, ref) => {
    const cls = [
      'btn',
      color !== 'meadow' && color,
      ghost && 'ghost',
      size === 'sm' && 'small',
      className,
    ].filter(Boolean).join(' ');
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (burstType) burst(e.currentTarget, burstType);
      onClick?.(e);
    };
    return (
      <button ref={ref} type="button" className={cls} onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
