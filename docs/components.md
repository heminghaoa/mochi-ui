# 🧩 组件用法 Components

> 当前为 HTML + CSS class 形式。React 化之后本文档会同步更新为 props API。
> 所有示例可在 `demo/index.html` 中找到可运行版本。

## 图标与 i18n 约定

图标:`<svg class="mi" aria-hidden="true"><use href="#pi-leaf"/></svg>`,可用名:leaf drop zap berry moon check wrench heart star bug package backpack book map mushroom bubbles speaker tent face flower up hammer tile tile-flower goo(共 25 个)。
toast 第二参传**图标名**:`toast('ok', 'star', T('toastOk'))`。
文案标记:`data-i18n`(文本)/`data-i18n-html`/`data-i18n-ph`(placeholder)/`data-i18n-aria`;词典 `window.POKOLAND_I18N = { key: [zh, en, ja] }` 须在 `pokoland.js` 之前定义;`?lang=en` URL 参数可强制语言。

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

## Signpost 导航木牌

```html
<nav class="signpost" aria-label="主导航">
  <a class="nav-link active" href="#" aria-current="page">首页</a>
  <a class="nav-link" href="#">图鉴</a>
</nav>
```

木板底色取 `--wood` / `--wood-deep`,两侧自带角钉。激活项加 `.active` 与 `aria-current="page"`(云朵蓝胶囊);悬停为波浪下划线。

## Cloud Sign 云朵告示牌

云形由一组 `<circle>` + 圆角 `<rect>` 拼合(同色 fill 自然融合,投影作用于整体),内容放 `.cloud-sign .body` 居中浮于云上。完整标记见 demo「导航 & 告示牌」一节。

## Back to top 回到顶部

```html
<button class="to-top" type="button" aria-label="回到顶部">
  <svg class="pi" aria-hidden="true"><use href="#pi-up"/></svg>
</button>
```

`pokoland.js` 自动绑定:页面滚动超过 400px 时弹簧浮现;点击平滑回顶,`prefers-reduced-motion` 下为瞬时跳转。

## Plank 木牌横幅

```html
<span class="plank">村庄公告</span>
```

独立木牌标签(标题/分组横幅),取 `--wood` 系令牌,两侧角钉。

## Wobble Bubble 蠕动气泡

```html
<div class="wobble-bubble"><div class="inner">春季活动 · 即将开始</div></div>
<div class="wobble-bubble seal"><div class="inner">新地图筹备中</div></div>
```

外圈软坨以 `border-radius` 关键帧持续蠕动(`squirm`,内外圈反向),`prefers-reduced-motion` 下静止。`.seal` 为白底描边的印章变体。

## Photo 撕边照片

```html
<div class="photo"><div class="frame">
  <div class="shot">…</div>
  <div class="cap">今天的村口</div>
</div></div>
```

`clip-path` 锯齿多边形撕边 + 微旋转(偶数项反向),悬停回正抬升。

## Burst 点击粒子

```html
<button class="btn" data-burst="leaf">采集果实</button>
<button class="btn sky" data-burst="splash">跳进水里</button>
```

`pokoland.js` 自动绑定 `[data-burst]`:`leaf` 飘落叶(之字摇曳下落),`splash` 溅水花(上抛回落)。粒子复用 `pi-leaf` / `pi-drop` 图标与令牌色;也可编程触发 `burst(element, 'leaf')`。`prefers-reduced-motion` 下不发射。
