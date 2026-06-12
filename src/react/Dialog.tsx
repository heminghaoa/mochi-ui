'use client';
import * as React from 'react';
import { createPortal } from 'react-dom';

export interface DialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onOpenChange, children, className }: DialogProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange?.(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onOpenChange]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="dialog-backdrop open"
      onClick={(e) => {
        if (e.target === e.currentTarget) onOpenChange?.(false);
      }}
    >
      <div
        className={['dialog', 'sticker', className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
