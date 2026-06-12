import * as React from 'react';

export interface NavLinkProps extends React.ComponentPropsWithoutRef<'a'> {
  active?: boolean;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ active, className, children, ...rest }, ref) => {
    const cls = ['nav-link', active && 'active', className].filter(Boolean).join(' ');
    return (
      <a
        ref={ref}
        className={cls}
        aria-current={active ? 'page' : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  },
);
NavLink.displayName = 'NavLink';
