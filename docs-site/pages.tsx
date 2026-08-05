import type * as React from 'react';
import type { IconName } from '../src/react';
import {
  AvatarDemo,
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  CloudSignDemo,
  DialogDemo,
  FormDemo,
  IconDemo,
  PhotoDemo,
  PlankDemo,
  ProgressDemo,
  SelectionDemo,
  SignpostDemo,
  SliderDemo,
  SwitchDemo,
  TabsDemo,
  ToastDemo,
  TooltipDemo,
  ToTopDemo,
  WobbleBubbleDemo,
  type DemoProps,
} from './demos';
import type { Localized } from './i18n';

export type PageGroup = 'foundations' | 'forms' | 'feedback' | 'motifs';

export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: Localized;
}

export interface PageDefinition {
  id: string;
  group: PageGroup;
  icon: IconName;
  title: Localized;
  componentNames: string[];
  description: Localized;
  code: string;
  props: PropRow[];
  accessibility: Localized;
  Demo: React.ComponentType<DemoProps>;
}

const l = (zh: string, en: string, ja: string): Localized => ({ zh, en, ja });
const p = (
  name: string,
  type: string,
  defaultValue: string,
  zh: string,
  en: string,
  ja: string,
): PropRow => ({ name, type, defaultValue, description: l(zh, en, ja) });

