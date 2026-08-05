export const LANGS = ['zh', 'en', 'ja'] as const;
export type Lang = (typeof LANGS)[number];
export type Localized = Record<Lang, string>;

export const LANGUAGE_LABELS: Record<Lang, string> = {
  zh: '中文',
  en: 'EN',
  ja: '日本語',
};

export const HTML_LANG: Record<Lang, string> = {
  zh: 'zh-CN',
  en: 'en',
  ja: 'ja',
};

export const ui = {
  brandNote: {
    zh: '治愈系 React 组件图鉴',
    en: 'A cozy React component field guide',
    ja: 'やさしい React コンポーネント図鑑',
  },
  home: { zh: '开始', en: 'Start', ja: 'はじめに' },
  components: { zh: '组件', en: 'Components', ja: 'コンポーネント' },
  menu: { zh: '打开目录', en: 'Open directory', ja: '目次を開く' },
  closeMenu: { zh: '关闭目录', en: 'Close directory', ja: '目次を閉じる' },
  skip: { zh: '跳到主要内容', en: 'Skip to main content', ja: '本文へ移動' },
  github: { zh: '查看 GitHub 仓库', en: 'View the GitHub repository', ja: 'GitHub リポジトリを見る' },
  npm: { zh: '查看 npm 包', en: 'View the npm package', ja: 'npm パッケージを見る' },
  demo: { zh: '打开零依赖演示', en: 'Open the zero-dependency demo', ja: '依存なしデモを開く' },
  liveExample: { zh: '实时示例', en: 'Live example', ja: 'ライブ例' },
  code: { zh: '代码', en: 'Code', ja: 'コード' },
  copy: { zh: '复制代码', en: 'Copy code', ja: 'コードをコピー' },
  copied: { zh: '已复制', en: 'Copied', ja: 'コピーしました' },
  copyFailed: { zh: '复制失败', en: 'Copy failed', ja: 'コピーできませんでした' },
  props: { zh: '属性', en: 'Props', ja: 'プロパティ' },
  prop: { zh: '属性', en: 'Prop', ja: 'プロパティ' },
  type: { zh: '类型', en: 'Type', ja: '型' },
  default: { zh: '默认值', en: 'Default', ja: '初期値' },
  description: { zh: '说明', en: 'Description', ja: '説明' },
  accessibility: { zh: '无障碍说明', en: 'Accessibility', ja: 'アクセシビリティ' },
  previous: { zh: '上一个', en: 'Previous', ja: '前へ' },
  next: { zh: '下一个', en: 'Next', ja: '次へ' },
  onThisPage: { zh: '本页内容', en: 'On this page', ja: 'このページ' },
  groupFoundations: { zh: '基础', en: 'Foundations', ja: '基本' },
  groupForms: { zh: '表单与数据', en: 'Forms & data', ja: 'フォームとデータ' },
  groupFeedback: { zh: '导航与反馈', en: 'Navigation & feedback', ja: 'ナビゲーションと通知' },
  groupMotifs: { zh: 'Pokoland 母题', en: 'Pokoland motifs', ja: 'Pokoland モチーフ' },
  footer: {
    zh: '用阳光、草叶和扎实的类型定义制作。',
    en: 'Made with sunshine, leaves, and sturdy type definitions.',
    ja: '陽だまりと葉っぱ、堅実な型定義で作りました。',
  },
} satisfies Record<string, Localized>;

export const homeCopy = {
  eyebrow: {
    zh: 'POKOLAND UI · v0.3.0',
    en: 'POKOLAND UI · v0.3.0',
    ja: 'POKOLAND UI · v0.3.0',
  },
  lead: {
    zh: '一套带厚白描边、下压手感和草原气息的 React 组件库。零运行时依赖，也保留纯 CSS 与原生 JavaScript 入口。',
    en: 'A React component library with sticker outlines, tactile presses, and meadow air. Zero runtime dependencies, with CSS and vanilla JavaScript entries included.',
    ja: '太い白ふち、押し込む手触り、草原の空気をまとった React コンポーネント集。実行時依存はゼロで、CSS と Vanilla JavaScript も利用できます。',
  },
  browse: { zh: '浏览全部组件', en: 'Browse all components', ja: 'すべてのコンポーネントを見る' },
  vanilla: { zh: '查看纯 HTML 演示', en: 'View the plain HTML demo', ja: 'HTML デモを見る' },
  firstStep: { zh: '第一步', en: 'First step', ja: '最初の一歩' },
  firstStepTitle: {
    zh: '引入一次样式，按需使用组件。',
    en: 'Import the styles once, then use only what you need.',
    ja: 'スタイルを一度読み込み、必要な部品だけ使います。',
  },
  trailTitle: { zh: '沿着路牌开始', en: 'Follow the signposts', ja: '道しるべから始めよう' },
  trail: {
    zh: '从按钮开始认识视觉语言，再走到表单、反馈与 Pokoland 独有的装饰组件。',
    en: 'Start with Button to learn the visual language, then wander through forms, feedback, and Pokoland’s signature motifs.',
    ja: 'まず Button で見た目のルールをつかみ、フォーム、通知、Pokoland 独自のモチーフへ進みましょう。',
  },
} satisfies Record<string, Localized>;

export function localize(value: Localized, lang: Lang): string {
  return value[lang];
}

export function isLang(value: string | null): value is Lang {
  return LANGS.includes(value as Lang);
}

export function getInitialLanguage(): Lang {
  if (typeof window === 'undefined') return 'en';
  const query = new URLSearchParams(window.location.search).get('lang');
  if (isLang(query)) return query;

  try {
    const saved = window.localStorage.getItem('pokoland-lang');
    if (isLang(saved)) return saved;
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }

  const browser = window.navigator.language.toLowerCase();
  if (browser.startsWith('zh')) return 'zh';
  if (browser.startsWith('ja')) return 'ja';
  return 'en';
}

export function persistLanguage(lang: Lang) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem('pokoland-lang', lang);
  } catch {
    // Language still updates for this session when storage is unavailable.
  }
  const url = new URL(window.location.href);
  url.searchParams.set('lang', lang);
  window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
