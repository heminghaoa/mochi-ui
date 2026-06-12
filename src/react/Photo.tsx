import * as React from 'react';

export interface PhotoProps extends React.ComponentPropsWithoutRef<'div'> {
  caption?: React.ReactNode;
}

export const Photo = React.forwardRef<HTMLDivElement, PhotoProps>(
  ({ caption, className, children, ...rest }, ref) => {
    const cls = ['photo', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        <div className="frame">
          <div className="shot">{children}</div>
          {caption != null && <div className="cap">{caption}</div>}
        </div>
      </div>
    );
  },
);
Photo.displayName = 'Photo';
