import * as React from 'react';
import { SPRITE } from './sprite.generated.js';

export function IconSprite() {
  return <div style={{ display: 'none' }} aria-hidden dangerouslySetInnerHTML={{ __html: SPRITE }} />;
}
