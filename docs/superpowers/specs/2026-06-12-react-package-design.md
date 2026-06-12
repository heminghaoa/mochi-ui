# Pokoland UI React 组件包设计 Spec

日期:2026-06-12
状态:待用户批准
关系:修订 [开源化 spec](2026-06-12-mochi-ui-opensource-design.md) §1 的非目标——用户决定将"npm 发布 + React 组件包"提前实施(原 ROADMAP v0.3)。

## 1. 目标与定位

把 Pokoland UI 发成 **npm 上可安装的真 React 组件库,配独立文档站**:

```bash
bun add pokoland-ui
```
```tsx
import { Button, Card, Toaster, toast } from 'pokoland-ui';
import 'pokoland-ui/styles.css';

<Button color="sky" burst="splash" onClick={() => toast.ok('star', '溅起来了!')}>
  跳进水里
</Button>
```

成功标准:npm 包可安装可用(含 TypeScript 类型)、文档站上线(每组件一页:活例子 + 可复制代码 + Props 表)、现有静态 demo 与零依赖用法不受影响。

## 2. 包形态(关键决策)

**单包 `pokoland-ui` + 子路径导出**,不用 scoped 包(`@pokoland-ui/*` 需要先建 npm org,且双包维护成本高):

| 导出 | 内容 | 依赖要求 |
|------|------|---------|
| `pokoland-ui`(主入口) | React 组件(ESM + `.d.ts`) | peer: react ≥18(optional) |
| `pokoland-ui/styles.css` | 现有 `src/pokoland.css` 构建产物 | 无 |
| `pokoland-ui/vanilla` | 现有 `src/pokoland.js`(toast/burst/tabs/i18n,零依赖) | 无 |
| `pokoland-ui/icons.svg` | sprite 文件 | 无 |

- **零运行时依赖原则升级表述**:包的 `dependencies` 永远为空;React 是 optional peerDependency(纯 CSS 用户不装 React 也零警告);devDependencies 允许(typescript、@types/react 等构建期工具)。
- 样式唯一真源仍是 `src/pokoland.css`,React 组件只产出 className,不内联样式、不引 CSS-in-JS。
- 版本 `0.3.0`;`files` 只含 `dist/`;MIT。

## 3. 组件清单与 API(v0.3.0 全量 20 个)

通用约定:每个组件透传 `className`/`ref`/原生 props;`color` 枚举 `meadow|sky|butter|coral|lilac`;受控/非受控双模式(`value`/`defaultValue`)。

| 组件 | 关键 Props | 说明 |
|------|-----------|------|
| `Button` | `color` `size('md'|'sm')` `ghost` `burst('leaf'|'splash')` | burst 即点击粒子 |
| `Badge` | `color` | |
| `Field` `Input` `Select` `Textarea` | 原生透传 + `label` | Field 组合 label |
| `Switch` `Checkbox` `Radio` | `checked/defaultChecked` `onCheckedChange` | 原生 input 打底 |
| `Progress` | `value(0-100)` `variant('vine'|'sunny')` | 藤蔓/向日葵 |
| `Slider` | `value/defaultValue` `onValueChange` | |
| `Card` + `Card.Art/Body/Row` | `art('grass'|'sky'|'dusk')` | 复合组件 |
| `Tabs` + `Tabs.List/Tab/Panel` | `value/defaultValue` `onValueChange` | aria-selected 内置 |
| `Avatar` | `color` | 团子脸内置 |
| `Tooltip` | `content` | hover + focus-within |
| `Dialog` | `open` `onOpenChange` | portal + Esc + 遮罩点击关 |
| `Toaster` + `toast.ok/warn(icon, msg)` | 挂一次 Toaster,toast 全局可调 | 命令式 API |
| `Signpost` + `NavLink` | `active` | 木牌导航 |
| `Plank` `CloudSign` `WobbleBubble`(`seal`) `Photo` | 对应现有母题组件 | |
| `ToTop` | `threshold(默认 400)` | 滚动浮现 |
| `Icon` | `name(25 个图标名)` `size` | 强类型 name 联合类型 |
| `IconSprite` | — | 在 root 渲染一次内联 sprite |

