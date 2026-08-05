import { describe, expect, test } from 'bun:test';
import { render } from '@testing-library/react';
import * as React from 'react';
import { IconSprite } from '../../src/react';
import { LANGS } from '../i18n';
import { pages } from '../pages';

describe('documentation catalogue', () => {
  test('contains 20 unique logical component pages', () => {
    expect(pages).toHaveLength(20);
    expect(new Set(pages.map((page) => page.id)).size).toBe(20);
  });

  test('every page and prop row has complete trilingual copy', () => {
    for (const page of pages) {
      for (const lang of LANGS) {
        expect(page.title[lang].trim().length).toBeGreaterThan(0);
        expect(page.description[lang].trim().length).toBeGreaterThan(0);
        expect(page.accessibility[lang].trim().length).toBeGreaterThan(0);
        for (const prop of page.props) {
          expect(prop.description[lang].trim().length).toBeGreaterThan(0);
        }
      }
      expect(page.code.trim().length).toBeGreaterThan(0);
      expect(page.componentNames.length).toBeGreaterThan(0);
    }
  });

  for (const page of pages) {
    test(`${page.id} live example renders`, () => {
      const Demo = page.Demo;
      const { container } = render(
        <>
          <IconSprite />
          <Demo lang="en" />
        </>,
      );
      expect(container.childElementCount).toBeGreaterThan(0);
    });
  }
});
