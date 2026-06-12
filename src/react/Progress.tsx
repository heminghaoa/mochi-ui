import * as React from 'react';

export interface ProgressProps extends React.ComponentPropsWithoutRef<'div'> {
  value: number;
  label?: React.ReactNode;
  variant?: 'vine' | 'sunny';
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, label, variant, className, ...rest }, ref) => {
    const clamped = Math.min(100, Math.max(0, value));
    const cls = ['grow', variant === 'sunny' && 'sunny', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        <div className="meta">
          {label && <span>{label}</span>}
          <span>{clamped}%</span>
        </div>
        <div className="track">
          <div
            className="fill"
            style={{ ['--p' as any]: clamped + '%' }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    );
  },
);
Progress.displayName = 'Progress';
