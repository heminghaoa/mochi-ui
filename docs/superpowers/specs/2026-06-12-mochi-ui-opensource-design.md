# Mochi UI 开源化设计 Spec

> 2026-06-12 修订:项目更名 Pokoland UI(用户决定,全量改名,见 ../plans/2026-06-12-pokoland-rename.md)。文中 Mochi UI 为更名前的历史名称。

日期:2026-06-12
状态:待用户批准
原型:`.proto/index.html`(本 spec 所有视觉/交互决策均已在该原型中验证通过)

---

## 1. 定位与目标

**首要目标:作品集 / 表达。** 展示审美与动效手感,受众是设计/创意岗位、独立开发者与社交媒体。成功标准:

1. 一个**线上可直接访问**的 demo(GitHub Pages),丢一个链接就能让人"哇"出来;
2. 三语 README(英/中/日)配 GIF 截图,在 GitHub 上呈现完整;
3. 视觉与手感打磨到可截图传播的水准。

**非目标(本期明确不做)**:npm 发布、React 组件包、语义化版本管理、社区运营。这些保留在 ROADMAP 的远期,但不为它们投入任何本期工作量。`demo` 保持零依赖纯 HTML/CSS/JS——这是项目自己立下的原则,本期不破。

## 2. 美学方向:Pokopia 气质 × 原创资产

### 2.1 基底不动

原版 demo 的贴纸语言(高饱和糖果色、厚白描边、双层投影、微旋转、弹簧动效)**就是正确答案**,经与 Pokémon Pokopia 官方主视觉对照确认:其品牌语言同样是高饱和天空蓝 + 白色卡通云 + 厚白描边贴纸 + 彩虹糖果字。基底层一行不改。

**记录两次失败教训作为设计原则**(防止未来重蹈):

- 扁平 UI 里**饱和度即生命力**。"哑光自然色"是 3D 渲染游戏靠光照撑起来的,平面上照搬等于褪色。
- **blur 需要精细的景**。移轴摄影的美在于"被虚化的微缩细节";没有细节的色块加 blur 只是没对焦。世界感用"纸艺剪贴"的清晰层叠表达,不用模糊。

### 2.2 三个新增母题(已验证)

| 母题 | 来源 | 实现 |
|------|------|------|
| 格纹草皮 blob | 官方 logo 背后的格纹绿贴布 | `repeating-conic-gradient` 双色黄绿格纹(`#CDE56E`/`#BFDB59`),有机圆角(不规则 `border-radius`),6px 白描边,置于 hero 标题之后 |
| 瓦片草皮地面 | 游戏"铺地块"玩法的拼布质感 | 页底固定双色绿格瓦片带(`#8FD178`/`#7EC367`,52px 格),白色接缝压在小山前 |
| 探头团子精 | 原创吉祥物 | 纯 CSS 奶油色团子(腮红/嘴/发芽),从 blob 右肩探出,3.2s 呼吸浮动 |

### 2.3 IP 红线(重申)

借**气质**(配色逻辑、微缩世界观、收集养成叙事),不借**资产**(角色、精灵球、官方 logo/字体)。所有图形、吉祥物、文案均为原创。`CONTRIBUTING.md` 既有条款继续有效。参照先例:`animal-island-ui`(动森灵感、全原创资产、挂免责声明)。

## 3. 图标系统 Mochi Icons

### 3.1 规则

**页面 UI 内零 emoji。** 理由:跨平台渲染不一致(macOS/Windows/Android 字形完全不同)+ 占位符廉价感。README 等文档中的装饰性 emoji 不受限。

### 3.2 架构

- 页面顶部内联一个 `<svg style="display:none">` sprite,内含全部 `<symbol>`;
- 使用处 `<svg class="mi"><use href="#mi-名称"/></svg>`;
- 颜色经 `currentColor` 继承上下文文字色,特定场景用 CSS 覆盖(见原型 `.badge.green .mi` 等规则);
- 动态组件 API 传图标名:`toast('ok','star',msg)`,不传字符。

### 3.3 设计语言

