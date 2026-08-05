# 贡献指南 Contributing

谢谢你愿意帮助 Pokoland UI。v0.3 起，React 组件、三语文档站与零依赖原生入口都属于正式维护范围。

## 开发约定

1. **设计令牌**：颜色、阴影、圆角和动效优先使用 [设计令牌](docs/design-tokens.md)，不要在组件中重复硬编码。
2. **公开 API**：React 组件位于 `src/react/`，应透传对应的原生 DOM 属性并提供导出的 TypeScript 类型。无必要不新增破坏性 API。
3. **零运行时依赖**：发布包不能增加运行时 dependencies。React 与 React DOM 只能作为可选 peer；`styles.css`、`vanilla` 与 `icons.svg` 必须可独立使用。
4. **无障碍底线**：交互控件优先基于原生元素，具备可见焦点，支持键盘和读屏，并尊重 `prefers-reduced-motion`。
5. **UI 内零 emoji**：界面图形使用 `Icon`、`IconSprite` 或 `src/icons.svg`。emoji 仅允许出现在 Markdown 文档中。
6. **三语齐全**：文档站或 Demo 新增可见文案时，必须同时提供中文、英文和日文，并验证长文本与移动端布局。
7. **IP 红线**：不接受任天堂、宝可梦或其他商业 IP 的角色、Logo、图形、字体复刻或官方素材。原创设计欢迎贡献。

## 项目入口

| 路径 | 作用 |
| --- | --- |
| `src/react/` | React 组件、类型与单元测试 |
| `src/pokoland.css` | 所有入口共用的样式真源 |
| `src/pokoland.js` | 零依赖原生交互入口 |
| `src/icons.svg` | Pokoland 图标 sprite |
| `docs-site/` | 三语 React 文档站与页面测试 |
| `demo/` | 零依赖 HTML/CSS/JS 演示 |
| `scripts/` | 检查、构建、开发服务器与发布辅助脚本 |

## 本地工作流

```bash
git clone https://github.com/<you>/pokoland-ui.git
cd pokoland-ui
bun install
git checkout -b feat/short-description

bun run check
bun test
bun run build
```

视觉或交互改动还需运行 `bun run dev`，在桌面和窄屏下检查文档站及原生 Demo。发布相关改动可用 `npm pack --dry-run` 核对包内容；不要把本地 `.tgz` 文件提交到仓库。

## 测试要求

- 新增或改变 React 行为时，在相邻 `__tests__` 中覆盖正常路径、原生属性与关键无障碍状态。
- 改变公开类型时，补充可编译用例；联合类型应同时验证合法值与预期失败值。
- 改变文档页面时，保持三语键完整，并让实时示例可渲染。
- 修复 bug 时，优先先写能复现问题的回归测试。

## Commit 类型

| 前缀 | 用途 |
| --- | --- |
| `feat` | 新组件或新功能 |
| `fix` | bug 修复 |
| `perf` | 有测量依据的性能优化 |
| `a11y` | 无障碍改进 |
| `docs` | 文档与示例 |
| `refactor` | 不改变行为的重构 |
| `test` | 测试调整 |
| `chore` | 构建与维护任务 |

## PR 检查清单

- [ ] `bun run check`、`bun test`、`bun run build` 全部通过
- [ ] Chrome、Safari 或 Firefox 至少完成一个真实浏览器验收
- [ ] 桌面与移动端不破版，键盘路径与焦点可见
- [ ] 新文案中、英、日三语齐全
- [ ] 公开 API、README 或组件文档已同步
- [ ] 视觉改动附有截图或短录屏
- [ ] 不包含生成目录、凭证、日志或本地发布 tarball

## 提交 Issue

Bug 请提供复现步骤、运行环境、预期结果、实际结果和必要截图。新组件提案请先说明具体使用场景与现有组件为何不足。

## 行为准则

友善、耐心、对事不对人，并为不同经验水平的贡献者提供可执行的反馈。
