# pokoland-ui React 包与文档站实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development。Steps use checkbox (`- [ ]`) syntax.

**Goal:** 把 Pokoland UI 发成 npm 真 React 组件库(单包 `pokoland-ui` 0.3.0,TS 类型,零运行时依赖)+ dogfooding 文档站,现有零依赖 demo 不回归。

**Architecture:** 样式唯一真源 `src/pokoland.css`;React 组件(`src/react/*.tsx`)只产 className 与行为;Bun.build 出 ESM(external react),tsc 出 d.ts;文档站为小型 React SPA(hash 路由)构建进 `site/`。Spec:`docs/superpowers/specs/2026-06-12-react-package-design.md`。

**Tech Stack:** Bun(build/test)· React 18 peer · TypeScript · happy-dom + @testing-library/react。

**铁律:** commit 全英文、零 AI 署名;`dependencies` 永远为空(react 为 optional peer;构建/测试工具进 devDependencies);新增可见文案三语;UI 零 emoji;`npm publish` 前必须用户确认(唯一人工 gate:npm login)。

**通用组件约定(所有组件任务共用,实现者必读):**
- 函数组件 + `forwardRef`;Props 接口 `extends React.ComponentPropsWithoutRef<元素>`;透传 `className`(合并到组件类后)与其余 props。
- `color` 类型:`'meadow' | 'sky' | 'butter' | 'coral' | 'lilac'`;映射 className:meadow → 无后缀(默认),其余 → 同名类(如 `btn sky`)。
- 受控/非受控:`value`+`onValueChange` 受控,`defaultValue` 非受控(内部 useState),两者并存时受控优先。
- 交互组件文件首行 `'use client';`(Dialog/Toaster/Tabs/Switch/Checkbox/Radio/Slider/Tooltip/ToTop/Button[burst 时]全标;纯展示组件不标)。
- 每组件测试:① render 含正确 className/role;② 有状态组件加交互断言(见各任务)。测试用 `@testing-library/react` 的 `render/screen/fireEvent`。
- class 名以 `src/pokoland.css` 现有选择器为准(实现前 grep 确认,禁止造新类)。

---

### Task P1: 基建(devDeps / tsconfig / bun test / package.json / 构建脚本)

**Files:** Modify `package.json` `.gitignore` `scripts/build.ts`;Create `tsconfig.json` `bunfig.toml` `scripts/test-setup.ts` `src/react/index.ts`(暂空导出)

- [ ] **Step 1:** 安装 devDeps(锁定主版本):`bun add -d typescript @types/react@18 @types/react-dom@18 react@18 react-dom@18 happy-dom @testing-library/react @testing-library/user-event @testing-library/jest-dom`。验证 package.json 的 `dependencies` 字段不存在或为空。
- [ ] **Step 2:** `package.json` 增改(name/version 0.3.0/license/repository/keywords;`private` 删除;`peerDependencies: { react: ">=18", react-dom: ">=18" }` + `peerDependenciesMeta` 两者 optional;`files: ["dist", "README.md", "LICENSE"]`;`exports`:`"."→dist/react/index.mjs(types: dist/react/index.d.ts)`、`"./styles.css"→dist/pokoland.css`、`"./vanilla"→dist/pokoland.js`、`"./icons.svg"→dist/icons.svg`;`sideEffects: ["*.css"]`;scripts 加 `"test": "bun test"`、`"build:react": "bun run scripts/build-react.ts"`)。
- [ ] **Step 3:** `tsconfig.json`:`strict`、`jsx: react-jsx`、`module/target esnext`、`moduleResolution bundler`、`declaration + emitDeclarationOnly`、`outDir dist/react`、`include: ["src/react"]`、`exclude: ["src/react/__tests__"]`。
- [ ] **Step 4:** `bunfig.toml`:`[test] preload = ["./scripts/test-setup.ts"]`;test-setup.ts 注册 happy-dom(`GlobalRegistrator.register()`)并 `import '@testing-library/jest-dom'`。
- [ ] **Step 5:** `scripts/build-react.ts`:Bun.build({ entrypoints: ['src/react/index.ts'], outdir: 'dist/react', format: 'esm', minify: true, external: ['react', 'react-dom', 'react/jsx-runtime'] }),输出改名 index.mjs;然后 `bun x tsc -p tsconfig.json` 产 d.ts;失败均退出 1。`scripts/build.ts` 末尾追加调用它(子进程或 import)。
- [ ] **Step 6:** 冒烟:`src/react/index.ts` 暂导出 `export const VERSION = '0.3.0'`;建一个临时测试 `src/react/__tests__/smoke.test.tsx`(render `<div>` 断言)。运行 `bun test`(绿)、`bun run build`(dist/react/index.mjs + index.d.ts 存在)、`bun run check`(不回归)。
- [ ] **Step 7:** `.gitignore` 确认 node_modules/dist 已忽略;commit `feat(react): toolchain for react package (bun build + tsc types + bun test)`。

