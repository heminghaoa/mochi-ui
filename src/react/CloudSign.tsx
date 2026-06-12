import * as React from 'react';

export interface CloudSignProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: React.ReactNode;
}

export const CloudSign = React.forwardRef<HTMLDivElement, CloudSignProps>(
  ({ title, className, children, ...rest }, ref) => {
    const cls = ['cloud-sign', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        {/* Cloud shape: 8 circles + 1 rect, exact replica of demo/index.html inline SVG */}
        <svg viewBox="0 0 380 190" aria-hidden={true}>
          <g fill="#FFFFFF">
            <circle cx="78" cy="96" r="48" />
            <circle cx="138" cy="62" r="46" />
            <circle cx="206" cy="52" r="50" />
            <circle cx="276" cy="66" r="44" />
            <circle cx="316" cy="104" r="40" />
            <circle cx="118" cy="128" r="42" />
            <circle cx="196" cy="138" r="44" />
            <circle cx="268" cy="128" r="40" />
            <rect x="78" y="62" width="220" height="76" rx="38" />
          </g>
        </svg>
        <div className="body">
          <h3>{title}</h3>
          {children != null && <p>{children}</p>}
        </div>
      </div>
    );
  },
);
CloudSign.displayName = 'CloudSign';
