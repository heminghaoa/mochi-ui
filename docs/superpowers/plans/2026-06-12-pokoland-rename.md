# Pokoland UI 全量改名实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development。

**Goal:** Mochi UI → **Pokoland UI** 全量改名(仓库/文件/API/词典/文档/线上),并落实两条已批准的 README 增改:诚实版框架表述与 Pokémon Pokopia 灵感致意。

**背景决策(用户拍板,2026-06-12):** 名称 Pokoland(命名来源:日语拟声词「ぽこぽこ」,软软噗叽声,呼应按钮手感;不含 Pokémon/Poké/宝可 任何商标字符串;残余联想风险已知悉)。React 表述用诚实版 "Framework-agnostic — works with React / Next.js / anything"。改名范围:全量。

**铁律:** 所有提交零 AI 署名;`docs/superpowers/` 下既有 spec/plan 为历史记录,只加批注不改写;词典中食物语义的 mochi(如 "as soft as mochi"/年糕)保留。

---

### Task R1: 代码与资源全量改名

**Files:** git mv `src/mochi.css`→`src/pokoland.css`、`src/mochi.js`→`src/pokoland.js`;Modify `src/icons.svg`、`demo/index.html`、`scripts/check.ts`、`scripts/build.ts`、`scripts/serve.ts`、`package.json`

字符串映射(全局,注意顺序与边界):

| 旧 | 新 | 范围 |
|----|----|------|
| `window.MOCHI_I18N` | `window.POKOLAND_I18N` | demo、pokoland.js、check.ts |
| `id="mi-` | `id="pi-` | icons.svg、demo 内联 sprite |
| `#mi-` | `#pi-` | demo `<use>`、pokoland.js toast |
| `class="mi"` | `class="pi"` | demo 全部图标 |
| 正则 `\.mi\b` | `.pi` | pokoland.css 全部选择器 |
| `../src/mochi.css` / `../src/mochi.js` | `../src/pokoland.css` / `.js` | demo head/尾 |
| `src/mochi.js` `src/mochi.css` `dist/mochi.*` | pokoland 同名 | build.ts(入口/输出/日志) |
| `"name": "mochi-ui"` | `"pokoland-ui"` | package.json |
| `Mochi UI` | `Pokoland UI` | demo 标题/CSS 头注释、pokoland.{css,js} 头注释、词典 title×3 与 footB×3 |
| `Mochi dev` | `Pokoland dev` | serve.ts 日志 |

hero `<h1>`:字母 spans 改为 P/o/k/o/l/a/n/d + UI,颜色循环 meadow、sky-deep、butter、coral、lilac、meadow-deep、coral-deep、sky-deep,UI 两字母保持原色;`clamp(44px, 8vw, 84px)` 的 84px 降为 72px 防溢出 blob,截图验证后可微调 blob 宽(min(600px→最多 660px)。

验证:`bun run check` 0;`bun run build` 后 demo 零 diff、dist 为 pokoland.*;headless Chrome 三语 hero 截图(标题在 blob 内、图标全部渲染);`grep -ri mochi demo/ src/ scripts/ package.json` 仅剩词典 c1d 英文值(食物语义)。Commit:`refactor!: 全量更名 Pokoland UI(文件/API/图标前缀/词典)`。

### Task R2: README 与文档更名 + 新增表述

**Files:** 重写 `README.md`/`README.zh-CN.md`/`README.ja.md` 的品牌与链接;Modify docs/design-tokens.md、docs/components.md、CONTRIBUTING.md、ROADMAP.md;spec 顶部加更名批注;重拍 docs/assets 四图

三份 README:标题 `# 🏝️ Pokoland UI`;tagline 下新增一行诚实框架表述(EN:`Framework-agnostic — drop the CSS into React / Next.js / anything.`,中日对应);灵感段更名为含 Pokopia 致意 + 命名来源(EN 例:`The name comes from the Japanese onomatopoeia "poko-poko" — the soft boop a squishy button makes. The cozy mood is inspired by Pokémon Pokopia. Pokoland UI is an original, unofficial project — not affiliated with, endorsed by, or associated with Nintendo or The Pokémon Company; no official assets are used.`);所有 `mochi-ui` 仓库与 Pages URL → `pokoland-ui`;`mochi.css/js` → `pokoland.css/js`;`Mochi Icons` → `Pokoland Icons`;`#mi-leaf` 示例 → `#pi-leaf`。docs:design-tokens 标题与 §7、components 引言与图标节、CONTRIBUTING clone URL、ROADMAP(`@mochi-ui/react`→`@pokoland-ui/react`、`window.Mochi`→`window.Pokoland`、`Mochi Pixel`→`Pokoland Pixel`)。spec 文件标题下加一行:`> 2026-06-12 修订:项目更名 Pokoland UI(用户决定,全量改名,见 plans/2026-06-12-pokoland-rename.md)`。R1 完成后重拍 hero-{zh,en,ja}.png 与 full.png(命令同原 Task 10)。Commit:`docs: Pokoland UI 更名落地(三语 README/规范/路线图)+ 框架表述与 Pokopia 致意`。

### Task R3: 仓库改名与上线

`gh repo rename pokoland-ui --yes`(GitHub 自动重定向旧地址,本地 remote 由 gh 更新);`gh repo edit --description "Pokoland UI — a cozy, sticker-style UI kit inspired by Pokémon Pokopia. Zero-dependency CSS + optional JS. 治愈系贴纸风组件库"`;`git push`;`gh run watch --exit-status`;curl 新 Pages `https://heminghaoa.github.io/pokoland-ui/demo/` = 200(等 CDN 最多重试 5 次);确认旧 github.com/heminghaoa/mochi-ui 302 到新址。

### Task R4: 验收

check/build/工作区净;三语整页截图(无键名泄露/无折行/标题在 blob 内);新 Pages 200 且 HTML 含 `POKOLAND_I18N` 与 `pi-leaf`;`grep -ri mochi --exclude-dir=.git --exclude-dir=docs/superpowers .` 仅剩食物语义词典值;README 渲染含 hero-en.png;全历史无 AI 署名;报告。