- 交互组件标 `'use client'`(Next.js RSC 兼容:静态组件可服务端渲染)。
- **不移植 i18n 引擎**——那是应用层职责,留在 `pokoland-ui/vanilla` 供纯 HTML 用户使用。

## 4. 目录与构建

```
src/
├── pokoland.css / pokoland.js / icons.svg   (现状不动,vanilla 真源)
└── react/
    ├── index.ts                              (统一导出)
    ├── <Component>.tsx × ~20
    └── __tests__/<Component>.test.tsx
scripts/build-react.ts                        (Bun.build → dist/react/*.mjs,external react)
tsconfig.json                                 (tsc --emitDeclarationOnly → dist/react/*.d.ts)
docs-site/                                    (文档站源码,见 §5)
```

- `bun run build` 扩展为:icons 同步 → vanilla 产物 → React ESM(Bun.build,minify,external react/react-dom)→ `.d.ts`(tsc)→ 文档站构建。
- 测试:`bun test` + happy-dom + @testing-library/react,每组件至少 1 渲染断言,有状态组件(Tabs/Dialog/Switch/Toast)加交互断言。CI 在 build 前跑 `bun test`。

## 5. 文档站(dogfooding)

- **用 Pokoland UI 自己做文档站**:小型 React SPA(Bun.build 打包,React 仅 devDep),样式即 `pokoland.css`,世界观即贴纸草原。
- 信息架构:首页(安装/快速开始)+ 每组件一页:**活例子(真组件渲染)→ 代码块(可一键复制)→ Props 表 → 无障碍说明**;侧边栏用 Signpost 风格导航。
- 三语:沿用 `[zh, en, ja]` 词典机制(文档正文三语,代码示例不翻译)。
- 部署:构建产物输出 `site/`(根 `index.html` 重定向页改为跳文档站,文档站内链 demo);CI 照旧 Pages 全仓库部署,文档站地址 `https://heminghaoa.github.io/pokoland-ui/site/`。
- 现有 `demo/index.html` 保留(零依赖直开的活样本,文档站链向它)。

## 6. 发布流程

1. `npm whoami` 检查登录,未登录则停下请用户 `npm login`(**唯一阻塞点**);
2. `bun run check && bun test && bun run build` 全绿;
3. `npm publish --dry-run` 审包内容(确认只有 dist/、README、LICENSE);
4. `npm publish`(0.3.0);发布后 `npm view pokoland-ui` 验证 + 在干净临时目录 `bun add pokoland-ui` 装回冒烟;
5. README 三语更新安装段;ROADMAP 勾选;GitHub Release tag `v0.3.0`。

包名 `pokoland-ui` 已确认未被占用(npm 404)。

## 7. 验收标准

1. `bun test` 全绿;`bun run build` 产出 ESM + d.ts + css + vanilla + sprite;
2. 临时 Vite/Next 项目安装本地 tarball(`npm pack`)冒烟:Button/Dialog/Toast/Icon 渲染与交互正常,TS 类型提示正确(name 联合类型生效);
3. 文档站线上可访问,20 组件页齐全,三语切换正常,活例子可交互;
4. 现有 demo、Pages、check 脚本零回归;
5. 提交全英文、零 AI 署名;npm 包页面无 AI 字样。

## 8. 风险与对策

| 风险 | 对策 |
|------|------|
| 20 组件 API 一次定型,后悔成本高 | 0.x 版本语义(允许 breaking);API 对齐业界惯例(Radix/shadcn 命名) |
| Toast/Dialog 的 portal 与 SSR 边界 | 'use client' + useEffect 挂载,测试覆盖 |
| 文档站工作量被低估 | 组件页用统一模板 + 子代理流水线生成,人工(用户)抽查 |
| npm 发布不可逆(版本号烧掉) | dry-run + 本地 tarball 冒烟后才 publish |

## 9. 决策记录

1. React 组件包直接做,不走 CSS-first 过渡(用户,2026-06-12);
2. 单包 `pokoland-ui` 子路径导出,放弃 scoped org(本 spec,理由 §2);
3. 零依赖原则改述为"零**运行时**依赖",devDeps 放行构建工具(本 spec);
4. i18n 引擎不进 React 包(本 spec);
5. 文档站 dogfooding 自家组件,不引文档框架(本 spec)。
