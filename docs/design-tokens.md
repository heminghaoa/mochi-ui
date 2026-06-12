# 🎨 设计令牌 Design Tokens

Mochi UI 的所有视觉决策都收敛在这份文档里。新组件必须从这些令牌取值,不允许硬编码颜色或阴影。

## 1. 色板:晴天草原 Sunny Meadow

| Token | Hex | 用途 |
|-------|-----|------|
| `--sky` | `#BDE8F7` | 天空蓝(浅)· 背景渐变顶部 |
| `--sky-deep` | `#6EC9EA` | 天空蓝(深)· 按钮 / 焦点环 |
| `--meadow` | `#8FD178` | 草地绿 · 主按钮 / 成功态 |
| `--meadow-deep` | `#5FAE52` | 草地绿(深)· 按钮厚度 |
| `--cream` | `#FFF9EC` | 奶油底 · 页面背景底部 |
| `--butter` | `#FFD66B` | 黄油黄 · 强调 / 警示 / 选中态 |
| `--butter-deep` | `#F0B73C` | 黄油黄(深) |
| `--coral` | `#FF9D9D` | 珊瑚粉 · 危险操作的"软化版" |
| `--coral-deep` | `#E87979` | 珊瑚粉(深) |
| `--lilac` | `#C9B8F0` | 丁香紫 · 夜晚 / 稀有 |
| `--lilac-deep` | `#A88FE0` | 丁香紫(深) |
| `--bark` | `#5C4A36` | 树皮棕 · 正文文字(**禁止用纯黑**) |
| `--bark-soft` | `#8C7860` | 树皮棕(浅)· 次级文字 |

**淡色填充变体**(用于 Badge / 卡片插画底):
`#D9F2CB`(绿)/ `#D2EEFA`(蓝)/ `#FFEDB8`(黄)/ `#FFDCDC`(粉)/ `#E8DFFA`(紫)

### 配色规则

1. 文字永远用 `--bark` / `--bark-soft`,不用 `#000`——纯黑在奶油底上太凶了。
2. 每个彩色都有一个 `-deep` 搭档,用于按钮底部厚度和按压态。
3. 浅黄底(`--butter`)上的文字用 `--bark`,不用白色(对比度不够)。

## 2. 贴纸语言 Sticker Language

这是 Mochi UI 的灵魂,三件套缺一不可:

```css
.sticker {
  border: 4px solid #FFFFFF;              /* ① 厚白描边 */
  border-radius: 22px;                     /* ② 大圆角 */
  box-shadow:
    0 5px 0 rgba(92, 74, 54, .16),        /* ③ 硬投影(贴纸厚度) */
    0 10px 24px rgba(92, 74, 54, .14);    /*    软投影(漂浮感) */
}
```

- 描边宽度:大组件 4px,小组件(small 按钮、checkbox)3px
- 投影颜色统一用 `--bark` 的透明度变体,**禁止用纯黑投影**
- 静态组件允许 `rotate(-2deg ~ 2deg)` 的微旋转,同一容器内相邻元素旋转方向交替

## 3. 字体 Typography

```css
--font-round: 'Baloo 2', 'M PLUS Rounded 1c', 'Yuanti SC', 'YouYuan', sans-serif;
```

- 西文:Baloo 2(充气感圆体)
- 日文/汉字:M PLUS Rounded 1c,中文环境回退到圆体/幼圆
- 字重只用 600 / 700 / 800,**没有 400**——细字重会破坏充气感
- 标题可使用"多重 text-shadow 模拟白描边"做成贴纸字(见 demo 的 `.puff`)

## 4. 动效 Motion

| 场景 | 曲线 | 时长 |
|------|------|------|
| 弹簧弹出(toast / 勾选 / 开关) | `cubic-bezier(.4, 1.6, .4, 1)` | 200–350ms |
| 按钮按压 | `ease` | 100ms |
| 进度条生长 | `cubic-bezier(.4, 1.4, .4, 1)` | 600ms |
| 悬停抬升 | `ease` | 150–200ms |

规则:

1. **过冲(overshoot)是默认**——元素出现时应该"弹"一下,不是淡入。
2. 按钮按压 = `translateY(5px)` + 厚度阴影归零,模拟物理下沉。
3. 必须尊重 `prefers-reduced-motion: reduce`,所有动画归零。

## 5. 无障碍底线

- 所有可交互元素必须有 `:focus-visible` 焦点环:`outline: 4px solid var(--sky-deep); outline-offset: 3px;`
- 自定义控件(switch / checkbox / radio)必须基于原生 `<input>` 实现,只隐藏视觉不隐藏语义
- Dialog 需要 `role="dialog"` + `aria-modal` + Esc 关闭
- Toast 容器需要 `aria-live="polite"`
