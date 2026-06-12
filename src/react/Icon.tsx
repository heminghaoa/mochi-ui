import * as React from 'react';

export const ICON_NAMES = [
  'leaf', 'drop', 'zap', 'berry', 'moon', 'check', 'wrench', 'heart', 'star', 'bug',
  'package', 'backpack', 'book', 'map', 'mushroom', 'bubbles', 'speaker', 'tent',
  'face', 'flower', 'up', 'hammer', 'tile', 'tile-flower', 'goo',
] as const;
export type IconName = (typeof ICON_NAMES)[number];

export interface IconProps extends React.ComponentPropsWithoutRef<'svg'> {
  name: IconName;
  size?: number;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size, className, style, ...rest }, ref) => (
    <svg
      ref={ref}
      className={['pi', className].filter(Boolean).join(' ')}
      style={size ? { width: size, height: size, ...style } : style}
      aria-hidden={rest['aria-label'] ? undefined : true}
      {...rest}
    >
      <use href={`#pi-${name}`} />
    </svg>
  ),
);
Icon.displayName = 'Icon';