### Task P2: 模式样板 — Icon / IconSprite / Button / Badge

**Files:** Create `src/react/{Icon,IconSprite,Button,Badge}.tsx` 与 `__tests__/{Icon,Button,Badge}.test.tsx`;Modify `src/react/index.ts`

`Icon.tsx`(完整参考实现,原样落盘):

```tsx
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
```

`IconSprite.tsx`:构建脚本把 `src/icons.svg` 内容生成为 `src/react/sprite.generated.ts`(`export const SPRITE = "<svg …>…</svg>"`,由 build-react.ts 在编译前写出,git 提交该生成文件并在文件头标注 generated);组件用 `dangerouslySetInnerHTML` 渲染一个 `display:none` 容器 + `'use client'` 不需要(纯静态)。测试:render 后 `document.querySelector('#pi-leaf')` 非空。

`Button.tsx`(完整参考实现,原样落盘):

```tsx
'use client';
import * as React from 'react';
import { burst } from './burst';

export type PokoColor = 'meadow' | 'sky' | 'butter' | 'coral' | 'lilac';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color?: PokoColor;
  size?: 'md' | 'sm';
  ghost?: boolean;
  burst?: 'leaf' | 'splash';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = 'meadow', size = 'md', ghost, burst: burstType, className, onClick, children, ...rest }, ref) => {
    const cls = [
      'btn',
      color !== 'meadow' && color,
      ghost && 'ghost',
      size === 'sm' && 'small',
      className,
    ].filter(Boolean).join(' ');
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (burstType) burst(e.currentTarget, burstType);
      onClick?.(e);
    };
    return (
      <button ref={ref} type="button" className={cls} onClick={handleClick} {...rest}>
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
```

`burst.ts`:把 `src/pokoland.js` 中 burst 函数移植为 TS 模块导出(逻辑一字不改,仅模块化;vanilla 版保留不动)。`Badge.tsx`:span,类 `badge` + color 映射(meadow→green、sky→blue、butter→yellow、coral→pink、lilac→purple)。

- [ ] 实现四组件 + sprite 生成步骤入 build-react.ts;index.ts 导出。
- [ ] 测试:Button(render 类名组合;burst="leaf" 点击后 document 出现 `.burst-zone`,fake reduced-motion 未启用);Badge 类名;Icon `use[href="#pi-leaf"]` 与 size style。
- [ ] `bun test && bun run build && bun run check` 绿;commit `feat(react): Icon, IconSprite, Button, Badge`。

### Task P3: 表单控件 — Field/Input/Select/Textarea/Switch/Checkbox/Radio

类名映射:`field`(div,内含 label[htmlFor]+children)、`input`、`select`、`textarea`;Switch:`label.switch > input[type=checkbox] + span.track`,props `checked/defaultChecked/onCheckedChange(boolean)`,aria-label 透传;Checkbox:`label.check > input + span.box(内置对勾 svg,viewBox 0 0 16 13,path M2 7l4 4 8-9,stroke #5C4A36 width 3.5)+ children 文本`;Radio:`label.radio > input + span.ring + children`。

- [ ] 七组件实现 + index 导出;均 forwardRef 到原生 input/相应根元素。
- [ ] 测试:Switch 点击触发 onCheckedChange(true) 且 input.checked 翻转;Checkbox/Radio 同;Input/Select/Textarea render 类名 + value 透传。
- [ ] 全绿后 commit `feat(react): form controls`。

### Task P4: 展示组件 — Progress/Slider/Card/Avatar/Tooltip

- Progress:`div.grow(variant 'sunny' 加类)> div.meta(label children + 百分比 span)+ div.track > div.fill[style --p: value%]`;props `value:number`、`label?:ReactNode`、`variant?:'vine'|'sunny'`;`role="progressbar"` + aria-valuenow。
- Slider:`input[type=range].slider`,受控/非受控,`onValueChange(number)`。
- Card 复合:`Card`=div.card.sticker;`Card.Art`=div.art+`variant('grass'|'sky'|'dusk')`类;`Card.Body`=div.body;`Card.Row`=div.row。
- Avatar:`span.avatar` + color 映射(meadow→g、sky→b、butter→y、coral→p),children 默认渲染 `<Icon name="face" />`。
- Tooltip:`span.tip-wrap`(children + `span.tip`=content),`tabIndex=0` 在触发子元素上;纯 CSS 悬停/聚焦显示,无 JS。
- [ ] 实现 + 导出 + 测试(Progress aria-valuenow;Slider onValueChange;Card 复合结构;Tooltip 内容渲染)。
- [ ] commit `feat(react): Progress, Slider, Card, Avatar, Tooltip`。

