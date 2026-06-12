# Mochi UI 开源化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把已验证的 `.proto` 原型变成可公开访问的开源作品集仓库:GitHub + Pages 线上 demo、Bun 工具链拆分出零依赖的 `src/mochi.{css,js}` + `icons.svg`、三语 README 与文档增补。

**Architecture:** demo 保持"浏览器直开可用"——demo 引用未压缩 `src/`,`dist/` 仅由 `bun run build` 产出给外部使用者;图标 sprite 以 `src/icons.svg` 为准、构建时注入 demo 标记区;i18n 词典留在 demo 内(页面内容),引擎在 `mochi.js`。

**Tech Stack:** 纯 HTML/CSS/JS(零运行时依赖)· Bun(dev/build 脚本,无 devDependencies)· GitHub Actions + Pages · headless Chrome 截图。

**铁律(来自 spec 与用户偏好):**
1. 所有 git 提交、PR、仓库元信息**不得出现任何 Claude / AI 署名**(无 `Co-Authored-By`、无 "Generated with"),作者即本机 git 身份。
2. UI 页面内零 emoji;新增文案三语齐全;不引入任何 npm 依赖。
3. spec:`docs/superpowers/specs/2026-06-12-mochi-ui-opensource-design.md`。验收标准见 spec §8。

**已知偏差(执行后须向用户报告):** spec §1 要求 README 配 GIF;本计划以 headless Chrome 产出静态 PNG(三语 hero + 全页),动图录制不在本计划内,后续可补。

---

## 文件结构总览

```
（新建)package.json                  bun scripts 入口
（新建)scripts/serve.ts              本地静态服务(bun run dev)
（新建)scripts/check.ts              零 emoji + i18n 键完整性检查(bun run check)
（新建)scripts/build.ts              icons 同步 + dist 产出(bun run build)
（新建)src/mochi.css                 组件层样式(从 demo 抽出)
（新建)src/mochi.js                  组件交互 + i18n 引擎(从 demo 抽出)
（新建)src/icons.svg                 Mochi Icons sprite(权威来源)
（新建)index.html                    根重定向 → demo/
（新建).github/workflows/pages.yml   CI:check + build + Pages 部署
（新建)README.md(EN)/ README.ja.md;README.zh-CN.md ← git mv 自现有 README.md
（新建)docs/assets/*.png             README 截图素材
（修改)demo/index.html               ← .proto 全量替换,后续抽离 src
（修改)docs/design-tokens.md docs/components.md CONTRIBUTING.md ROADMAP.md
（删除).proto/
```

通用常量(多任务引用):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
SHOT() { "$CHROME" --headless --disable-gpu --hide-scrollbars --window-size=$1 --screenshot="$2" "$3"; }
```

---

### Task 1: GitHub 远程仓库与推送

**Files:** 无文件改动(纯 git/gh 操作)

- [ ] **Step 1: 确认 gh 已登录**

Run: `gh auth status`
Expected: `Logged in to github.com`。**若未登录:停止,向用户要登录**(这是唯一允许的阻塞点)。

- [ ] **Step 2: 创建公开仓库并推送**

```bash
gh repo create mochi-ui --public --source=. --push \
  --description "A cozy, sticker-style UI kit. Zero-dependency CSS + optional JS. 治愈系贴纸风组件库"
```

- [ ] **Step 3: 验证**

Run: `git remote -v && gh repo view --json url -q .url`
Expected: origin 指向 `github.com/<user>/mochi-ui`,输出仓库 URL。记下 `<user>`(预期 `heminghaoa`),后续任务的 Pages URL 用到。

---

### Task 2: .proto 融合进 demo

**Files:**
- Modify: `demo/index.html`(整文件替换)
- Delete: `.proto/`

- [ ] **Step 1: 替换并删除原型目录**

```bash
cp .proto/index.html demo/index.html
git rm -r --quiet .proto
```

- [ ] **Step 2: 验证内容完整**

Run: `grep -c 'data-i18n' demo/index.html && grep -c '<symbol id="mi-' demo/index.html && grep -c 'lang-switch' demo/index.html`
Expected: 三个数分别 ≥80、=19、≥3。

- [ ] **Step 3: 验证零 emoji(脚本前的临时检查)**

```bash
python3 -c "
import re
emoji = re.compile('[\U0001F000-\U0001FAFF☀-➿⬀-⯿️]')
hits = [(i,l.strip()[:60]) for i,l in enumerate(open('demo/index.html',encoding='utf-8'),1) if emoji.search(l)]
print(hits if hits else 'CLEAN')"
```
Expected: `CLEAN`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat(demo): 融合已验证原型(Pokopia 母题 / Mochi Icons / 三语 i18n)"
```

