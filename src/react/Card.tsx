import * as React from 'react';

export interface CardProps extends React.ComponentPropsWithoutRef<'div'> {}

export interface CardArtProps extends React.ComponentPropsWithoutRef<'div'> {
  variant?: 'grass' | 'sky' | 'dusk';
}

export interface CardBodyProps extends React.ComponentPropsWithoutRef<'div'> {}

export interface CardRowProps extends React.ComponentPropsWithoutRef<'div'> {}

function CardArt({ variant = 'grass', className, children, ...rest }: CardArtProps) {
  const cls = ['art', variant, className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

function CardBody({ className, children, ...rest }: CardBodyProps) {
  const cls = ['body', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

function CardRow({ className, children, ...rest }: CardRowProps) {
  const cls = ['row', className].filter(Boolean).join(' ');
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  );
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...rest }, ref) => {
    const cls = ['card', 'sticker', className].filter(Boolean).join(' ');
    return (
      <div ref={ref} className={cls} {...rest}>
        {children}
      </div>
    );
  },
) as React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>> & {
  Art: typeof CardArt;
  Body: typeof CardBody;
  Row: typeof CardRow;
};

Card.displayName = 'Card';
Card.Art = CardArt;
Card.Body = CardBody;
Card.Row = CardRow;