### Task P5: 有状态组件 — Tabs / Dialog / Toaster

`Tabs.tsx`(完整参考实现,原样落盘):

```tsx
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
```

- Dialog:props `open: boolean`、`onOpenChange(open)`、children;`createPortal` 到 body:`div.dialog-backdrop.open > div.dialog.sticker[role=dialog][aria-modal=true]`;Esc 与点击 backdrop(target===backdrop)关闭;`useEffect` 中挂 keydown;SSR 安全(无 window 时不渲染 portal)。
- Toaster + toast:模块级订阅器(`let listeners: Set<fn>`);`toast.ok(icon: IconName, msg: string)` / `toast.warn(...)` 推消息;`<Toaster />` 渲染 `div.toast-zone[aria-live=polite]` 并订阅,消息项 `div.toast.ok|warn > span.ico > Icon + 文本`,2600ms 加 `bye`、320ms 后移除(与 vanilla 行为一致)。
- [ ] 实现 + 导出;测试:Tabs 点击切换 aria-selected 与 panel hidden;Dialog open 渲染 portal、Esc 触发 onOpenChange(false);toast.ok 后 Toaster 出现消息文本(fake timers 验证移除可省)。
- [ ] commit `feat(react): Tabs, Dialog, Toaster with imperative toast API`。

### Task P6: 母题组件 — Signpost/NavLink/Plank/CloudSign/WobbleBubble/Photo/ToTop

