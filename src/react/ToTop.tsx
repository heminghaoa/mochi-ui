'use client';
import * as React from 'react';
import { Icon } from './Icon.js';

export interface ToTopProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'aria-label'> {
  threshold?: number;
  'aria-label'?: string;
}

export const ToTop = React.forwardRef<HTMLButtonElement, ToTopProps>(
  (
    {
      threshold = 400,
      'aria-label': ariaLabel = 'Back to top',
      className,
      onClick,
      ...rest
    },
    ref,
  ) => {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      const handler = () => setShow(window.scrollY > threshold);
      window.addEventListener('scroll', handler, { passive: true });
      // Run once to set initial state
      handler();
      return () => window.removeEventListener('scroll', handler);
    }, [threshold]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Scroll logic runs first, then the user-provided onClick is called
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
      onClick?.(e);
    };

    const cls = ['to-top', show && 'show', className].filter(Boolean).join(' ');
    return (
      <button
        ref={ref}
        type="button"
        className={cls}
        aria-label={ariaLabel}
        onClick={handleClick}
        {...rest}
      >
        <Icon name="up" />
      </button>
    );
  },
);
ToTop.displayName = 'ToTop';
