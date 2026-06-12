# 🧩 组件用法 Components

> 当前为 HTML + CSS class 形式。React 化之后本文档会同步更新为 props API。
> 所有示例可在 `demo/index.html` 中找到可运行版本。

## Button 按钮

```html
<button class="btn">采集果实</button>          <!-- 默认:草地绿 -->
<button class="btn sky">跳进水里</button>
<button class="btn butter">晒晒太阳</button>   <!-- 浅底深字 -->
<button class="btn coral">交个朋友</button>
<button class="btn lilac">夜间散步</button>
<button class="btn ghost">再想想…</button>     <!-- 白底次级按钮 -->
<button class="btn small">小一号</button>
<button class="btn icon-btn">❤️ 带图标</button>
```

要点:厚度阴影(`box-shadow: 0 5px 0 var(--btn-deep)`)+ `:active` 时 `translateY(5px)`,构成物理按压。新增配色时必须同时提供 `--btn-bg` 和 `--btn-deep` 两个变量。

## Badge 标签

```html
<span class="badge green">🌿 草系</span>
<span class="badge blue">💧 水系</span>
<span class="badge yellow">⚡ 元气满满</span>
<span class="badge pink">🍓 限定款</span>
<span class="badge purple">🌙 夜行性</span>
```

奇偶项自动反向微旋转,营造手贴效果。

## Form 表单

```html
<div class="field">
  <label for="name">给小屋起个名字</label>
  <input id="name" class="input" type="text" placeholder="比如:咕咕小筑">
</div>

<select class="select">…</select>
<textarea class="textarea"></textarea>
```

聚焦态:边框变 `--butter` + `scale(1.01)` 轻微放大。

## Switch 开关

```html
<label class="switch" aria-label="背景音乐">
  <input type="checkbox" checked>
  <span class="track"></span>
</label>
```

滑块使用弹簧曲线过冲,开启态轨道变 `--meadow`。

## Checkbox / Radio

```html
<label class="check">
  <input type="checkbox">
  <span class="box"><svg><!-- 对勾 --></svg></span>
  浇水
</label>

<label class="radio">
  <input type="radio" name="meal">
  <span class="ring"></span>
  苹果派
</label>
```

原生 input 仅视觉隐藏(`opacity: 0`),键盘与读屏可用。

## Progress 进度条(藤蔓生长)

```html
<div class="grow">
  <div class="meta"><span>小番茄生长中</span><span>60%</span></div>
  <div class="track"><div class="fill" style="--p: 60%"></div></div>
</div>
<!-- 变体:.grow.sunny 黄色 + 🌻 -->
```

进度通过 CSS 变量 `--p` 控制,条纹斜纹背景,顶端跟随一个 emoji 小苗。

## Slider 滑块

```html
<input type="range" class="slider" min="0" max="100" value="60">
```

## Card 卡片(图鉴卡)

```html
<div class="card sticker">
  <div class="art grass">🍄</div>
  <div class="body">
    <h3>圆圆菇</h3>
    <p>下雨天会自己撑开伞。</p>
    <div class="row">
      <span class="badge green">🌿 草系</span>
      <button class="btn small">收下</button>
    </div>
  </div>
</div>
```

插画区变体:`art grass` / `art sky` / `art dusk`。悬停时旋转归零 + 抬升。

## Tabs 选项卡(路牌式)

```html
<div class="tab-list" role="tablist">
  <button class="tab-btn" role="tab" aria-selected="true" data-tab="t1">🎒 背包</button>
</div>
<div class="tab-panel" id="t1" role="tabpanel">…</div>
```

选中的 tab 上浮 4px 并与面板"融合"(同为白色)。

## Tooltip 工具提示

```html
<span class="tip-wrap">
  <span class="avatar g" tabindex="0">🐸</span>
  <span class="tip">蛙蛙村长 · 在线</span>
</span>
```

hover 与 `:focus-within` 均可触发(键盘可达)。

## Dialog 对话框

```html
<div class="dialog-backdrop" id="dlg">
  <div class="dialog sticker" role="dialog" aria-modal="true">…</div>
</div>
<script>
  // .open class 控制显隐;Esc 与点击遮罩关闭
</script>
```

## Toast 通知

```js
toast('ok',   '🌟', '操作成功!获得 10 颗星星');
toast('warn', '🐛', '背包里好像混进了一只虫子');
```

自动 2.6s 后弹出离场。容器带 `aria-live="polite"`。