- 24×24 网格;实心墩形轮廓(solid silhouette)+ 圆头线条;
- **小尺寸单坨原则**:≤20px 的图标必须是一整块实心形,多零件结构(如双叶发芽)在小字号下会碎(已验证失败一次);
- 内部细节用半透明白(`rgba(255,255,255,.5~.85)`)分层,不引入第二实色;
- 卡片插画级(58px)允许双色(如蘑菇:彩色菌盖 + 奶油菌柄 + 描边)。

### 3.4 现有清单(19 个)

leaf · drop · zap · berry · moon · check · wrench · heart · star · bug · package · backpack · book · map · mushroom · bubbles · speaker · tent · face · flower(CSS data-URI 版,用于进度条顶端)

### 3.5 已知限制

原生 `<option>` 不能包含 SVG,下拉选项为纯文字。这是浏览器限制,接受之。

## 4. 国际化(中 / EN / 日)

### 4.1 机制(零依赖,已验证)

- 词典:JS 对象 `I18N = { key: [zh, en, ja] }`,约 80 键,与页面同文件;
- 四种标记:`data-i18n`(textContent)、`data-i18n-html`(含 `<br>` 的富文本)、`data-i18n-ph`(placeholder)、`data-i18n-aria`(aria-label);
- 动态字符串经 `T(key)` 取值(toast 消息等);
- 右上角固定贴纸风切换钮(中 / EN / 日),`aria-pressed` 标记当前项;
- 选择持久化到 `localStorage('mochi-lang')`,首访按 `navigator.language` 自动检测;
- 切换时同步 `<html lang>`(zh-CN / en / ja)——影响汉字字形渲染(中日共用字按 lang 选字体),不是装饰。

### 4.2 文案语感标准

翻译不是直译,是**同一个治愈世界观的三种母语表达**:

- 中:现有文案(咕、圆滚滚、摸鱼中);
- EN:cozy 游戏腔——生物名造词(Roundshroom / Bubblet / Snoozefluff),口语化("Tent's up! Good night~");
- 日:ほのぼの腔——假名为主(きのみあつめ、ひなたぼっこ、まるまるダケ),收东西用「もらう」(治愈系游戏惯例)。

### 4.3 CJK 排版规则(组件级,进正式 CSS)

- CJK 任意字符间可折行 ⇒ **胶囊类组件**(`.btn` `.badge` `.tab-btn` `.section-tag`)一律 `white-space: nowrap`,空间不足时整个组件换行,绝不词中断行;
- 容器按**最长语言**定尺寸:卡片宽 270px(以日文为基准实测);
- 日语是布局压力测试:任何新组件须在三语下各看一遍。

### 4.4 README 三份

- `README.md` = **英文**(GitHub 默认入口,国际可见性优先);
- `README.zh-CN.md` = 现有中文内容迁移;
- `README.ja.md` = 日文;
- 三份顶部互挂语言切换链接(`English | 简体中文 | 日本語`)。

## 5. 工具链:Bun

**角色边界:Bun 只服务开发与构建,产物零依赖。** 使用者 `<link>` 一个 CSS 即可,无需安装任何东西。

- `bun run dev`:本地静态服务 demo(替代 python http.server);
- `bun run build`:从 demo 源拆分产出 `dist/mochi.css`(样式)+ `dist/mochi.js`(可选交互:tabs/dialog/toast/i18n 工具)+ `dist/icons.svg`(sprite 独立文件),并做 minify;
- `package.json` 仅含 scripts 与元信息,`devDependencies` 尽量为空(Bun 内置 bundler/minifier);
- GitHub Actions 用 `oven-sh/setup-bun` 跑构建,产物部署 GitHub Pages;
- 这同时把 ROADMAP v0.2 的"拆分 mochi.css / mochi.js"做掉。

## 6. 目标文件结构

