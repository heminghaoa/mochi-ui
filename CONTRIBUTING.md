# 🤝 贡献指南 Contributing

谢谢你想给 Mochi UI 添砖加瓦!这里的规矩不多,但都很重要。

## 提交前请确认

1. **遵守设计令牌**:颜色、阴影、圆角、动效曲线必须取自 [docs/design-tokens.md](docs/design-tokens.md),不要硬编码。
2. **贴纸三件套**:新组件必须包含厚白描边、大圆角、双层投影(硬 + 软)。
3. **无障碍底线**:
   - 可交互元素有 `:focus-visible` 焦点环
   - 自定义控件基于原生 `<input>` / `<button>`
   - 动画尊重 `prefers-reduced-motion`
4. **零依赖原则(当前阶段)**:demo 保持纯 HTML/CSS/JS,不引入框架和构建工具。React 版本将在独立分支进行(见 ROADMAP)。
5. **IP 红线**:不接受任何包含任天堂、宝可梦或其他商业 IP 素材的提交(角色形象、Logo、精灵球图形、官方字体复刻等)。原创吉祥物和图形欢迎之至。

## 工作流

```bash
# 1. Fork 并克隆
git clone https://github.com/<you>/mochi-ui.git
cd mochi-ui

# 2. 建分支(命名:类型/简述)
git checkout -b feat/skeleton-sprout

# 3. 开发:直接改 demo/index.html,浏览器打开即可预览

# 4. 提交(Conventional Commits)
git commit -m "feat(skeleton): 新增种子发芽骨架屏"

# 5. 推送并发起 PR
```

### Commit 类型

| 前缀 | 用途 |
|------|------|
| `feat` | 新组件 / 新功能 |
| `fix` | 修 bug |
| `style` | 视觉调整(不改行为) |
| `docs` | 文档 |
| `a11y` | 无障碍改进 |
| `refactor` | 重构 |

## PR 检查清单

- [ ] 在 Chrome / Safari / Firefox 看过一眼
- [ ] 移动端(≤640px)不破版
- [ ] 键盘 Tab 能走通,焦点环可见
- [ ] 截图或录屏附在 PR 描述里(视觉项目,一图胜千言)

## 提 Issue

- 🐛 Bug:附复现步骤 + 浏览器版本 + 截图
- 💡 新组件提案:先描述使用场景,最好附手绘草图——画得丑没关系,可爱就行

## 行为准则

像在治愈系游戏的村子里一样待人:友善、耐心、不阴阳怪气。对事不对人,新手友好。
