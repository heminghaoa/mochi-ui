'use client';
import * as React from 'react';

interface TabsCtx { value: string; setValue: (v: string) => void; }
const Ctx = React.createContext<TabsCtx | null>(null);

export interface TabsProps extends React.ComponentPropsWithoutRef<'div'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ value, defaultValue, onValueChange, className, children, ...rest }: TabsProps) {
  const [inner, setInner] = React.useState(defaultValue ?? '');
  const current = value ?? inner;
  const setValue = (v: string) => { setInner(v); onValueChange?.(v); };
  return (
    <div className={['tabs', className].filter(Boolean).join(' ')} {...rest}>
      <Ctx.Provider value={{ value: current, setValue }}>{children}</Ctx.Provider>
    </div>
  );
}

Tabs.List = function TabsList({ className, ...rest }: React.ComponentPropsWithoutRef<'div'>) {
  return <div role="tablist" className={['tab-list', className].filter(Boolean).join(' ')} {...rest} />;
};

Tabs.Tab = function Tab({ value, className, ...rest }: React.ComponentPropsWithoutRef<'button'> & { value: string }) {
  const ctx = React.useContext(Ctx)!;
  const selected = ctx.value === value;
  return (
    <button
      type="button" role="tab" aria-selected={selected}
      className={['tab-btn', className].filter(Boolean).join(' ')}
      onClick={() => ctx.setValue(value)} {...rest}
    />
  );
};

Tabs.Panel = function TabsPanel({ value, className, ...rest }: React.ComponentPropsWithoutRef<'div'> & { value: string }) {
  const ctx = React.useContext(Ctx)!;
  return (
    <div role="tabpanel" hidden={ctx.value !== value}
      className={['tab-panel', className].filter(Boolean).join(' ')} {...rest} />
  );
};