- Signpost:`nav.signpost`(aria-label 必填透传);NavLink:`a.nav-link`,props `active?:boolean` → 加类 `active` + `aria-current="page"`。
- Plank:`span.plank`。
- CloudSign:`div.cloud-sign`,内置 demo 同款 `<svg viewBox="0 0 380 190">`(circle 簇 + rect,fill #FFFFFF,aria-hidden)+ `div.body > h3{title} + p{children}`;props `title: ReactNode`。
- WobbleBubble:`div.wobble-bubble(seal 变体加类)> div.inner{children}`,props `seal?: boolean`。
- Photo:`div.photo > div.frame > div.shot{children} + div.cap{caption}`,props `caption?: ReactNode`。
- ToTop:`'use client'`;`button.to-top[aria-label]`(默认文案 "Back to top",props 可覆盖)内置 `<Icon name="up"/>`;scroll>threshold(默认 400)加 `show`;点击 scrollTo top(reduced-motion → auto),逻辑与 vanilla 一致但独立实现(不依赖 vanilla 初始化)。
- [ ] 实现 + 导出 + 测试(NavLink active 类与 aria-current;WobbleBubble seal 类;ToTop:设 scrollY=500 派发 scroll 后有 show 类)。
- [ ] commit `feat(react): motif components (signpost, plank, cloud sign, wobble bubble, photo, to-top)`。

### Task P7: 包完整性 — 导出面、d.ts、tarball 冒烟

- [ ] `src/react/index.ts` 核对导出全量(组件 + 类型 + ICON_NAMES + toast/burst);`bun test && bun run build` 绿。
- [ ] `npm pack` 出 tarball;`/tmp/poko-smoke` 新建最小工程:`bun init -y && bun add /path/to/tarball react@18 react-dom@18`;写 `index.tsx`(render Button/Icon/IconSprite/Toaster 到 DOM,触发 toast)+ `Bun.build` 打包成单 html+js;headless Chrome 截图验证按钮样式(引 tarball 内 styles.css)与 toast 出现。**TS 类型验证**:smoke 工程里写 `<Icon name="leaf" />` 编译过、`name="nope"` 用 `bun x tsc --noEmit` 断言报错。
- [ ] 清理临时目录;commit `chore: package exports and tarball smoke test`。

### Task P8: 文档站脚手架(docs-site/)

**Files:** Create `docs-site/{index.html,main.tsx,App.tsx,pages.ts,i18n.ts,components/…}`、`scripts/build-site.ts`;Modify `scripts/build.ts` `index.html`(根重定向改跳 site)

- [ ] SPA:hash 路由(`#/` 首页、`#/c/<id>` 组件页);布局 = 顶栏(站名 Plank + 语言切换 + GitHub 钮)+ 侧栏(Signpost 风格目录,20 项)+ 内容区;全站组件用 `src/react` 本体(相对导入,不经 npm)。
- [ ] 组件页模板:`<Live>`(渲染活例)+ `<Code>`(pre+code 展示源码字符串 + 复制按钮,复制用 navigator.clipboard)+ `<PropsTable>`(数据驱动)+ 无障碍段。页面数据集中在 `pages.ts`(每组件:三语标题/描述、demo 元素、demo 源码串、props 行、a11y 行)。本任务先填 **Button 一页**作模板验证。
- [ ] i18n:沿用 `[zh,en,ja]` 词典 + localStorage(`pokoland-lang` 共用)+ `?lang=`。
- [ ] `scripts/build-site.ts`:Bun.build 打包(react 不 external,site 自含)→ `site/`(html + js + 复制 pokoland.css/icons 内联);`site/` 进 .gitignore,CI 构建。本地 `bun run dev` 能访问 `/site/`(serve.ts 已通用)。根 `index.html` 重定向 `./demo/` → `./site/`。
- [ ] headless 截图验证首页 + Button 页三语;commit `feat(site): docs site scaffold with Button reference page`。

### Task P9: 文档站内容 — 其余 19 个组件页

- [ ] 按 P8 模板填 `pages.ts`:Badge、Field/Input/Select/Textarea(合一页"Form")、Switch、Checkbox/Radio(合页)、Progress、Slider、Card、Avatar、Tooltip、Tabs、Dialog、Toast、Icon(全 25 图标网格)、Signpost、Plank、CloudSign、WobbleBubble、Photo、ToTop。每页:三语描述(语感遵循 cozy 标准)、≥1 活例、代码块、Props 表全字段、a11y 说明。
- [ ] 三语逐页 headless 抽查(zh/en/ja 各 3 页);`bun run check`(若 check.ts 范围扩到 docs-site 文案则同步,否则注明 site 词典自查);commit `docs(site): all component pages`。

### Task P10: CI 与上线

- [ ] `.github/workflows/pages.yml`:steps 改为 `bun install --frozen-lockfile` → `bun run check` → `bun test` → `bun run build`(含 site);artifact 仍传仓库根(site/ 在构建后存在)。注意 lockfile(bun.lock)需入库:.gitignore 不得忽略。
- [ ] push 后 `gh run watch` 绿;线上验证:`/pokoland-ui/`(重定向到 site)、`/site/#/c/button` 200 且内容在、`/demo/` 不回归。
- [ ] commit `ci: build and deploy docs site`。

### Task P11: 文档与元信息同步

- [ ] README ×3:安装段改 React-first(bun add/npm i + import 示例 + styles.css + IconSprite 说明),保留零依赖 CSS 用法段;Live demo 链接改文档站为主、demo 为辅。
- [ ] ROADMAP:勾掉 `@pokoland-ui/react`(注:实际为单包 pokoland-ui 子路径,写明)、Storybook 项改为"文档站已自建";CONTRIBUTING:新增"React 组件须配测试 + 文档站页"条款、devDeps 政策(零运行时依赖)。
- [ ] docs/components.md 顶部加一行指向文档站;commit `docs: update readmes and contributor guides for the react package`。

### Task P12: 发布 0.3.0(人工 gate)

- [ ] `npm whoami` —— 未登录则**停下报告**,等用户 `npm login`(此为计划唯一人工节点)。
- [ ] `bun run check && bun test && bun run build` 全绿;`npm publish --dry-run` 审清单(仅 dist/README/LICENSE,无源码泄漏、无 docs-site);体积 sanity(<300KB)。
- [ ] `npm publish`;`npm view pokoland-ui version` = 0.3.0;干净目录 `bun add pokoland-ui react react-dom` 装注册表版冒烟 render。
- [ ] `git tag v0.3.0 && git push --tags`;`gh release create v0.3.0 --title "pokoland-ui 0.3.0" --notes`(英文要点:react components/types/docs site/zero runtime deps)。
- [ ] commit(若有版本文件变更)`chore: release 0.3.0`。

### Task P13: 验收(spec §7)

- [ ] 逐项跑 spec §7 五条,产出 PASS/FAIL 表报告用户;包含:registry 安装冒烟、类型联合断言、文档站 20 页三语、demo/check 零回归、提交卫生(全英文、零 AI 署名、作者唯一)。

---

## Self-Review

- **Spec 覆盖**:§2 包形态(P1/P7)、§3 全组件(P2-P6,清单 20 项对表)、§4 构建测试(P1/P7)、§5 文档站(P8-P10)、§6 发布(P12)、§7 验收(P13);README/ROADMAP(P11)。i18n 不进包 ✓(站内词典属站,P8)。
- **占位符**:无 TBD;P3-P6 未给全量 TSX 属设计选择——每组件给定了精确类名映射、props 签名、行为与测试断言,且 P2/P5 含四个完整模式样板,实现自由度被规格压缩到机械水平。
- **一致性**:`PokoColor` 在 P2 定义、P3-P6 引用;`pokoland-lang` localStorage 键与现 vanilla 共用;sprite 生成文件命名 `sprite.generated.ts` 在 P2/P7 一致;`site/` 进 gitignore 与 P10 CI 构建一致;bun.lock 入库在 P10 说明。