---

### Task 3: package.json 与 check 脚本

**Files:**
- Create: `package.json`
- Create: `scripts/check.ts`

- [ ] **Step 1: 写 package.json**

```json
{
  "name": "mochi-ui",
  "version": "0.2.0",
  "private": true,
  "description": "A cozy, sticker-style UI kit. Zero-dependency CSS + optional JS.",
  "license": "MIT",
  "scripts": {
    "dev": "bun run scripts/serve.ts",
    "build": "bun run scripts/build.ts",
    "check": "bun run scripts/check.ts"
  }
}
```

- [ ] **Step 2: 写 scripts/check.ts**

```ts
// bun run check —— ① UI 零 emoji ② i18n 键完整性(demo 用键 ⊆ 词典)
const emojiRe = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;
let failed = false;

const html = await Bun.file('demo/index.html').text();
html.split('\n').forEach((line, i) => {
  const hits = line.match(emojiRe);
  if (hits) { failed = true; console.error(`demo/index.html:${i + 1} emoji: ${[...new Set(hits)].join(' ')}`); }
});

const used = new Set<string>();
for (const m of html.matchAll(/data-i18n(?:-html|-ph|-aria)?="(\w+)"/g)) used.add(m[1]);
for (const m of html.matchAll(/T\('(\w+)'\)/g)) used.add(m[1]);

// 词典两种形态都支持:拆分前 const I18N = {...};拆分后 window.MOCHI_I18N = {...}
const dictMatch = html.match(/(?:const I18N|window\.MOCHI_I18N)\s*=\s*\{([\s\S]*?)\n\};/);
if (!dictMatch) { console.error('未找到 i18n 词典'); process.exit(1); }
const dict = new Set<string>();
for (const m of dictMatch[1].matchAll(/^\s*(\w+):\s*\[/gm)) dict.add(m[1]);

const missing = [...used].filter(k => !dict.has(k));
const unused = [...dict].filter(k => !used.has(k) && k !== 'title');
if (missing.length) { failed = true; console.error('词典缺键:', missing.join(', ')); }
if (unused.length) console.warn('警告·词典未使用键:', unused.join(', '));

if (failed) process.exit(1);
console.log(`check 通过:0 emoji;i18n 用键 ${used.size},词典 ${dict.size}`);
```

- [ ] **Step 3: 运行验证**

Run: `bun run check`
Expected: `check 通过:0 emoji;i18n 用键 ~80,词典 ~81`(数字±几个正常;非零退出码即失败,须修复后再继续)。

- [ ] **Step 4: Commit**

```bash
git add package.json scripts/check.ts && git commit -m "chore: Bun 工具链入口与 check 脚本(零 emoji + i18n 键校验)"
```

---

### Task 4: dev 静态服务

**Files:**
- Create: `scripts/serve.ts`

- [ ] **Step 1: 写 scripts/serve.ts**

```ts
// bun run dev —— 零依赖静态服务,根路径跳 demo
const root = process.cwd();
Bun.serve({
  port: 4178,
  async fetch(req) {
    let path = decodeURIComponent(new URL(req.url).pathname);
    if (path === '/') path = '/demo/';
    if (path.endsWith('/')) path += 'index.html';
    const file = Bun.file(root + path);
    return (await file.exists()) ? new Response(file) : new Response('Not found', { status: 404 });
  },
});
console.log('Mochi dev → http://localhost:4178');
```

- [ ] **Step 2: 验证**

```bash
bun run dev & sleep 1
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4178/demo/   # 期望 200
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:4178/nope    # 期望 404
kill %1
```

- [ ] **Step 3: Commit**

