# Pokoland UI

**[English](README.md)** | 简体中文 | **[日本語](README.ja.md)**

> 一套治愈系贴纸风 React 组件库，同时保留零依赖 CSS 与原生 JavaScript 入口。

![status](https://img.shields.io/badge/status-v0.3.0_开花-FFD66B)
![license](https://img.shields.io/badge/license-MIT-8FD178)
![runtime dependencies](https://img.shields.io/badge/runtime_dependencies-zero-8FD178)

**[组件文档](https://heminghaoa.github.io/pokoland-ui/?lang=zh)** · **[原生 Demo](https://heminghaoa.github.io/pokoland-ui/demo/?lang=zh)**

![Pokoland UI](docs/assets/hero-zh.png)

## 这是什么

Pokoland UI 是一套面向 React 18+、带完整 TypeScript 类型的组件库：

- 厚白描边，让组件像手工剪下的贴纸；
- 清晰的悬停、按下、聚焦、禁用与减少动效状态；
- 通过 CSS 自定义属性开放的晴天草原配色；
- 25 个原创 SVG 图标，正式 UI 内零 emoji；
- 原生 DOM 属性透传与完整声明文件；
- 中文、英文、日文三语组件文档；
- 除可选 React peer 之外，零运行时依赖。

不使用 React 的项目仍可单独使用框架无关的样式、SVG sprite 与原生交互入口。

## 安装

```bash
npm install pokoland-ui
```

```tsx
import { Button, Icon, IconSprite } from 'pokoland-ui';
import 'pokoland-ui/styles.css';

export function App() {
  return (
    <>
      <IconSprite />
      <Button color="sky" burst="splash">
        <Icon name="drop" />
        跳进水里
      </Button>
    </>
  );
}
```

使用 `Icon` 时，在应用根部渲染一次 `IconSprite`。组件会透传对应的原生属性，因此标签、事件、ref 与 ARIA 属性都可直接使用。

## 包入口

| 引入路径 | 用途 |
| --- | --- |
| `pokoland-ui` | React 组件、工具函数与 TypeScript 类型 |
| `pokoland-ui/styles.css` | 主题令牌与组件样式 |
| `pokoland-ui/vanilla` | 可选的 Toast、Tabs、Dialog、i18n 与粒子交互 |
| `pokoland-ui/icons.svg` | 独立 Pokoland 图标 sprite |

所有视觉令牌都在 `:root` CSS 变量中，可直接调整颜色、圆角、阴影和动效，不需要重新构建组件包。

## 文档

[三语组件图鉴](https://heminghaoa.github.io/pokoland-ui/?lang=zh)覆盖完整公开 API，包含实时示例、可复制 React 代码、props 表格与无障碍说明。任意页面都可切换中文、英文和日文，链接可直接分享。

非 React 项目可从[零依赖 Demo](https://heminghaoa.github.io/pokoland-ui/demo/?lang=zh)与[原生组件说明](docs/components.md)开始。

## 本地开发

项目使用 [Bun](https://bun.sh) 完成开发与发布自动化。

| 命令 | 用途 |
| --- | --- |
| `bun run dev` | 在 `localhost:4178` 启动文档与 Demo |
| `bun run check` | 检查 UI emoji 与三语 Demo 覆盖 |
| `bun test` | 运行 React、包与文档测试 |
| `bun run build` | 构建 npm 产物、文档、Demo 与 Pages artifact |
| `npm pack --dry-run` | 检查 npm 将要发布的准确文件 |

组件、测试、无障碍、翻译与 IP 规范见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 命名、灵感与 IP

**Pokoland** 来自日语拟声词「ぽこぽこ」，让人联想到软按钮被按下时的轻柔声音。视觉氛围受到治愈系生活模拟游戏启发。所有设计、配色、图形、图标与文案均为原创。Pokoland UI 是非官方的粉丝精神创作项目，与任天堂、宝可梦公司无关联、无背书，也不包含任何官方素材；贡献内容同样必须遵守此规则。

## License

[MIT](LICENSE) © 2026 Pokoland UI Contributors
