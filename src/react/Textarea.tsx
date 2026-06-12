import * as React from 'react';

export interface TextareaProps extends React.ComponentPropsWithoutRef<'textarea'> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...rest }, ref) => {
    const cls = ['textarea', className].filter(Boolean).join(' ');
    return <textarea ref={ref} className={cls} {...rest} />;
  },
);
Textarea.displayName = 'Textarea';