export const pages: PageDefinition[] = [
  {
    id: 'button',
    group: 'foundations',
    icon: 'leaf',
    title: l('按钮', 'Button', 'ボタン'),
    componentNames: ['Button', 'burst'],
    description: l(
      '带物理厚度的主要操作按钮。颜色、尺寸、幽灵样式与点击粒子都来自同一套视觉语言。',
      'A primary action with physical depth. Colours, sizes, ghost styling, and click particles share one visual language.',
      'しっかりした厚みのある主要アクション。色、サイズ、ゴースト表示、クリック時の粒子まで、ひとつのデザインルールで整えています。',
    ),
    code: `import { Button, Icon } from 'pokoland-ui';

<Button color="sky" burst="splash" className="icon-btn">
  <Icon name="drop" />
  Jump in
</Button>`,
    props: [
      p('color', `'meadow' | 'sky' | 'butter' | 'coral' | 'lilac'`, `'meadow'`, '设置按钮的语义色与按压阴影。', 'Sets the semantic colour and pressed shadow.', '色と押し込み時の影を設定します。'),
      p('size', `'md' | 'sm'`, `'md'`, '切换标准或紧凑尺寸。', 'Chooses the standard or compact size.', '標準またはコンパクトサイズを選びます。'),
      p('ghost', 'boolean', 'false', '使用奶油色次级按钮样式。', 'Uses the cream secondary-action style.', 'クリーム色の副次アクション表示にします。'),
      p('burst', `'leaf' | 'splash'`, '—', '点击时生成草叶或水花粒子。', 'Creates leaf or splash particles on click.', 'クリック時に葉っぱ、または水しぶきの粒子を表示します。'),
      p('...button props', `ComponentPropsWithoutRef<'button'>`, '—', '透传原生按钮属性与 ref。', 'Forwards native button attributes and ref.', 'ボタンのネイティブ属性と ref を渡せます。'),
    ],
    accessibility: l(
      '组件保留原生 button 语义、键盘操作和禁用行为，并提供高对比度 focus-visible 轮廓。只含图标时请提供 aria-label。',
      'Native button semantics, keyboard activation, and disabled behaviour are preserved, with a high-contrast focus-visible ring. Add aria-label to icon-only buttons.',
      'ネイティブ button の意味、キーボード操作、無効状態を保ち、高コントラストの focus-visible を表示します。アイコンだけの場合は aria-label を付けてください。',
    ),
    Demo: ButtonDemo,
  },
  {
    id: 'badge',
    group: 'foundations',
    icon: 'star',
    title: l('徽标', 'Badge', 'バッジ'),
    componentNames: ['Badge'],
    description: l('用于状态、分类和短标签的轻量贴纸胶囊。', 'A lightweight sticker pill for status, categories, and short labels.', '状態、分類、短いラベルに使える軽やかなステッカーピルです。'),
    code: `<Badge color="butter">
  <Icon name="star" /> Favourite
</Badge>`,
    props: [
      p('color', `'meadow' | 'sky' | 'butter' | 'coral' | 'lilac'`, `'meadow'`, '选择柔和背景色。', 'Chooses the soft background colour.', 'やわらかな背景色を選びます。'),
      p('...span props', `ComponentPropsWithoutRef<'span'>`, '—', '透传 span 属性与 ref。', 'Forwards span attributes and ref.', 'span の属性と ref を渡せます。'),
    ],
    accessibility: l('不要只靠颜色表达状态；徽标文字应能独立说明含义。', 'Do not communicate status by colour alone; the badge text should stand on its own.', '色だけで状態を伝えず、文字だけでも意味が分かるようにしてください。'),
    Demo: BadgeDemo,
  },
  {
    id: 'form',
    group: 'forms',
    icon: 'book',
    title: l('表单字段', 'Form fields', 'フォーム項目'),
    componentNames: ['Field', 'Input', 'Select', 'Textarea'],
    description: l('圆润、清晰的文本输入组合。Field 负责可见标签，其余组件保留完整原生行为。', 'Rounded, legible text-entry controls. Field provides the visible label while each control keeps its native behaviour.', '丸みがあり読みやすい入力部品です。Field が見えるラベルを担い、各コントロールはネイティブの挙動を保ちます。'),
    code: `<Field label="Island name" htmlFor="island-name">
  <Input id="island-name" placeholder="Dewdrop" />
</Field>

<Field label="Weather" htmlFor="weather">
  <Select id="weather" defaultValue="sunny">
    <option value="sunny">Sunny</option>
  </Select>
</Field>`,
    props: [
      p('Field.label', 'ReactNode', 'required', '显示在控件上方的持久标签。', 'Persistent label shown above the control.', 'コントロール上部に表示する常設ラベルです。'),
      p('Field.htmlFor', 'string', '—', '把标签与控件 id 关联。', 'Associates the label with the control id.', 'ラベルとコントロールの id を関連付けます。'),
      p('Input props', `ComponentPropsWithoutRef<'input'>`, '—', '透传全部原生 input 属性。', 'Forwards every native input attribute.', 'input の全ネイティブ属性を渡せます。'),
      p('Select props', `ComponentPropsWithoutRef<'select'>`, '—', '透传全部原生 select 属性。', 'Forwards every native select attribute.', 'select の全ネイティブ属性を渡せます。'),
      p('Textarea props', `ComponentPropsWithoutRef<'textarea'>`, '—', '透传全部原生 textarea 属性。', 'Forwards every native textarea attribute.', 'textarea の全ネイティブ属性を渡せます。'),
    ],
    accessibility: l('始终提供可见标签，并确保 htmlFor 与控件 id 一致。错误提示应放在字段下方并通过 aria-describedby 关联。', 'Always provide a visible label and match htmlFor to the control id. Place errors below the field and connect them with aria-describedby.', '必ず見えるラベルを用意し、htmlFor とコントロールの id を一致させます。エラーは項目の下に置き、aria-describedby で関連付けてください。'),
    Demo: FormDemo,
  },
  {
    id: 'switch',
    group: 'forms',
    icon: 'zap',
    title: l('开关', 'Switch', 'スイッチ'),
    componentNames: ['Switch'],
    description: l('适合立即生效设置的弹簧式二元开关，支持受控与非受控模式。', 'A springy binary control for settings that take effect immediately, in controlled or uncontrolled mode.', 'すぐ反映される設定に向いた、ばね感のある二値スイッチです。制御・非制御の両方に対応します。'),
    code: `const [sound, setSound] = useState(true);

<Switch
  checked={sound}
  onCheckedChange={setSound}
  aria-label="Toggle leaf sound"
/>`,
    props: [
      p('checked', 'boolean', '—', '受控状态。', 'Controlled checked state.', '制御された選択状態です。'),
      p('defaultChecked', 'boolean', 'false', '非受控初始状态。', 'Initial uncontrolled state.', '非制御時の初期状態です。'),
      p('onCheckedChange', '(checked: boolean) => void', '—', '状态变化时回调。', 'Called when the state changes.', '状態が変わったときに呼ばれます。'),
      p('disabled', 'boolean', 'false', '禁用原生复选框。', 'Disables the underlying checkbox.', '内部のチェックボックスを無効にします。'),
    ],
    accessibility: l('底层使用原生 checkbox。请通过附近的可见文字和 aria-label 清楚说明它控制的设置。', 'The underlying control is a native checkbox. Use nearby visible text and aria-label to name the setting clearly.', '内部はネイティブ checkbox です。近くの見える文字と aria-label で、何を切り替えるか明確にしてください。'),
    Demo: SwitchDemo,
  },
  {
    id: 'selection',
    group: 'forms',
    icon: 'check',
    title: l('复选与单选', 'Checkbox & radio', 'チェックとラジオ'),
    componentNames: ['Checkbox', 'Radio'],
    description: l('用原生输入元素打底的果实式选择控件，点击文字也能切换。', 'Fruit-like selection controls built on native inputs, with the whole label available as a target.', 'ネイティブ入力を土台にした、実のような選択部品です。文字部分を押しても切り替えられます。'),
    code: `<Checkbox defaultChecked>Pack the blanket</Checkbox>

<Radio name="trail" value="meadow" defaultChecked>
  Meadow trail
</Radio>`,
    props: [
      p('checked', 'boolean', '—', '受控选中状态。', 'Controlled selected state.', '制御された選択状態です。'),
      p('defaultChecked', 'boolean', 'false', '非受控初始状态。', 'Initial uncontrolled state.', '非制御時の初期状態です。'),
      p('onCheckedChange', '(checked: boolean) => void', '—', '选择变化时回调。', 'Called when selection changes.', '選択が変わったときに呼ばれます。'),
      p('Radio.name', 'string', '—', '把多个 Radio 组成互斥组。', 'Groups Radio controls into one exclusive set.', '複数の Radio をひとつの排他的なグループにします。'),
      p('Radio.value', 'string | number | readonly string[]', '—', '表单提交值。', 'Value used for form submission.', 'フォーム送信時の値です。'),
    ],
    accessibility: l('原生 checkbox 与 radio 可用空格键操作，并显示 focus-visible 轮廓。单选项应共享 name，并放在带有组标题的 fieldset 中。', 'Native checkbox and radio inputs support Space and show a focus-visible ring. Radios should share a name and sit in a fieldset with a legend.', 'ネイティブ checkbox と radio は Space で操作でき、focus-visible を表示します。ラジオは同じ name を使い、legend 付き fieldset にまとめてください。'),
    Demo: SelectionDemo,
  },
  {
    id: 'progress',
    group: 'forms',
    icon: 'flower',
    title: l('进度', 'Progress', 'プログレス'),
    componentNames: ['Progress'],
    description: l('会沿轨道生长的进度指示，可在草叶与向日葵两种主题之间切换。', 'A progress indicator that grows along its track, with vine and sunny treatments.', '道に沿って育つ進捗表示です。葉っぱとひまわりの二つの見た目を選べます。'),
    code: `<Progress value={72} label="Garden progress" />
<Progress value={46} variant="sunny" label="Sunny energy" />`,
    props: [
      p('value', 'number', 'required', '百分比数值，会自动限制在 0–100。', 'Percentage value, clamped automatically to 0–100.', 'パーセント値。自動的に 0〜100 に収まります。'),
      p('label', 'ReactNode', '—', '显示在进度轨道上方的说明。', 'Label shown above the track.', '進捗バーの上に表示する説明です。'),
      p('variant', `'vine' | 'sunny'`, `'vine'`, '选择草叶或向日葵填充。', 'Chooses vine or sunny fill.', '葉っぱ、またはひまわりの表示を選びます。'),
    ],
    accessibility: l('填充元素使用 role="progressbar"，并提供 aria-valuenow、aria-valuemin 与 aria-valuemax。标签应说明正在推进的任务。', 'The fill uses role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax. The label should identify the task in progress.', '塗り部分は role="progressbar" と aria-valuenow、aria-valuemin、aria-valuemax を持ちます。ラベルで何の進捗か示してください。'),
    Demo: ProgressDemo,
  },
  {
    id: 'slider',
    group: 'forms',
    icon: 'speaker',
    title: l('滑块', 'Slider', 'スライダー'),
    componentNames: ['Slider'],
    description: l('基于原生 range 的触感滑块，适合音量、强度和连续数值。', 'A tactile native range control for volume, intensity, and continuous values.', 'ネイティブ range を使った手触りのあるスライダー。音量、強さ、連続値に向いています。'),
    code: `const [volume, setVolume] = useState(64);

<Slider
  value={volume}
  onValueChange={setVolume}
  aria-label="Ambient volume"
/>`,
    props: [
      p('value', 'number', '—', '受控数值。', 'Controlled value.', '制御された値です。'),
      p('defaultValue', 'number', 'min', '非受控初始数值。', 'Initial uncontrolled value.', '非制御時の初期値です。'),
      p('onValueChange', '(value: number) => void', '—', '数值变化时回调。', 'Called when the value changes.', '値が変わったときに呼ばれます。'),
      p('min / max / step', 'number', '0 / 100 / 1', '设置原生 range 边界与步长。', 'Sets native range bounds and step.', 'ネイティブ range の範囲と刻み幅を設定します。'),
    ],
    accessibility: l('底层是原生 range，可使用方向键调整。没有可见标签时必须提供 aria-label。', 'The underlying native range works with arrow keys. Provide aria-label when no visible label is present.', '内部はネイティブ range で、矢印キーで調整できます。見えるラベルがない場合は aria-label が必要です。'),
    Demo: SliderDemo,
  },
  {
    id: 'card',
    group: 'foundations',
    icon: 'mushroom',
    title: l('图鉴卡片', 'Field card', '図鑑カード'),
    componentNames: ['Card', 'Card.Art', 'Card.Body', 'Card.Row'],
    description: l('为收藏物、角色或地点准备的复合卡片，图片区、正文区与底部行可自由组合。', 'A compound card for collectibles, characters, or places, with composable art, body, and footer rows.', 'コレクション、キャラクター、場所に使える複合カード。絵、本文、下部行を自由に組み合わせられます。'),
    code: `<Card>
  <Card.Art variant="grass"><Icon name="mushroom" /></Card.Art>
  <Card.Body>
    <h3>Dewdrop mushroom</h3>
    <p>Appears after rain.</p>
    <Card.Row><Badge>Common</Badge></Card.Row>
  </Card.Body>
</Card>`,
    props: [
      p('Card props', `ComponentPropsWithoutRef<'div'>`, '—', '根容器透传 div 属性与 ref。', 'Root forwards div attributes and ref.', 'ルートに div の属性と ref を渡せます。'),
      p('Card.Art.variant', `'grass' | 'sky' | 'dusk'`, `'grass'`, '选择插画区背景。', 'Chooses the art-area background.', '絵のエリアの背景を選びます。'),
      p('Card.Body', `ComponentPropsWithoutRef<'div'>`, '—', '承载标题、说明与其他正文。', 'Holds headings, descriptions, and supporting content.', '見出し、説明などの本文を収めます。'),
      p('Card.Row', `ComponentPropsWithoutRef<'div'>`, '—', '对齐卡片底部的元数据或操作。', 'Aligns metadata or actions at the bottom.', 'カード下部のメタ情報や操作を整列します。'),
    ],
    accessibility: l('Card 本身没有交互语义。若整张卡可点击，请放置语义明确的链接，不要只依赖悬停抬升效果。插画需要按信息价值决定 alt 或 aria-hidden。', 'Card is non-interactive by default. If the whole card navigates, use a clearly named link rather than relying on hover lift. Give meaningful art alternative text or mark decoration aria-hidden.', 'Card 自体は非インタラクティブです。カード全体をリンクにする場合は、ホバーの動きだけに頼らず明確な名前を付けます。絵には適切な代替テキスト、または aria-hidden を使ってください。'),
    Demo: CardDemo,
  },
  {
    id: 'avatar',
    group: 'foundations',
    icon: 'face',
    title: l('头像', 'Avatar', 'アバター'),
    componentNames: ['Avatar'],
    description: l('自带团子脸的圆形头像，也可以传入任意自定义内容。', 'A circular avatar with a dumpling face by default and support for custom content.', 'おだんご顔が初期表示の丸いアバター。好きな内容に差し替えることもできます。'),
    code: `<Avatar color="meadow" aria-label="Mori" />
<Avatar color="sky" aria-label="Flower friend">
  <Icon name="flower" />
</Avatar>`,
    props: [
      p('color', `'meadow' | 'sky' | 'butter' | 'coral'`, `'meadow'`, '选择头像底色。', 'Chooses the avatar background.', 'アバターの背景色を選びます。'),
      p('children', 'ReactNode', '<Icon name="face" />', '覆盖默认团子脸。', 'Replaces the default dumpling face.', '初期のおだんご顔を差し替えます。'),
      p('...span props', `ComponentPropsWithoutRef<'span'>`, '—', '透传 span 属性与 ref。', 'Forwards span attributes and ref.', 'span の属性と ref を渡せます。'),
    ],
    accessibility: l('头像表达身份时，请提供 aria-label 或配套可见姓名。纯装饰头像可设置 aria-hidden。', 'When the avatar identifies someone, provide aria-label or an adjacent visible name. Decorative avatars can use aria-hidden.', '人物を表す場合は aria-label、または近くに見える名前を用意します。装飾だけなら aria-hidden を使えます。'),
    Demo: AvatarDemo,
  },
  {
    id: 'tooltip',
    group: 'feedback',
    icon: 'bubbles',
    title: l('工具提示', 'Tooltip', 'ツールチップ'),
    componentNames: ['Tooltip'],
    description: l('在悬停或键盘聚焦时显示的纯 CSS 短提示。', 'A short, CSS-only hint shown on hover or keyboard focus.', 'ホバーまたはキーボードフォーカスで表示する、CSS だけの短いヒントです。'),
    code: `<Tooltip content="Take it gently today">
  <Badge color="butter">Hover or focus</Badge>
</Tooltip>`,
    props: [
      p('content', 'ReactNode', 'required', '提示气泡内容。', 'Content inside the hint bubble.', 'ヒントの吹き出しに表示する内容です。'),
      p('children', 'ReactNode', 'required', '触发提示的内容。', 'Content that triggers the tooltip.', 'ツールチップを表示するきっかけとなる内容です。'),
      p('...span props', `Omit<ComponentPropsWithoutRef<'span'>, 'content'>`, '—', '透传包装 span 属性与 ref。', 'Forwards wrapper span attributes and ref.', 'ラッパー span の属性と ref を渡せます。'),
    ],
    accessibility: l('包装元素可通过 Tab 聚焦，因此触摸以外的键盘用户也能看到提示。不要把完成任务所需的关键信息只放在 Tooltip 中。', 'The wrapper is tabbable, so keyboard users can reveal the hint. Never place task-critical information only inside a tooltip.', 'ラッパーは Tab でフォーカスでき、キーボードでも表示できます。操作に不可欠な情報を Tooltip だけに入れないでください。'),
    Demo: TooltipDemo,
  },
  {
    id: 'tabs',
    group: 'feedback',
    icon: 'map',
    title: l('标签页', 'Tabs', 'タブ'),
    componentNames: ['Tabs', 'Tabs.List', 'Tabs.Tab', 'Tabs.Panel'],
    description: l('像一排小路牌的内容切换器，支持受控与非受控选择。', 'A content switcher shaped like a row of small signposts, in controlled or uncontrolled mode.', '小さな道しるべが並ぶような内容切り替え。制御・非制御の両方に対応します。'),
    code: `<Tabs defaultValue="garden">
  <Tabs.List aria-label="Island areas">
    <Tabs.Tab value="garden">Garden</Tabs.Tab>
    <Tabs.Tab value="river">River</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="garden">Garden notes</Tabs.Panel>
  <Tabs.Panel value="river">Riverside notes</Tabs.Panel>
</Tabs>`,
    props: [
      p('value', 'string', '—', '受控激活值。', 'Controlled active value.', '制御された選択値です。'),
      p('defaultValue', 'string', `''`, '非受控初始值。', 'Initial uncontrolled value.', '非制御時の初期値です。'),
      p('onValueChange', '(value: string) => void', '—', '标签切换时回调。', 'Called when the selected tab changes.', '選択タブが変わったときに呼ばれます。'),
      p('Tabs.Tab.value', 'string', 'required', '把标签与同值面板关联。', 'Associates a tab with the panel of the same value.', '同じ value のパネルとタブを関連付けます。'),
      p('Tabs.Panel.value', 'string', 'required', '决定面板何时显示。', 'Controls when the panel is visible.', 'パネルを表示する条件です。'),
    ],
    accessibility: l('组件提供 tablist、tab、tabpanel 与 aria-selected。当前版本不实现方向键巡游；需要严格遵循 WAI-ARIA Tabs 键盘模式的产品应在封装层补充。', 'The component provides tablist, tab, tabpanel, and aria-selected. Arrow-key roving is not included in this version; products requiring the full WAI-ARIA Tabs keyboard pattern should add it in a wrapper.', 'tablist、tab、tabpanel、aria-selected を提供します。現バージョンは矢印キー移動を含まないため、WAI-ARIA Tabs の完全なキーボード操作が必要な場合はラッパーで補ってください。'),
    Demo: TabsDemo,
  },
  {
    id: 'dialog',
    group: 'feedback',
    icon: 'heart',
    title: l('对话框', 'Dialog', 'ダイアログ'),
    componentNames: ['Dialog'],
    description: l('通过 portal 渲染的受控模态层，支持 Escape 与点击遮罩关闭。', 'A controlled modal layer rendered through a portal, with Escape and backdrop dismissal.', 'portal で描画する制御型モーダル。Escape と背景クリックで閉じられます。'),
    code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open invitation</Button>
<Dialog open={open} onOpenChange={setOpen}>
  <h3>Join the picnic?</h3>
  <Button onClick={() => setOpen(false)}>Join in</Button>
</Dialog>`,
    props: [
      p('open', 'boolean', 'required', '控制对话框是否显示。', 'Controls whether the dialog is shown.', 'ダイアログの表示状態を制御します。'),
      p('onOpenChange', '(open: boolean) => void', '—', '用户请求关闭时回调。', 'Called when the user requests dismissal.', 'ユーザーが閉じようとしたときに呼ばれます。'),
      p('children', 'ReactNode', '—', '模态内容。', 'Modal content.', 'モーダルの内容です。'),
      p('className', 'string', '—', '追加到 dialog 内容容器。', 'Added to the dialog content container.', 'ダイアログ内容のコンテナに追加します。'),
    ],
    accessibility: l('提供 role="dialog" 与 aria-modal，并支持 Escape。v0.3.0 尚未内置初始聚焦、焦点圈定与关闭后的焦点恢复；生产环境应在封装层补充这些行为，并为标题设置可感知名称。', 'role="dialog", aria-modal, and Escape dismissal are included. v0.3.0 does not yet include initial focus, focus trapping, or focus restoration; production wrappers should add them and give the dialog an accessible name.', 'role="dialog"、aria-modal、Escape で閉じる操作を含みます。v0.3.0 は初期フォーカス、フォーカストラップ、終了後のフォーカス復元をまだ内蔵していません。実運用ではラッパーで補い、ダイアログにアクセシブルな名前を付けてください。'),
    Demo: DialogDemo,
  },
  {
    id: 'toast',
    group: 'feedback',
    icon: 'check',
    title: l('通知', 'Toast', 'トースト'),
    componentNames: ['Toaster', 'toast.ok', 'toast.warn'],
    description: l('通过全局命令式 API 推送的短暂反馈，一次只需挂载一个 Toaster。', 'Brief feedback sent through a global imperative API; mount one Toaster for the app.', 'グローバルな命令型 API で送る短い通知。アプリには Toaster をひとつだけ配置します。'),
    code: `<Toaster />

<Button onClick={() => toast.ok('check', 'Garden notes saved')}>
  Save notes
</Button>`,
    props: [
      p('toast.ok', '(icon: IconName, message: string) => void', '—', '推送成功通知。', 'Pushes a success message.', '成功通知を表示します。'),
      p('toast.warn', '(icon: IconName, message: string) => void', '—', '推送提醒通知。', 'Pushes a warning or reminder.', '注意、またはお知らせを表示します。'),
      p('Toaster props', `ComponentPropsWithoutRef<'div'>`, '—', '透传通知区域的 div 属性。', 'Forwards attributes to the toast region.', '通知領域の div 属性を渡せます。'),
    ],
    accessibility: l('通知区使用 aria-live="polite"，不会粗暴打断读屏。每个应用只挂载一个 Toaster；重要错误不应只依赖会自动消失的通知。', 'The region uses aria-live="polite" to avoid abrupt interruption. Mount only one Toaster, and never rely on an auto-dismissing toast as the sole presentation of a critical error.', '領域は aria-live="polite" を使い、読み上げを急に遮りません。Toaster はアプリにひとつだけ配置し、重大なエラーを自動で消える通知だけで伝えないでください。'),
    Demo: ToastDemo,
  },
  {
    id: 'icon',
    group: 'foundations',
    icon: 'tile-flower',
    title: l('图标', 'Icon', 'アイコン'),
    componentNames: ['Icon', 'IconSprite', 'ICON_NAMES'],
    description: l('二十五枚原创 SVG 图标，通过单个内联 sprite 保持轻量与主题色继承。', 'Twenty-five original SVG icons served from one inline sprite, inheriting colour while staying light.', '二十五種類のオリジナル SVG アイコン。ひとつのインライン sprite から呼び出し、色を継承しながら軽量に保ちます。'),
    code: `<IconSprite />

<Icon name="leaf" />
<Icon name="flower" size={28} aria-label="Flower" />`,
    props: [
      p('name', 'IconName', 'required', '从 ICON_NAMES 联合类型中选择图标。', 'Selects an icon from the ICON_NAMES union.', 'ICON_NAMES のユニオン型からアイコンを選びます。'),
      p('size', 'number', '—', '同时设置 SVG 宽高。', 'Sets SVG width and height together.', 'SVG の幅と高さを同時に設定します。'),
      p('IconSprite', 'component', 'once per document', '在文档根部挂载一次 sprite。', 'Mounts the sprite once near the document root.', '文書ルート付近に sprite を一度だけ配置します。'),
      p('...svg props', `ComponentPropsWithoutRef<'svg'>`, '—', '透传 SVG 属性与 ref。', 'Forwards SVG attributes and ref.', 'SVG の属性と ref を渡せます。'),
    ],
    accessibility: l('没有 aria-label 时 Icon 自动设置 aria-hidden。承载独立含义的图标应提供 aria-label；与文字重复的图标应保持装饰性。', 'Icon sets aria-hidden automatically unless aria-label is provided. Give standalone meaningful icons an aria-label; leave icons that repeat visible text decorative.', 'aria-label がなければ Icon は自動で aria-hidden になります。単独で意味を持つアイコンには aria-label を付け、見える文字と重複する場合は装飾のままにします。'),
    Demo: IconDemo,
  },
  {
    id: 'signpost',
    group: 'feedback',
    icon: 'map',
    title: l('路牌导航', 'Signpost navigation', '道しるべナビ'),
    componentNames: ['Signpost', 'NavLink'],
    description: l('木制路牌式导航容器与带当前页状态的链接。', 'A wooden signpost navigation container with links that expose the current page.', '木の道しるべを模したナビゲーションと、現在位置を示せるリンクです。'),
    code: `<Signpost aria-label="Island areas">
  <NavLink href="/garden" active>Garden</NavLink>
  <NavLink href="/river">River</NavLink>
</Signpost>`,
    props: [
      p('Signpost props', `ComponentPropsWithoutRef<'nav'>`, '—', '透传 nav 属性与 ref。', 'Forwards nav attributes and ref.', 'nav の属性と ref を渡せます。'),
      p('NavLink.active', 'boolean', 'false', '添加当前页样式与 aria-current="page"。', 'Adds current-page styling and aria-current="page".', '現在ページの表示と aria-current="page" を追加します。'),
      p('NavLink props', `ComponentPropsWithoutRef<'a'>`, '—', '透传链接属性与 ref。', 'Forwards anchor attributes and ref.', 'リンクの属性と ref を渡せます。'),
    ],
    accessibility: l('每个 Signpost 都应提供能区分用途的 aria-label。只有当前页面链接设置 active；链接文字应脱离上下文也能理解。', 'Give each Signpost a distinguishing aria-label. Set active only on the current-page link, and keep link text meaningful out of context.', '各 Signpost に用途を区別できる aria-label を付けます。active は現在ページだけに設定し、リンク文字は単独でも意味が分かるようにしてください。'),
    Demo: SignpostDemo,
  },
  {
    id: 'plank',
    group: 'motifs',
    icon: 'tile',
    title: l('木牌', 'Plank', '木札'),
    componentNames: ['Plank'],
    description: l('适合短标题、地点名和温柔提醒的横向木牌。', 'A horizontal wooden plaque for short headings, place names, and gentle notices.', '短い見出し、場所の名前、やさしい案内に使える横長の木札です。'),
    code: `<Plank>Wander slowly. The view will wait.</Plank>`,
    props: [p('...span props', `ComponentPropsWithoutRef<'span'>`, '—', '透传 span 属性与 ref。', 'Forwards span attributes and ref.', 'span の属性と ref を渡せます。')],
    accessibility: l('Plank 是展示性 span，不会自动创建标题层级。作为章节标题时，请在外层使用正确的 h2–h6。', 'Plank is a presentational span and does not create heading structure. Wrap it in the appropriate h2–h6 when it labels a section.', 'Plank は表示用の span で、見出し構造を作りません。章の見出しに使う場合は適切な h2〜h6 で囲んでください。'),
    Demo: PlankDemo,
  },
  {
    id: 'cloud-sign',
    group: 'motifs',
    icon: 'bubbles',
    title: l('云朵告示', 'Cloud sign', '雲の看板'),
    componentNames: ['CloudSign'],
    description: l('由原创 SVG 云形与居中正文组成的轻量告示牌。', 'A lightweight notice made from an original SVG cloud shape and centred copy.', 'オリジナル SVG の雲と中央の文章でできた、軽やかな案内板です。'),
    code: `<CloudSign title="Clear skies today">
  A good day to read on the grassy hill
</CloudSign>`,
    props: [
      p('title', 'ReactNode', 'required', '云朵中的主标题。', 'Main heading inside the cloud.', '雲の中に表示する主見出しです。'),
      p('children', 'ReactNode', '—', '可选辅助说明。', 'Optional supporting copy.', '任意の補足文です。'),
      p('...div props', `Omit<ComponentPropsWithoutRef<'div'>, 'title'>`, '—', '透传根 div 属性与 ref。', 'Forwards root div attributes and ref.', 'ルート div の属性と ref を渡せます。'),
    ],
    accessibility: l('云形 SVG 已标记为装饰；文本仍是真实 HTML。组件内部使用 h3，请放在合适的页面标题层级中。', 'The cloud SVG is decorative while all text remains real HTML. The component uses an h3 internally, so place it within an appropriate document heading hierarchy.', '雲の SVG は装飾扱いで、文字は実際の HTML です。内部で h3 を使うため、文書の見出し階層に合う位置へ置いてください。'),
    Demo: CloudSignDemo,
  },
  {
    id: 'wobble-bubble',
    group: 'motifs',
    icon: 'goo',
    title: l('软团气泡', 'Wobble bubble', 'ぷるぷるバブル'),
    componentNames: ['WobbleBubble'],
    description: l('持续缓慢蠕动的有机气泡，可切换为适合长一点文字的印章变体。', 'An organic bubble with a slow continuous wobble, plus a seal variant for slightly longer copy.', 'ゆっくり形を変え続ける有機的なバブル。少し長い文章向けの印章型もあります。'),
    code: `<WobbleBubble>Soft and squishy</WobbleBubble>
<WobbleBubble seal>Take today at today’s pace.</WobbleBubble>`,
    props: [
      p('seal', 'boolean', 'false', '使用白色印章式变体并允许多行。', 'Uses the white seal variant and allows wrapping.', '白い印章型に切り替え、複数行を許可します。'),
      p('...div props', `ComponentPropsWithoutRef<'div'>`, '—', '透传根 div 属性与 ref。', 'Forwards root div attributes and ref.', 'ルート div の属性と ref を渡せます。'),
    ],
    accessibility: l('动画会在 prefers-reduced-motion 下自动停止。请避免在气泡中放置需要稳定位置才能操作的复杂控件。', 'Animation stops automatically under prefers-reduced-motion. Avoid placing complex controls that require a stable target inside the moving bubble.', 'prefers-reduced-motion ではアニメーションが自動で止まります。安定した位置が必要な複雑な操作部品は、動くバブル内に置かないでください。'),
    Demo: WobbleBubbleDemo,
  },
  {
    id: 'photo',
    group: 'motifs',
    icon: 'flower',
    title: l('撕边照片', 'Photo', 'ちぎり写真'),
    componentNames: ['Photo'],
    description: l('带不规则纸边、轻微旋转和可选题注的照片框。', 'A photo frame with torn paper edges, a slight rotation, and an optional caption.', 'ちぎった紙の縁、わずかな傾き、任意のキャプションを持つ写真フレームです。'),
    code: `<Photo caption="The meadow after lunch">
  <img src="/meadow.webp" alt="Wildflowers on a green hill" />
</Photo>`,
    props: [
      p('caption', 'ReactNode', '—', '显示在照片下方的题注。', 'Caption displayed beneath the photo.', '写真の下に表示するキャプションです。'),
      p('children', 'ReactNode', '—', '图片、插画或其他视觉内容。', 'Image, illustration, or other visual content.', '画像、イラストなどの視覚コンテンツです。'),
      p('...div props', `ComponentPropsWithoutRef<'div'>`, '—', '透传根 div 属性与 ref。', 'Forwards root div attributes and ref.', 'ルート div の属性と ref を渡せます。'),
    ],
    accessibility: l('Photo 不会替图片生成替代文字。信息性图片仍需准确 alt；纯装饰图片使用空 alt。题注不能代替 alt。', 'Photo does not generate image alternative text. Informative images still need accurate alt text; decorative images use empty alt. A caption does not replace alt.', 'Photo は画像の代替テキストを作りません。情報を持つ画像には正確な alt、装飾画像には空の alt を付けます。キャプションは alt の代わりになりません。'),
    Demo: PhotoDemo,
  },
  {
    id: 'to-top',
    group: 'feedback',
    icon: 'up',
    title: l('回到顶部', 'To top', 'ページ上部へ'),
    componentNames: ['ToTop'],
    description: l('滚动超过阈值后出现的固定圆形按钮，并尊重减少动态效果偏好。', 'A fixed circular button revealed after a scroll threshold, with reduced-motion support.', '一定量スクロールすると現れる固定の丸ボタン。動きを減らす設定にも対応します。'),
    code: `<ToTop threshold={400} aria-label="Back to page top" />`,
    props: [
      p('threshold', 'number', '400', '按钮出现前的垂直滚动像素。', 'Vertical scroll distance before the button appears.', 'ボタンが現れるまでの縦スクロール量です。'),
      p('aria-label', 'string', `'Back to top'`, '描述按钮目的的可访问名称。', 'Accessible name describing the destination.', '移動先を説明するアクセシブルな名前です。'),
      p('...button props', `Omit<ComponentPropsWithoutRef<'button'>, 'aria-label'>`, '—', '透传其余按钮属性与 ref。', 'Forwards remaining button attributes and ref.', 'その他のボタン属性と ref を渡せます。'),
    ],
    accessibility: l('组件使用原生 button 与可见焦点轮廓。减少动态效果开启时改为立即滚动；请使用符合页面语言的 aria-label。', 'The component uses a native button with a visible focus ring. It switches to immediate scrolling under reduced motion; localise aria-label to the page language.', 'ネイティブ button と見えるフォーカスリングを使います。動きを減らす設定では即時スクロールになり、aria-label はページの言語に合わせてください。'),
    Demo: ToTopDemo,
  },
];

export const pageById = new Map(pages.map((page) => [page.id, page]));

export const groups: PageGroup[] = ['foundations', 'forms', 'feedback', 'motifs'];