```bash
git add scripts/serve.ts && git commit -m "chore: bun run dev 静态服务"
```

---

### Task 5: 拆分 CSS → src/mochi.css

**Files:**
- Create: `src/mochi.css`
- Modify: `demo/index.html`(`<style>` 减薄 + `<link>`)

**拆分边界(按 demo `<style>` 内的横幅注释逐段移动,内容一字不改):**

| 去向 | 段落 |
|------|------|
| **src/mochi.css(库)** | `:root` 设计令牌 · `贴纸基类 .sticker` · `按钮 .btn*` · `标签 .badge*` · `输入控件`(.field/.input/.select/.textarea)· `开关与选择`(.switch/.check/.radio)· `进度与滑块`(.grow*/.slider*)· `卡片 .card*` · `Tabs`(.tabs/.tab-list/.tab-btn/.tab-panel)· `头像&工具提示`(.avatar/.tip-wrap/.tip)· `对话框 .dialog*` · `Toast .toast*` · v3 块中的 `.mi` 基础类与全部 `.mi` 上下文配色规则 · `白空格规则`(.btn,.badge,.tab-btn,.section-tag nowrap)· 各组件自带的 `@keyframes` |
| **demo 保留(页面)** | `* reset` · `html/body` 背景 · `::selection` · 环境装饰(.scenery/.cloud/.hills/.tile-ground)· `.page` · Hero 全套(.hero*/.puff/.hero-blob/.hero-mascot)· `.section/.section-tag/.panel` · `.lang-switch` · `.footer` · drift/bob/peek 动画 · 媒体查询 |

- [ ] **Step 1: 建 src/mochi.css 并迁移上表"库"段落**

文件头加注释:

```css
/* Mochi UI v0.2 — 组件样式(零依赖,引入即用)
   设计令牌与规范见 docs/design-tokens.md */
```

末尾追加(库文件须独立尊重 reduced-motion):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 2: demo `<head>` 引入**

在 `<style>` 之前加:

```html
<link rel="stylesheet" href="../src/mochi.css">
```

- [ ] **Step 3: 验证视觉无回归**

```bash
bun run dev & sleep 1
SHOT 1280,900 /tmp/split-css.png "http://localhost:4178/demo/?lang=zh"
kill %1
```
打开 `/tmp/split-css.png` 与拆分前对照(拆分前先存一张基线):hero blob、按钮厚度、徽章、卡片、瓦片地面全部如旧。`bun run check` 仍通过。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: 组件样式拆出 src/mochi.css,demo 引用源文件"
```

---

### Task 6: 拆分 JS → src/mochi.js

**Files:**
- Create: `src/mochi.js`
- Modify: `demo/index.html`(尾部 `<script>` 减薄)

- [ ] **Step 1: 写 src/mochi.js(完整内容如下)**

```js
/* Mochi UI v0.2 — 可选交互(零依赖)
   提供:toast()/openDialog()/closeDialog()/Tabs 自动初始化/轻量 i18n
   i18n 词典由页面在加载本脚本前定义:window.MOCHI_I18N = { key: [zh, en, ja] } */
