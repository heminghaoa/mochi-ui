import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Icon,
  IconSprite,
  Plank,
  Toaster,
} from '../src/react';
import {
  getInitialLanguage,
  homeCopy,
  HTML_LANG,
  LANGUAGE_LABELS,
  LANGS,
  localize,
  persistLanguage,
  ui,
  type Lang,
  type Localized,
} from './i18n';
import {
  groups,
  pageById,
  pages,
  type PageDefinition,
  type PageGroup,
} from './pages';

const groupLabel: Record<PageGroup, Localized> = {
  foundations: ui.groupFoundations,
  forms: ui.groupForms,
  feedback: ui.groupFeedback,
  motifs: ui.groupMotifs,
};

function getRouteId(): string | null {
  if (typeof window === 'undefined') return null;
  const match = window.location.hash.match(/^#\/c\/([a-z0-9-]+)$/);
  return match && pageById.has(match[1]) ? match[1] : null;
}

function useRouteId() {
  const [routeId, setRouteId] = React.useState(getRouteId);
  React.useEffect(() => {
    const update = () => setRouteId(getRouteId());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return routeId;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('Copy command was rejected');
}

function CopyButton({ text, lang, compact = false }: { text: string; lang: Lang; compact?: boolean }) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'error'>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const handleCopy = async () => {
    try {
      await copyText(text);
      setState('copied');
    } catch {
      setState('error');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 1800);
  };

  const label = state === 'copied'
    ? localize(ui.copied, lang)
    : state === 'error'
      ? localize(ui.copyFailed, lang)
      : localize(ui.copy, lang);

  return (
    <button type="button" className={compact ? 'copy-button compact' : 'copy-button'} onClick={handleCopy}>
      <Icon name={state === 'copied' ? 'check' : 'book'} />
      <span>{label}</span>
    </button>
  );
}

function LanguageSwitch({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="docs-lang-switch" aria-label="Language">
      {LANGS.map((item) => (
        <button
          type="button"
          key={item}
          aria-pressed={lang === item}
          lang={HTML_LANG[item]}
          onClick={() => onChange(item)}
        >
          {LANGUAGE_LABELS[item]}
        </button>
      ))}
    </div>
  );
}

function Directory({ lang, routeId, onNavigate }: { lang: Lang; routeId: string | null; onNavigate: () => void }) {
  return (
    <>
      <a className={`directory-home${routeId === null ? ' active' : ''}`} href="#/" onClick={onNavigate}>
        <Icon name="tent" />
        {localize(ui.home, lang)}
      </a>
      <div className="directory-groups">
        {groups.map((group) => (
          <section className="directory-group" key={group} aria-labelledby={`group-${group}`}>
            <h2 id={`group-${group}`}>{localize(groupLabel[group], lang)}</h2>
            <div className="directory-links">
              {pages.filter((page) => page.group === group).map((page) => (
                <a
                  key={page.id}
                  href={`#/c/${page.id}`}
                  className={routeId === page.id ? 'active' : undefined}
                  aria-current={routeId === page.id ? 'page' : undefined}
                  onClick={onNavigate}
                >
                  <Icon name={page.icon} />
                  <span>{localize(page.title, lang)}</span>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function Sidebar({ lang, routeId, open, onClose }: { lang: Lang; routeId: string | null; open: boolean; onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        className={`directory-scrim${open ? ' show' : ''}`}
        aria-label={localize(ui.closeMenu, lang)}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside id="site-directory" className={`docs-sidebar${open ? ' open' : ''}`} aria-label={localize(ui.components, lang)}>
        <div className="sidebar-brand">
          <a href="#/" onClick={onClose} aria-label="Pokoland UI">
            <Plank>Pokoland UI</Plank>
          </a>
          <p>{localize(ui.brandNote, lang)}</p>
          <Badge color="meadow"><Icon name="leaf" /> v0.3.0</Badge>
        </div>
        <nav className="directory-nav">
          <Directory lang={lang} routeId={routeId} onNavigate={onClose} />
        </nav>
        <div className="sidebar-links">
          <a href="https://github.com/heminghaoa/pokoland-ui" target="_blank" rel="noreferrer">
            <Icon name="wrench" /> GitHub
          </a>
          <a href="https://www.npmjs.com/package/pokoland-ui" target="_blank" rel="noreferrer">
            <Icon name="package" /> npm
          </a>
          <a href="../demo/">
            <Icon name="map" /> {localize(ui.demo, lang)}
          </a>
        </div>
      </aside>
    </>
  );
}

const quickStartCode = `import { Button, IconSprite } from 'pokoland-ui';
import 'pokoland-ui/styles.css';

export function App() {
  return (
    <>
      <IconSprite />
      <Button color="sky" burst="splash">Jump in</Button>
    </>
  );
}`;

function HomePage({ lang }: { lang: Lang }) {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><Icon name="leaf" /> {localize(homeCopy.eyebrow, lang)}</p>
          <h1>{localize(homeCopy.title, lang).split('\n').map((line) => <span key={line}>{line}</span>)}</h1>
          <p className="hero-lead">{localize(homeCopy.lead, lang)}</p>
          <div className="hero-actions">
            <a className="btn icon-btn" href="#/c/button">
              <Icon name="map" /> {localize(homeCopy.browse, lang)}
            </a>
            <a className="text-link" href="../demo/">
              {localize(homeCopy.vanilla, lang)} <Icon name="up" />
            </a>
          </div>
        </div>
        <div className="hero-pocket" aria-label={localize(ui.liveExample, lang)}>
          <span className="pocket-note">{localize(ui.liveExample, lang)}</span>
          <div className="pocket-sky" aria-hidden="true"><span /><span /></div>
          <Avatar color="butter" className="pocket-avatar" />
          <Button color="coral" size="sm" burst="leaf"><Icon name="heart" /> Pokoland</Button>
          <Badge color="sky"><Icon name="drop" /> React 18+</Badge>
        </div>
      </section>

      <section className="install-strip" aria-labelledby="install-title">
        <div>
          <p className="step-number">01</p>
          <div>
            <span className="section-kicker">{localize(homeCopy.firstStep, lang)}</span>
            <h2 id="install-title">{localize(homeCopy.firstStepTitle, lang)}</h2>
          </div>
        </div>
        <div className="install-command">
          <code>npm install pokoland-ui</code>
          <CopyButton text="npm install pokoland-ui" lang={lang} compact />
        </div>
      </section>

      <section className="promise-trail" aria-label={localize(homeCopy.trailTitle, lang)}>
        <article>
          <span className="trail-marker meadow"><Icon name="zap" /></span>
          <div><h2>{localize(homeCopy.promiseOneTitle, lang)}</h2><p>{localize(homeCopy.promiseOne, lang)}</p></div>
        </article>
        <article>
          <span className="trail-marker sky"><Icon name="check" /></span>
          <div><h2>{localize(homeCopy.promiseTwoTitle, lang)}</h2><p>{localize(homeCopy.promiseTwo, lang)}</p></div>
        </article>
        <article>
          <span className="trail-marker butter"><Icon name="package" /></span>
          <div><h2>{localize(homeCopy.promiseThreeTitle, lang)}</h2><p>{localize(homeCopy.promiseThree, lang)}</p></div>
        </article>
      </section>

      <section className="quick-start reference-section" aria-labelledby="quick-start-title">
        <div className="quick-start-copy">
          <p className="step-number">02</p>
          <span className="section-kicker">React</span>
          <h2 id="quick-start-title">{localize(homeCopy.trailTitle, lang)}</h2>
          <p>{localize(homeCopy.trail, lang)}</p>
          <a className="text-link" href="#/c/button">Button <Icon name="up" /></a>
        </div>
        <CodeBlock code={quickStartCode} lang={lang} />
      </section>

      <ComponentMap lang={lang} />
    </div>
  );
}

function ComponentMap({ lang }: { lang: Lang }) {
  return (
    <section className="component-map reference-section" aria-labelledby="component-map-title">
      <div className="component-map-heading">
        <span className="section-kicker">20 {localize(ui.components, lang)}</span>
        <h2 id="component-map-title">{localize(ui.onThisPage, lang)}</h2>
      </div>
      <div className="component-map-groups">
        {groups.map((group) => (
          <div key={group}>
            <h3>{localize(groupLabel[group], lang)}</h3>
            <div>
              {pages.filter((page) => page.group === group).map((page) => (
                <a href={`#/c/${page.id}`} key={page.id}>
                  <Icon name={page.icon} /> {localize(page.title, lang)}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: Lang }) {
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{localize(ui.code, lang)}</span>
        <CopyButton text={code} lang={lang} compact />
      </div>
      <pre tabIndex={0}><code>{code}</code></pre>
    </div>
  );
}

function PropsTable({ page, lang }: { page: PageDefinition; lang: Lang }) {
  return (
    <div className="props-scroll" tabIndex={0}>
      <table>
        <thead>
          <tr>
            <th scope="col">{localize(ui.prop, lang)}</th>
            <th scope="col">{localize(ui.type, lang)}</th>
            <th scope="col">{localize(ui.default, lang)}</th>
            <th scope="col">{localize(ui.description, lang)}</th>
          </tr>
        </thead>
        <tbody>
          {page.props.map((row) => (
            <tr key={row.name}>
              <th scope="row"><code>{row.name}</code></th>
              <td data-label={localize(ui.type, lang)}><code>{row.type}</code></td>
              <td data-label={localize(ui.default, lang)}><code>{row.defaultValue}</code></td>
              <td data-label={localize(ui.description, lang)}>{localize(row.description, lang)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentPage({ page, lang }: { page: PageDefinition; lang: Lang }) {
  const index = pages.indexOf(page);
  const previous = pages[index - 1];
  const next = pages[index + 1];
  const Demo = page.Demo;

  return (
    <article className="component-page">
      <header className="component-header">
        <a className="breadcrumb" href="#/">Pokoland UI</a>
        <div className="component-title-row">
          <span className="component-mark"><Icon name={page.icon} /></span>
          <div>
            <p className="component-api">{page.componentNames.join(' · ')}</p>
            <h1>{localize(page.title, lang)}</h1>
          </div>
        </div>
        <p className="component-lead">{localize(page.description, lang)}</p>
      </header>

      <section className="demo-section" aria-labelledby="live-example-title">
        <div className="section-heading">
          <span className="section-index">01</span>
          <h2 id="live-example-title">{localize(ui.liveExample, lang)}</h2>
        </div>
        <div className="demo-surface">
          <span className="demo-surface-label">Pokoland Meadow</span>
          <Demo lang={lang} />
        </div>
      </section>

      <section className="reference-section" aria-labelledby="code-title">
        <div className="section-heading">
          <span className="section-index">02</span>
          <h2 id="code-title">{localize(ui.code, lang)}</h2>
        </div>
        <CodeBlock code={page.code} lang={lang} />
      </section>

      <section className="reference-section" aria-labelledby="props-title">
        <div className="section-heading">
          <span className="section-index">03</span>
          <h2 id="props-title">{localize(ui.props, lang)}</h2>
        </div>
        <PropsTable page={page} lang={lang} />
      </section>

      <section className="a11y-note reference-section" aria-labelledby="a11y-title">
        <span className="a11y-icon"><Icon name="heart" /></span>
        <div>
          <h2 id="a11y-title">{localize(ui.accessibility, lang)}</h2>
          <p>{localize(page.accessibility, lang)}</p>
        </div>
      </section>

      <nav className="page-turner" aria-label={localize(ui.components, lang)}>
        {previous ? (
          <a href={`#/c/${previous.id}`} className="previous-page">
            <span>{localize(ui.previous, lang)}</span>
            <strong><Icon name="up" /> {localize(previous.title, lang)}</strong>
          </a>
        ) : <span />}
        {next && (
          <a href={`#/c/${next.id}`} className="next-page">
            <span>{localize(ui.next, lang)}</span>
            <strong>{localize(next.title, lang)} <Icon name="up" /></strong>
          </a>
        )}
      </nav>
    </article>
  );
}

export function App() {
  const routeId = useRouteId();
  const page = routeId ? pageById.get(routeId) ?? null : null;
  const [lang, setLang] = React.useState<Lang>(getInitialLanguage);
  const [directoryOpen, setDirectoryOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.lang = HTML_LANG[lang];
    const pageName = page ? localize(page.title, lang) : 'Pokoland UI';
    document.title = `${pageName} · Pokoland UI`;
    persistLanguage(lang);
  }, [lang, page]);

  React.useEffect(() => {
    setDirectoryOpen(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [routeId]);

  React.useEffect(() => {
    if (!directoryOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDirectoryOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [directoryOpen]);

  return (
    <>
      <IconSprite />
      <a className="skip-link" href="#main-content">{localize(ui.skip, lang)}</a>
      <div className="docs-scenery" aria-hidden="true">
        <span className="scenery-cloud cloud-one" />
        <span className="scenery-cloud cloud-two" />
        <span className="scenery-hill hill-one" />
        <span className="scenery-hill hill-two" />
      </div>
      <header className="mobile-header">
        <a href="#/" className="mobile-brand">Pokoland UI</a>
        <button
          type="button"
          className="menu-button"
          aria-expanded={directoryOpen}
          aria-controls="site-directory"
          aria-label={directoryOpen ? localize(ui.closeMenu, lang) : localize(ui.menu, lang)}
          onClick={() => setDirectoryOpen((open) => !open)}
        >
          <Icon name={directoryOpen ? 'check' : 'map'} />
        </button>
      </header>
      <Sidebar lang={lang} routeId={routeId} open={directoryOpen} onClose={() => setDirectoryOpen(false)} />
      <div
        className="desktop-tools"
        inert={directoryOpen ? '' : undefined}
        aria-hidden={directoryOpen || undefined}
      >
        <LanguageSwitch lang={lang} onChange={setLang} />
        <a className="round-tool" href="https://github.com/heminghaoa/pokoland-ui" target="_blank" rel="noreferrer" aria-label={localize(ui.github, lang)}>
          <Icon name="wrench" />
        </a>
      </div>
      <main
        id="main-content"
        className="docs-main"
        tabIndex={-1}
        inert={directoryOpen ? '' : undefined}
        aria-hidden={directoryOpen || undefined}
      >
        {page ? <ComponentPage page={page} lang={lang} /> : <HomePage lang={lang} />}
        <footer className="docs-footer">
          <Icon name="leaf" /> {localize(ui.footer, lang)}
        </footer>
      </main>
      <Toaster />
    </>
  );
}