```
mochi-ui/
├── demo/
│   └── index.html        # 融合 .proto 全部验证内容(母题/图标/三语)
├── src/                  # 拆分后的库源文件(build 输入)
│   ├── mochi.css
│   ├── mochi.js
│   └── icons.svg
├── dist/                 # bun run build 产物(gitignore,CI 生成;仅供外部使用者,demo 不依赖)
├── docs/
│   ├── design-tokens.md  # 增补:三母题、图标规范、CJK 规则
│   ├── components.md     # 增补:图标 API、i18n 标记
│   └── superpowers/specs/
├── README.md             # EN
├── README.zh-CN.md
├── README.ja.md
├── CONTRIBUTING.md       # 增补:零 emoji 条款、三语文案要求
├── ROADMAP.md            # 更新:标记本期完成项
├── LICENSE               # MIT(不变)
├── package.json          # bun scripts
└── .github/workflows/pages.yml
```

`.proto/` 在内容融合进 `demo/` 后删除。

## 7. 无障碍(底线保持 + 新增项)

既有底线全部保留(focus-visible 焦点环、原生 input 打底、`prefers-reduced-motion`、dialog/toast aria)。新增:

- 语言切换钮:`role="group"` + 每钮 `aria-pressed`;
- 装饰性场景元素(blob/瓦片/吉祥物/sprite)一律 `aria-hidden="true"`;
- 图标默认 `aria-hidden="true"`(文字在旁);独立成义的图标须配 `aria-label`。

## 8. 验证标准(实施完成的定义)

1. Chrome / Safari / Firefox 三浏览器目检;
2. 移动端 ≤640px 不破版(含语言切换钮不遮挡内容);
3. 键盘 Tab 全程可走,焦点环可见;`prefers-reduced-motion` 下动画归零;
4. 三语各完整滚一遍:无词中折行、无溢出、无未翻译键(`T()` 回退为 key 名即视为 bug);
5. emoji 扫描脚本(正则全文)返回 0 命中;
6. GitHub Pages 线上地址可访问,README 三份互链有效、GIF 正常显示;
7. `bun run build` 产物在独立空白 HTML 中 `<link>`/`<script>` 引入即可复现按钮/徽章样式。

## 9. 实施阶段(供 writing-plans 细化)

- **A 仓库化**:GitHub 远程、分支保护不设(个人项目)、Pages 开启;
- **B 融合**:`.proto` 验证内容(母题层、图标 sprite、i18n)合入 `demo/index.html`,删除 `.proto`;
- **C 拆分 + Bun**:`demo` 内联样式/脚本拆为 `src/`,demo 改为直接引用 `src/`(未压缩源文件,clone 后浏览器直开仍可用,零构建);`bun run build` 产 `dist/` 仅供外部使用者引入;
- **D 文档 + 上线**:三语 README(含 GIF 录制)、docs 增补、Actions 部署 Pages。

各阶段独立可验收,顺序执行;B 完成后即可先行上线一版(D 的 Pages 部分可提前到 B 后做最小上线)。

## 10. 风险与对策

| 风险 | 对策 |
|------|------|
| 拆分时改坏已验证的视觉 | B、C 分阶段;C 完成后与 B 的截图逐屏比对 |
| GIF 体积过大拖慢 README | 每张 ≤3MB,优先 webp/mp4 降级 gif |
| 任天堂 IP 边界误判 | 全原创资产 + README 挂免责声明(同 animal-island-ui 措辞) |
| 三语文案后续维护成本 | 词典集中单处;CONTRIBUTING 规定新增文案须三语齐全 |

## 11. 已拍板的决策记录

1. 作品集定位,不做 npm/React(用户,2026-06-12);
2. Pokopia 气质 = 贴纸基底 + 三母题,否决哑光化/模糊化方向(用户两次否决后经官方画面对照确认);
3. 页面零 emoji,Mochi Icons 替代(用户);
4. 三语支持,日文假名腔/英文 cozy 腔(用户);
5. Bun 作为工具链,产物保持零依赖(用户提出 Bun,边界由本 spec 定义);
6. 泡泡图标保持原色 `--sky-deep`;卡片徽章+按钮同行,卡片 270px(用户);
7. README 默认语言 = 英文(本 spec 提议,**待用户确认**——若你希望中文作为 `README.md` 默认入口,改回即可,结构不受影响)。
