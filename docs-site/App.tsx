import * as React from 'react';
import {
  Icon,
  IconSprite,
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
          aria-label={LANGUAGE_LABELS[item]}
          title={LANGUAGE_LABELS[item]}
          onClick={() => onChange(item)}
        >
          {item === 'zh' ? '中' : item === 'ja' ? '日' : 'EN'}
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

function Sidebar({
  lang,
  routeId,
  open,
  onClose,
  closeButtonRef,
}: {
  lang: Lang;
  routeId: string | null;
  open: boolean;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <>
      <button
        type="button"
        className={`directory-scrim${open ? ' show' : ''}`}
        aria-label={localize(ui.closeMenu, lang)}
        tabIndex={open ? 0 : -1}
        onClick={onClose}
      />
      <aside
        id="site-directory"
        className={`docs-sidebar${open ? ' open' : ''}`}
        aria-label={localize(ui.components, lang)}
        aria-modal="true"
        role="dialog"
      >
        <div className="sidebar-brand">
          <div className="directory-title">
            <span className="directory-mark"><Icon name="map" /></span>
            <div>
              <span className="directory-kicker">Pokoland field guide · v0.3.0</span>
              <h2>{localize(ui.components, lang)}</h2>
              <p>{localize(ui.brandNote, lang)}</p>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="directory-close"
            aria-label={localize(ui.closeMenu, lang)}
            onClick={onClose}
          >
            <Icon name="check" />
          </button>
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

const logoLetters = 'PokolandUI'.split('');

function PokolandLogo() {
  return (
    <h1 className="pokoland-logo" aria-label="Pokoland UI">
      {logoLetters.map((letter, index) => (
        <span
          className={`puff${letter === 'U' ? ' word-gap' : ''}`}
          data-ch={letter}
          aria-hidden="true"
          key={`${letter}-${index}`}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}

function GrassIsland() {
  return (
    <div className="hero-blob" aria-hidden="true">
      <svg viewBox="0 0 720 250" preserveAspectRatio="none">
        <defs>
          <pattern id="docs-grass-patch" width="112" height="112" patternUnits="userSpaceOnUse">
            <rect width="112" height="112" fill="#cde56e" />
            <rect x="0" y="0" width="50" height="50" fill="#bfdb59" />
            <rect x="56" y="56" width="50" height="50" fill="#bfdb59" />
            <rect x="62" y="8" width="28" height="28" fill="#d9ef87" />
            <rect x="8" y="64" width="24" height="24" fill="#d9ef87" />
            <rect x="34" y="34" width="22" height="22" fill="#c6e162" />
            <rect x="90" y="38" width="22" height="18" fill="#c6e162" />
          </pattern>
        </defs>
        <path
          d="M62,138 C40,100 84,58 140,64 C160,26 240,16 296,40 C336,12 432,12 472,40 C530,18 622,40 642,84 C692,100 700,152 658,178 C684,214 616,242 556,228 C516,252 416,254 368,236 C316,254 226,250 192,228 C128,242 70,214 80,178 C40,166 42,150 62,138 Z"
          fill="url(#docs-grass-patch)"
          stroke="#fff"
          strokeWidth="9"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function SproutFriend() {
  return (
    <div className="hero-mascot" aria-hidden="true">
      <span className="mascot-leaf" />
      <span className="mascot-stem" />
      <span className="mascot-body" />
      <span className="mascot-cheek left" />
      <span className="mascot-cheek right" />
      <span className="mascot-eye left" />
      <span className="mascot-eye right" />
      <span className="mascot-mouth" />
    </div>
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
        <p className="hero-badge"><Icon name="leaf" /> {localize(homeCopy.eyebrow, lang)}</p>
        <div className="hero-stage">
          <GrassIsland />
          <SproutFriend />
          <PokolandLogo />
        </div>
        <div className="hero-actions">
          <a className="btn icon-btn" href="#component-map">
            <Icon name="map" /> {localize(homeCopy.browse, lang)}
          </a>
          <a className="btn ghost" href="../demo/">
            {localize(homeCopy.vanilla, lang)}
          </a>
        </div>
        <p className="hero-lead">{localize(homeCopy.lead, lang)}</p>
      </section>

      <section className="field-section install-section" aria-labelledby="install-title">
        <div className="section-tag">
          <span className="tag-dot butter" />
          <span>{localize(homeCopy.firstStep, lang)}</span>
        </div>
        <div className="field-panel install-panel">
          <div className="install-copy">
            <span className="step-number">01</span>
            <h2 id="install-title">{localize(homeCopy.firstStepTitle, lang)}</h2>
          </div>
          <div className="install-command">
            <code>npm install pokoland-ui</code>
            <CopyButton text="npm install pokoland-ui" lang={lang} compact />
          </div>
        </div>
      </section>

      <ComponentMap lang={lang} />

      <section className="field-section quick-start reference-section" aria-labelledby="quick-start-title">
        <div className="section-tag">
          <span className="tag-dot sky" />
          <span>React</span>
        </div>
        <div className="field-panel quick-start-panel">
          <div className="quick-start-copy">
            <span className="step-number">02</span>
            <h2 id="quick-start-title">{localize(homeCopy.trailTitle, lang)}</h2>
            <p>{localize(homeCopy.trail, lang)}</p>
            <a className="text-link" href="#/c/button">Button <Icon name="up" /></a>
          </div>
          <CodeBlock code={quickStartCode} lang={lang} />
        </div>
      </section>
    </div>
  );
}

function ComponentMap({ lang }: { lang: Lang }) {
  return (
    <section id="component-map" className="field-section component-map reference-section" aria-labelledby="component-map-title">
      <div className="section-tag">
        <span className="tag-dot meadow" />
        <span>20 {localize(ui.components, lang)}</span>
      </div>
      <div className="field-panel map-panel">
        <div className="component-map-heading">
          <span className="step-number"><Icon name="map" /></span>
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
        <a className="breadcrumb" href="#/"><Icon name="leaf" /> Pokoland UI</a>
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
  const directoryCloseRef = React.useRef<HTMLButtonElement>(null);

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    directoryCloseRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDirectoryOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
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
        <span className="tile-ground" />
      </div>
      <Sidebar
        lang={lang}
        routeId={routeId}
        open={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        closeButtonRef={directoryCloseRef}
      />
      <header
        className="site-tools"
        inert={directoryOpen ? '' : undefined}
        aria-hidden={directoryOpen || undefined}
      >
        <button
          type="button"
          className="round-tool menu-button"
          aria-expanded={directoryOpen}
          aria-controls="site-directory"
          aria-label={directoryOpen ? localize(ui.closeMenu, lang) : localize(ui.menu, lang)}
          onClick={() => setDirectoryOpen((open) => !open)}
        >
          <Icon name="map" />
        </button>
        <LanguageSwitch lang={lang} onChange={setLang} />
        <a className="round-tool" href="https://github.com/heminghaoa/pokoland-ui" target="_blank" rel="noreferrer" aria-label={localize(ui.github, lang)}>
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
      </header>
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