(function () {
  'use strict';

  function initTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-selected', 'false'));
        document.querySelectorAll('.tab-panel').forEach(p => p.hidden = true);
        btn.setAttribute('aria-selected', 'true');
        const panel = document.getElementById(btn.dataset.tab);
        if (panel) panel.hidden = false;
      });
    });
  }

  function openDialog(id) { const el = document.getElementById(id || 'dlg'); if (el) el.classList.add('open'); }
  function closeDialog(id) { const el = document.getElementById(id || 'dlg'); if (el) el.classList.remove('open'); }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDialog(); });

  function toast(type, icon, msg) {
    const zone = document.getElementById('toast-zone');
    if (!zone) return;
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = '<span class="ico"><svg class="mi" aria-hidden="true"><use href="#mi-' + icon + '"/></svg></span>' + msg;
    zone.appendChild(el);
    setTimeout(() => { el.classList.add('bye'); setTimeout(() => el.remove(), 320); }, 2600);
  }

  var LANGS = ['zh', 'en', 'ja'];
  var DICT = window.MOCHI_I18N || {};
  var cur = 'zh';
  function detect() {
    var url = new URLSearchParams(location.search).get('lang');
    if (LANGS.indexOf(url) >= 0) return url;
    var saved = localStorage.getItem('mochi-lang');
    if (LANGS.indexOf(saved) >= 0) return saved;
    var nav = (navigator.language || 'zh').toLowerCase();
    return nav.indexOf('ja') === 0 ? 'ja' : nav.indexOf('en') === 0 ? 'en' : 'zh';
  }
  function T(k) { var e = DICT[k]; return e ? e[LANGS.indexOf(cur)] : k; }
  function applyLang(lang) {
    if (LANGS.indexOf(lang) < 0) return;
    cur = lang;
    localStorage.setItem('mochi-lang', lang);
    document.documentElement.lang = { zh: 'zh-CN', en: 'en', ja: 'ja' }[lang];
    if (DICT.title) document.title = T('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = T(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => { el.placeholder = T(el.dataset.i18nPh); });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', T(el.dataset.i18nAria)); });
    document.querySelectorAll('.lang-switch button').forEach(b => { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function init() {
    initTabs();
    document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', function () { applyLang(b.dataset.lang); }));
    if (Object.keys(DICT).length) { cur = detect(); applyLang(cur); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.toast = toast;
  window.openDialog = openDialog;
  window.closeDialog = closeDialog;
  window.T = T;
  window.applyLang = applyLang;
})();
```

- [ ] **Step 2: 减薄 demo 内联脚本**

demo 尾部 `<script>` 只保留词典,改名挂到 window,且**必须在 mochi.js 之前**:

```html
<script>
/* 页面文案词典(内容不变,仅由 const I18N 改为 window.MOCHI_I18N) */
window.MOCHI_I18N = { /* …原 I18N 全部键值原样… */ };
</script>
<script src="../src/mochi.js"></script>
```

删除原 Tabs/Dialog/Toast/i18n 函数与 `applyLang(cur)` 等调用(全部由 mochi.js 接管)。滑块的内联 `oninput` 是 demo 内容,保留。

- [ ] **Step 3: 验证**

```bash
bun run check        # 词典正则匹配 window.MOCHI_I18N 形态,应仍通过
bun run dev & sleep 1
SHOT 1280,900 /tmp/split-js-ja.png "http://localhost:4178/demo/?lang=ja"
kill %1
```
`/tmp/split-js-ja.png` 应为日语界面(URL 参数生效 = i18n 引擎工作)。浏览器手动点一遍:tabs 切换、dialog 开关(Esc)、toast 弹出、语言切换。

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: 交互与 i18n 引擎拆出 src/mochi.js(支持 ?lang= 参数)"
```

---

### Task 7: 拆分图标 → src/icons.svg + 标记区

**Files:**
- Create: `src/icons.svg`
- Modify: `demo/index.html`(sprite 外加标记注释)

- [ ] **Step 1: 抽出 sprite 为权威文件**

把 demo 中 `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">…19 个 symbol…</svg>` 整块复制为 `src/icons.svg` 的全部内容(不删 demo 内联——`file://` 直开时外链 `<use>` 跨源受限,内联是有意保留)。

- [ ] **Step 2: demo 内联 sprite 两侧加同步标记**

```html
<!-- ICONS:BEGIN(由 bun run build 从 src/icons.svg 同步,勿手改) -->
<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">…</svg>
<!-- ICONS:END -->
```

- [ ] **Step 3: 验证一致**

Run: `diff <(sed -n '/ICONS:BEGIN/,/ICONS:END/p' demo/index.html | sed '1d;$d') src/icons.svg && echo SAME`
Expected: `SAME`

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "refactor: Mochi Icons sprite 独立为 src/icons.svg(demo 内联保留并加同步标记)"
```

---

### Task 8: build 脚本与 dist 冒烟

**Files:**
- Create: `scripts/build.ts`

- [ ] **Step 1: 写 scripts/build.ts**

```ts
// bun run build —— ① icons 同步进 demo ② 产出 dist/(外部使用者引入;demo 不依赖)
import { mkdirSync, rmSync } from 'node:fs';

const icons = (await Bun.file('src/icons.svg').text()).trim();
const demoPath = 'demo/index.html';
let demo = await Bun.file(demoPath).text();
const re = /(<!-- ICONS:BEGIN[^>]*-->)[\s\S]*?(<!-- ICONS:END -->)/;
if (!re.test(demo)) { console.error('demo 缺少 ICONS 标记'); process.exit(1); }
demo = demo.replace(re, `$1\n${icons}\n$2`);
await Bun.write(demoPath, demo);

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');

const js = await Bun.build({ entrypoints: ['src/mochi.js'], minify: true });
await Bun.write('dist/mochi.js', await js.outputs[0].text());

try {
  const css = await Bun.build({ entrypoints: ['src/mochi.css'], minify: true });
  await Bun.write('dist/mochi.css', await css.outputs[0].text());
} catch {
  await Bun.write('dist/mochi.css', await Bun.file('src/mochi.css').text());
  console.warn('当前 Bun 版本不支持 CSS 构建,dist/mochi.css 为未压缩副本');
}
await Bun.write('dist/icons.svg', icons);
console.log('build 完成 → dist/{mochi.css,mochi.js,icons.svg}');
```

- [ ] **Step 2: 运行**

Run: `bun run build && ls -la dist/ && git status --short`
Expected: dist 三文件存在;`git status` 不含 dist(已 gitignore);demo/index.html 无 diff(icons 本来就同步)。

- [ ] **Step 3: 独立冒烟页**

```bash
cat > /tmp/mochi-smoke.html <<'EOF'
<!DOCTYPE html><meta charset="utf-8">
<link rel="stylesheet" href="dist/mochi.css">
<body style="padding:40px;background:#BDE8F7">
<button class="btn">采集果实</button>
<button class="btn coral">交个朋友</button>
<span class="badge green">草系</span>
<div id="toast-zone" class="toast-zone" aria-live="polite"></div>
<script src="dist/mochi.js"></script>
<script>toast('ok','star','dist 冒烟');</script>
EOF
cp /tmp/mochi-smoke.html ./smoke.html
bun run dev & sleep 1
SHOT 800,400 /tmp/smoke.png "http://localhost:4178/smoke.html"
kill %1; rm smoke.html
```
打开 `/tmp/smoke.png`:绿色/珊瑚厚底按钮 + 徽章 + 右下 toast 出现(toast 图标因无 sprite 不显示属预期——README 会写明引 sprite 的方式)。

- [ ] **Step 4: Commit**

```bash
git add scripts/build.ts && git commit -m "chore: bun run build(icons 同步 + dist 产出)"
```

---

### Task 9: GitHub Actions + Pages 上线

**Files:**
- Create: `index.html`(根重定向)
- Create: `.github/workflows/pages.yml`

- [ ] **Step 1: 根重定向页**

```html
<!DOCTYPE html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=./demo/">
<title>Mochi UI</title>
<a href="./demo/">Mochi UI demo →</a>
```

- [ ] **Step 2: 写 pages.yml**

```yaml
name: Deploy demo to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun run check
      - run: bun run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - uses: actions/deploy-pages@v4
        id: deployment
```

- [ ] **Step 3: 开启 Pages(workflow 模式)并推送**

```bash
gh api -X POST "repos/{owner}/mochi-ui/pages" -f build_type=workflow 2>/dev/null \
  || gh api -X PUT "repos/{owner}/mochi-ui/pages" -f build_type=workflow
git add index.html .github && git commit -m "ci: GitHub Pages 部署(check + build + deploy)"
git push
```

- [ ] **Step 4: 验证上线**

```bash
gh run watch --exit-status
curl -s -o /dev/null -w '%{http_code}\n' "https://<user>.github.io/mochi-ui/demo/"
```
Expected: workflow success;HTTP 200。浏览器开一次线上 URL 目检(字体、图标、三语切换)。

---

### Task 10: README 截图素材

**Files:**
- Create: `docs/assets/hero-zh.png` `hero-en.png` `hero-ja.png` `full.png`

- [ ] **Step 1: 四张截图**

```bash
mkdir -p docs/assets
bun run dev & sleep 1
SHOT 1280,860  docs/assets/hero-zh.png "http://localhost:4178/demo/?lang=zh"
SHOT 1280,860  docs/assets/hero-en.png "http://localhost:4178/demo/?lang=en"
SHOT 1280,860  docs/assets/hero-ja.png "http://localhost:4178/demo/?lang=ja"
SHOT 1280,3600 docs/assets/full.png    "http://localhost:4178/demo/?lang=zh"
kill %1
```

- [ ] **Step 2: 目检尺寸与内容**

Run: `ls -la docs/assets/`(每张应 <1.5MB;打开确认 hero 三语文案正确、full 无截断)。若 full.png >3MB:`SHOT 1024,2880` 重拍。

- [ ] **Step 3: Commit**

```bash
git add docs/assets && git commit -m "docs: README 截图素材(三语 hero + 全页)"
```

---

### Task 11: 三语 README

**Files:**
- Create: `README.md`(EN,默认入口)
- Create: `README.ja.md`
- Rename+Modify: `README.md` → `README.zh-CN.md`

- [ ] **Step 1: 迁移中文版**

```bash
git mv README.md README.zh-CN.md
```
对 `README.zh-CN.md` 做三处编辑:① 顶部第一行加 `**[English](README.md)** | 简体中文 | **[日本語](README.ja.md)**`;② "快速开始"前插入一行 `**线上 Demo:** https://<user>.github.io/mochi-ui/demo/` 与 `![Mochi UI](docs/assets/hero-zh.png)`;③ 项目结构图增补 `src/`、`scripts/`、`package.json` 行(对照 Task 5–8 实际结构)。

- [ ] **Step 2: 写 README.md(EN,完整内容)**

```markdown
# 🍡 Mochi UI

English | **[简体中文](README.zh-CN.md)** | **[日本語](README.ja.md)**

> A cozy, sticker-style UI kit. Round, squishy, and it goes "boop" when you press it.

![status](https://img.shields.io/badge/status-v0.2_sprouting-FFD66B)
![license](https://img.shields.io/badge/license-MIT-8FD178)
![deps](https://img.shields.io/badge/dependencies-zero-8FD178)

**Live demo:** https://<user>.github.io/mochi-ui/demo/ (中 / EN / 日)

![Mochi UI](docs/assets/hero-en.png)

## ✨ What is this

A sticker-aesthetic web UI kit inspired by cozy life-sim games:

- **Thick white outlines** — every component looks like a cut-out sticker
- **Inflated push feel** — buttons have physical depth and actually sink when pressed
- **Sunny meadow palette** — sky blue / meadow green / cream / butter / coral
- **Checker-grass & tile-quilt motifs** — the page sits in a tiny handcrafted world
- **Original icon set (Mochi Icons)** — 19 hand-drawn SVG symbols, zero emoji in UI
- **Trilingual demo** — Chinese / English / Japanese, switchable live

## 🚀 Quick start

Zero dependencies. Clone and open:

\`\`\`bash
git clone https://github.com/<user>/mochi-ui.git
open mochi-ui/demo/index.html        # or: bun run dev
\`\`\`

Use the library in your own page:

\`\`\`html
<link rel="stylesheet" href="mochi.css">   <!-- from dist/ after `bun run build` -->
<script src="mochi.js"></script>           <!-- optional: toast/tabs/dialog/i18n -->
<!-- icons: inline the contents of icons.svg once, then -->
<svg class="mi"><use href="#mi-leaf"/></svg>
\`\`\`

All design tokens live in `:root` CSS variables — change one line to retheme.

## 🧰 Toolchain

Built with [Bun](https://bun.sh) (dev server / build), but the **output is plain CSS+JS** — consumers need nothing.

| command | what it does |
|---------|--------------|
| `bun run dev` | static server at `localhost:4178` |
| `bun run check` | zero-emoji scan + i18n key coverage |
| `bun run build` | sync icons into demo + minify to `dist/` |

## ⚖️ Inspiration & IP

Mochi UI borrows the *mood* of cozy life-sim games. All designs, colors, characters, icons and copy are **original**. This project is not affiliated with, endorsed by, or associated with Nintendo, The Pokémon Company, or any commercial IP, and contains no official assets. Contributions must follow the same rule.

## 📄 License

[MIT](LICENSE) © 2026 Mochi UI Contributors
```

(`<user>` 替换为 Task 1 记下的账户名。)

- [ ] **Step 3: 写 README.ja.md(完整内容)**

```markdown
# 🍡 Mochi UI

**[English](README.md)** | **[简体中文](README.zh-CN.md)** | 日本語

> まんまる、ふわふわ、押すと「ぷにっ」となるステッカー風UIキット。

**ライブデモ:** https://<user>.github.io/mochi-ui/demo/ (中 / EN / 日)

![Mochi UI](docs/assets/hero-ja.png)

## ✨ これはなに

ほのぼの生活シミュレーションゲームの空気感にインスパイアされた、ステッカー美学のWeb UIキットです:

- **太い白フチ** — どのコンポーネントも切り抜きステッカーのよう
- **ぷにぷに押し心地** — ボタンには物理的な厚みがあり、押すと本当に沈む
- **はれの草原パレット** — そらいろ / くさいろ / クリーム / バター / さんご
- **市松グラス & タイル地面のモチーフ** — ページ全体が小さな手作りの世界に
- **オリジナルアイコン(Mochi Icons)** — 手描きSVG 19種、UI内に絵文字ゼロ
- **3言語デモ** — 中・英・日をその場で切り替え

## 🚀 はじめる

依存ゼロ。クローンして開くだけ:

\`\`\`bash
git clone https://github.com/<user>/mochi-ui.git
open mochi-ui/demo/index.html        # または: bun run dev
\`\`\`

デザイントークンはすべて `:root` のCSS変数にあります。一行変えるだけでテーマが変わります。

## ⚖️ インスピレーションとIPについて

Mochi UIが借りているのは、ほのぼの生活シムというジャンルの「空気感」だけです。デザイン・配色・キャラクター・アイコン・文言はすべてオリジナルです。本プロジェクトは任天堂・株式会社ポケモンおよびいかなる商業IPとも無関係であり、公式アセットを一切含みません。

## 📄 ライセンス

[MIT](LICENSE) © 2026 Mochi UI Contributors
```

- [ ] **Step 4: 验证互链与图片**

Run: `for f in README.md README.zh-CN.md README.ja.md; do echo "== $f"; head -4 "$f"; done && ls docs/assets/`
Expected: 三份顶部互链齐全,引用的 png 均存在。

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "docs: 三语 README(EN 默认入口 / zh-CN / ja)"
```

---

### Task 12: docs 增补与 ROADMAP 更新

**Files:**
- Modify: `docs/design-tokens.md` `docs/components.md` `CONTRIBUTING.md` `ROADMAP.md`

- [ ] **Step 1: design-tokens.md 末尾追加三节**

```markdown
## 6. 世界母题 World Motifs

| 母题 | 实现 |
|------|------|
| 格纹草皮 blob | `repeating-conic-gradient(#CDE56E 0% 25%, #BFDB59 0% 50%)`,54px 格,有机 border-radius,6px 白描边 |
| 瓦片草皮地面 | `repeating-conic-gradient(#8FD178 0% 25%, #7EC367 0% 50%)`,52px 格,顶部 5px 白接缝 |
| 团子精 | 奶油底色 + 腮红(--coral 70%)+ 发芽,呼吸动画 3.2s |

设计原则(两次失败换来的):扁平 UI 里**饱和度即生命力**,不做哑光化;**blur 需要精细的景**,世界感用清晰的纸艺层叠表达。

## 7. 图标 Mochi Icons

- 24×24 网格;实心墩形 + 圆头线;颜色走 `currentColor`,内部细节用半透明白分层
- **小尺寸单坨原则**:≤20px 必须是一整块实心形,多零件结构会碎
- sprite 权威来源 `src/icons.svg`,demo 内联副本由 `bun run build` 同步(标记区勿手改)
- **UI 内零 emoji**(原生 `<option>` 用纯文字)

## 8. CJK 排版

- 胶囊组件(.btn/.badge/.tab-btn/.section-tag)`white-space: nowrap`,空间不足整体换行,禁词中断行
- 容器尺寸按最长语言(通常是日语)实测:卡片 270px
- 新组件必须在中/EN/日三语下各过一遍
```

- [ ] **Step 2: components.md 顶部"约定"处追加**

```markdown
## 图标与 i18n 约定

图标:`<svg class="mi" aria-hidden="true"><use href="#mi-leaf"/></svg>`,可用名:leaf drop zap berry moon check wrench heart star bug package backpack book map mushroom bubbles speaker tent face flower。
toast 第二参传**图标名**:`toast('ok', 'star', T('toastOk'))`。
文案标记:`data-i18n`(文本)/`data-i18n-html`/`data-i18n-ph`(placeholder)/`data-i18n-aria`;词典 `window.MOCHI_I18N = { key: [zh, en, ja] }` 须在 `mochi.js` 之前定义;`?lang=en` URL 参数可强制语言。
```

- [ ] **Step 3: CONTRIBUTING.md "提交前请确认"清单追加两条**

```markdown
6. **UI 内零 emoji**:界面文案与图标一律用 Mochi Icons(`src/icons.svg`),emoji 仅允许出现在 Markdown 文档中。
7. **三语齐全**:demo 新增任何文案,`window.MOCHI_I18N` 词典须同时给出中/EN/日,且在三语下检查不破版(日语是布局压力测试)。
```

- [ ] **Step 4: ROADMAP.md 更新 v0.2 段**

把以下项勾选为完成并注明:`拆分 CSS(mochi.css + mochi.js)✅` `GitHub Pages 部署 demo 站 ✅`;在 v0.2 段尾追加一行 `- [x] 三语 demo + 三语 README(原 v0.3 项提前完成)`;v0.3 段删去"英文 / 日文文档"一行。

- [ ] **Step 5: 验证 + Commit**

Run: `bun run check`(确认 docs 编辑没碰坏 demo)
```bash
git add -A && git commit -m "docs: 设计规范增补(母题/图标/CJK)与 ROADMAP 更新" && git push
```

---

### Task 13: 最终验收(spec §8 全项)

**Files:** 无新文件;产出验收报告(回复用户,不入库)

- [ ] **Step 1: 自动检查**

```bash
bun run check && bun run build && git status --short   # check 过、build 过、工作区净
```

- [ ] **Step 2: 三语逐屏目检**

`bun run dev` 后浏览器(或 headless 三张全页图)分别过 `?lang=zh/en/ja`:无词中折行、无溢出、无显示为键名的未翻译文案。

- [ ] **Step 3: 交互与无障碍**

键盘 Tab 走通全页(焦点环可见)→ Esc 关 dialog → 系统开 reduce motion 后刷新(动画应归零)→ 窗口缩到 ≤640px(语言钮不遮内容、卡片不破版)。

- [ ] **Step 4: 线上验证**

`curl -s -o /dev/null -w '%{http_code}' https://<user>.github.io/mochi-ui/demo/` = 200;GitHub 仓库页确认 README(EN)渲染、互链可点、图片显示。

- [ ] **Step 5: 向用户报告**

逐条对照 spec §8 报告通过/不通过;明确说明 GIF→PNG 偏差;附线上 URL 与仓库 URL。

---

## Self-Review 记录

- **Spec 覆盖**:§1 目标(T9/T10/T11)、§2 母题(已在 demo,T2 固化 + T12 文档化)、§3 图标(T7/T8/T12)、§4 i18n(T2/T6/T11/T12)、§5 Bun(T3/T4/T8/T9)、§6 结构(T5–T9)、§7 无障碍(代码已含,T13 验收)、§8(T13)、§9 阶段(T1–T13 一一对应)、§10 风险(免责声明在 T11 README;视觉回归在 T5/T6 截图对照)。无缺口。
- **占位符扫描**:无 TBD;T6 Step 2 的"原 I18N 全部键值原样"指既有文件内容平移(非新写内容),T5 的段落迁移同理——均为对仓库内既有代码的确定性引用。
- **一致性**:`window.MOCHI_I18N` 命名在 T3(check 正则)/T6(定义)/T12(文档)一致;`?lang=` 在 T6(实现)/T10(使用)/T12(文档)一致;sprite 标记 `ICONS:BEGIN/END` 在 T7(添加)/T8(消费)一致;端口 4178 全计划统一。
