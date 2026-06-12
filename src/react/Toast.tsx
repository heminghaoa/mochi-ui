'use client';
import * as React from 'react';
import { Icon, type IconName } from './Icon';

type ToastItem = { id: number; type: 'ok' | 'warn'; icon: IconName; msg: string };
let nextId = 1;
const listeners = new Set<(t: ToastItem) => void>();

function push(type: 'ok' | 'warn', icon: IconName, msg: string) {
  const item: ToastItem = { id: nextId++, type, icon, msg };
  listeners.forEach((l) => l(item));
}

export const toast = {
  ok: (icon: IconName, msg: string) => push('ok', icon, msg),
  warn: (icon: IconName, msg: string) => push('warn', icon, msg),
};

export interface ToasterProps extends React.ComponentPropsWithoutRef<'div'> {}

export function Toaster({ className, ...rest }: ToasterProps) {
  const [items, setItems] = React.useState<(ToastItem & { bye?: boolean })[]>([]);

  React.useEffect(() => {
    const handler = (item: ToastItem) => {
      setItems((prev) => [...prev, item]);

      const timers: ReturnType<typeof setTimeout>[] = [];

      timers.push(
        setTimeout(() => {
          setItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, bye: true } : i)),
          );
        }, 2600),
      );

      timers.push(
        setTimeout(() => {
          setItems((prev) => prev.filter((i) => i.id !== item.id));
        }, 2600 + 320),
      );

      return () => timers.forEach(clearTimeout);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className={['toast-zone', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {items.map((item) => (
        <div
          key={item.id}
          className={['toast', item.type, item.bye && 'bye'].filter(Boolean).join(' ')}
        >
          <span className="ico">
            <Icon name={item.icon} />
          </span>
          {item.msg}
        </div>
      ))}
    </div>
  );
}
