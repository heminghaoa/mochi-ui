# 组件用法 Components

完整的 React API、实时示例、可复制代码、props 表格与无障碍说明请访问：

- [中文组件文档](https://heminghaoa.github.io/pokoland-ui/site/?lang=zh)
- [English documentation](https://heminghaoa.github.io/pokoland-ui/site/?lang=en)
- [日本語ドキュメント](https://heminghaoa.github.io/pokoland-ui/site/?lang=ja)

本文保留 React 与零依赖入口的最小接入说明。可运行的原生版本见 [`demo/index.html`](../demo/index.html)。

## React

```bash
npm install pokoland-ui
```

```tsx
import {
  Badge,
  Button,
  Card,
  Field,
  Icon,
  IconSprite,
  Input,
} from 'pokoland-ui';
import 'pokoland-ui/styles.css';

export function Example() {
  return (
    <>
      <IconSprite />
      <Card>
        <Badge color="green">Available</Badge>
        <Field label="Village name" htmlFor="village-name">
          <Input id="village-name" placeholder="Sunnybank" />
        </Field>
        <Button color="sky">
          <Icon name="leaf" />
          Save
        </Button>
      </Card>
    </>
  );
}
```

`IconSprite` 在页面中渲染一次即可。所有组件会透传对应的原生属性，因此可以直接添加事件、`ref`、`aria-*` 与 `data-*` 属性。

公开 React API 包括：

- 基础：`Button`、`Badge`、`Card`、`Avatar`、`Icon`、`IconSprite`
- 表单：`Field`、`Input`、`Select`、`Textarea`、`Switch`、`Checkbox`、`Radio`、`Progress`、`Slider`
- 导航与反馈：`Tooltip`、`Tabs`、`Dialog`、`Toaster`、`toast`、`Signpost`、`NavLink`、`ToTop`
- Pokoland 母题：`Plank`、`CloudSign`、`WobbleBubble`、`Photo`、`burst`

## CSS 与 Vanilla JavaScript

只使用样式时：

```js
import 'pokoland-ui/styles.css';
```

需要原生 Toast、Tabs、Dialog、i18n、回到顶部或点击粒子时，再引入：

```js
import 'pokoland-ui/vanilla';
```

不经过打包器时，可从 npm 包的 `dist/` 复制 `pokoland.css`、`pokoland.js` 与 `icons.svg`，或直接参考[线上原生 Demo](https://heminghaoa.github.io/pokoland-ui/demo/)。

## 主题令牌

颜色、字体、圆角、描边、阴影和动效都由 `:root` CSS 自定义属性控制。完整清单见[设计令牌](design-tokens.md)。组件新增配色或状态时，应优先扩展令牌，而不是在局部重复硬编码。
