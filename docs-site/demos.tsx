import * as React from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  CloudSign,
  Dialog,
  Field,
  Icon,
  ICON_NAMES,
  Input,
  NavLink,
  Photo,
  Plank,
  Progress,
  Radio,
  Select,
  Signpost,
  Slider,
  Switch,
  Tabs,
  Textarea,
  toast,
  ToTop,
  Tooltip,
  WobbleBubble,
} from '../src/react';
import type { Lang, Localized } from './i18n';

export interface DemoProps {
  lang: Lang;
}

const t = (value: Localized, lang: Lang) => value[lang];

export function ButtonDemo({ lang }: DemoProps) {
  const action = t({ zh: '种下一颗种子', en: 'Plant a seed', ja: '種をまく' }, lang);
  return (
    <div className="demo-row">
      <Button burst="leaf" className="icon-btn">
        <Icon name="leaf" /> {action}
      </Button>
      <Button color="sky" burst="splash">
        {t({ zh: '跳进水里', en: 'Jump in', ja: '水に飛び込む' }, lang)}
      </Button>
      <Button color="butter" size="sm">
        {t({ zh: '稍后再说', en: 'Maybe later', ja: 'また今度' }, lang)}
      </Button>
      <Button ghost>{t({ zh: '返回', en: 'Go back', ja: '戻る' }, lang)}</Button>
    </div>
  );
}

export function BadgeDemo({ lang }: DemoProps) {
  const labels = [
    ['meadow', 'leaf', { zh: '新鲜', en: 'Fresh', ja: 'できたて' }],
    ['sky', 'drop', { zh: '水边', en: 'Waterside', ja: '水辺' }],
    ['butter', 'star', { zh: '收藏', en: 'Favourite', ja: 'お気に入り' }],
    ['coral', 'heart', { zh: '友好', en: 'Friendly', ja: 'なかよし' }],
    ['lilac', 'moon', { zh: '夜间', en: 'Evening', ja: '夕暮れ' }],
  ] as const;
  return (
    <div className="demo-row">
      {labels.map(([color, icon, label]) => (
        <Badge key={color} color={color}>
          <Icon name={icon} /> {t(label, lang)}
        </Badge>
      ))}
    </div>
  );
}

export function FormDemo({ lang }: DemoProps) {
  return (
    <div className="demo-form-grid">
      <Field label={t({ zh: '岛屿名称', en: 'Island name', ja: '島の名前' }, lang)} htmlFor="demo-name">
        <Input id="demo-name" placeholder={t({ zh: '例如：晨露岛', en: 'For example, Dewdrop', ja: '例：しずく島' }, lang)} />
      </Field>
      <Field label={t({ zh: '今日天气', en: 'Today’s weather', ja: '今日の天気' }, lang)} htmlFor="demo-weather">
        <Select id="demo-weather" defaultValue="sunny">
          <option value="sunny">{t({ zh: '晴朗', en: 'Sunny', ja: '晴れ' }, lang)}</option>
          <option value="rain">{t({ zh: '小雨', en: 'Light rain', ja: '小雨' }, lang)}</option>
          <option value="cloud">{t({ zh: '多云', en: 'Cloudy', ja: 'くもり' }, lang)}</option>
        </Select>
      </Field>
      <Field className="demo-form-wide" label={t({ zh: '留言', en: 'A small note', ja: 'ひとこと' }, lang)} htmlFor="demo-note">
        <Textarea id="demo-note" placeholder={t({ zh: '写下今天想做的事', en: 'Write down today’s plan', ja: '今日したいことを書きましょう' }, lang)} />
      </Field>
    </div>
  );
}

export function SwitchDemo({ lang }: DemoProps) {
  const [checked, setChecked] = React.useState(true);
  return (
    <div className="demo-setting">
      <div>
        <strong>{t({ zh: '草叶提示音', en: 'Leaf sound', ja: '葉っぱの音' }, lang)}</strong>
        <span>{checked ? t({ zh: '已开启', en: 'On', ja: 'オン' }, lang) : t({ zh: '已关闭', en: 'Off', ja: 'オフ' }, lang)}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        aria-label={t({ zh: '切换草叶提示音', en: 'Toggle leaf sound', ja: '葉っぱの音を切り替える' }, lang)}
      />
    </div>
  );
}

export function SelectionDemo({ lang }: DemoProps) {
  return (
    <div className="demo-stack">
      <Checkbox defaultChecked>{t({ zh: '带上野餐布', en: 'Pack the picnic blanket', ja: 'ピクニックシートを持つ' }, lang)}</Checkbox>
      <Checkbox>{t({ zh: '浇花', en: 'Water the flowers', ja: '花に水をあげる' }, lang)}</Checkbox>
      <div className="demo-row">
        <Radio name="trail" value="meadow" defaultChecked>
          {t({ zh: '草原路线', en: 'Meadow trail', ja: '草原ルート' }, lang)}
        </Radio>
        <Radio name="trail" value="river">
          {t({ zh: '河畔路线', en: 'Riverside trail', ja: '川辺ルート' }, lang)}
        </Radio>
      </div>
    </div>
  );
}

export function ProgressDemo({ lang }: DemoProps) {
  return (
    <div className="demo-stack demo-wide">
      <Progress value={72} label={t({ zh: '花园完成度', en: 'Garden progress', ja: '庭づくり' }, lang)} />
      <Progress value={46} variant="sunny" label={t({ zh: '晴天能量', en: 'Sunny energy', ja: 'おひさまエネルギー' }, lang)} />
    </div>
  );
}

export function SliderDemo({ lang }: DemoProps) {
  const [value, setValue] = React.useState(64);
  return (
    <div className="slider-wrap demo-wide">
      <Icon name="speaker" aria-label={t({ zh: '音量', en: 'Volume', ja: '音量' }, lang)} />
      <Slider value={value} onValueChange={setValue} aria-label={t({ zh: '环境音音量', en: 'Ambient volume', ja: '環境音の音量' }, lang)} />
      <span className="slider-value" aria-live="polite">{value}</span>
    </div>
  );
}

export function CardDemo({ lang }: DemoProps) {
  return (
    <div className="demo-row demo-cards">
      <Card>
        <Card.Art variant="grass"><Icon name="mushroom" /></Card.Art>
        <Card.Body>
          <h3>{t({ zh: '晨露蘑菇', en: 'Dewdrop mushroom', ja: '朝つゆキノコ' }, lang)}</h3>
          <p>{t({ zh: '雨后会在草地边缘悄悄冒出来。', en: 'Appears quietly at the meadow’s edge after rain.', ja: '雨上がりの草原に、そっと顔を出します。' }, lang)}</p>
          <Card.Row>
            <Badge color="meadow"><Icon name="leaf" /> {t({ zh: '常见', en: 'Common', ja: 'よく見る' }, lang)}</Badge>
            <Icon name="heart" aria-label={t({ zh: '喜爱', en: 'Favourite', ja: 'お気に入り' }, lang)} />
          </Card.Row>
        </Card.Body>
      </Card>
      <Card>
        <Card.Art variant="sky"><Icon name="drop" /></Card.Art>
        <Card.Body>
          <h3>{t({ zh: '蓝溪水滴', en: 'Blue creek drop', ja: '青い小川のしずく' }, lang)}</h3>
          <p>{t({ zh: '摸起来凉凉的，会映出天空的颜色。', en: 'Cool to the touch and always reflecting the sky.', ja: 'ひんやりして、いつも空の色を映しています。' }, lang)}</p>
        </Card.Body>
      </Card>
    </div>
  );
}

export function AvatarDemo({ lang }: DemoProps) {
  return (
    <div className="demo-row">
      {(['meadow', 'sky', 'butter', 'coral'] as const).map((color, index) => (
        <Avatar key={color} color={color} aria-label={`${t({ zh: '居民', en: 'Resident', ja: '住民' }, lang)} ${index + 1}`} />
      ))}
      <Avatar color="sky" aria-label={t({ zh: '花朵居民', en: 'Flower resident', ja: '花の住民' }, lang)}><Icon name="flower" /></Avatar>
    </div>
  );
}

export function TooltipDemo({ lang }: DemoProps) {
  return (
    <div className="demo-row demo-tooltip-space">
      <Tooltip content={t({ zh: '今天也要慢慢来', en: 'Take it gently today', ja: '今日ものんびりいこう' }, lang)}>
        <Badge color="butter"><Icon name="star" /> {t({ zh: '悬停或聚焦', en: 'Hover or focus', ja: 'ホバーまたはフォーカス' }, lang)}</Badge>
      </Tooltip>
    </div>
  );
}

export function TabsDemo({ lang }: DemoProps) {
  return (
    <Tabs defaultValue="garden">
      <Tabs.List aria-label={t({ zh: '岛屿区域', en: 'Island areas', ja: '島のエリア' }, lang)}>
        <Tabs.Tab value="garden">{t({ zh: '花园', en: 'Garden', ja: '庭' }, lang)}</Tabs.Tab>
        <Tabs.Tab value="river">{t({ zh: '河边', en: 'River', ja: '川辺' }, lang)}</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="garden">
        <h4>{t({ zh: '花园日志', en: 'Garden notes', ja: '庭の記録' }, lang)}</h4>
        {t({ zh: '晨光最适合给幼苗浇水。', en: 'Morning light is best for watering young sprouts.', ja: '朝の光のなかで、芽に水をあげるのがおすすめです。' }, lang)}
      </Tabs.Panel>
      <Tabs.Panel value="river">
        <h4>{t({ zh: '河畔日志', en: 'Riverside notes', ja: '川辺の記録' }, lang)}</h4>
        {t({ zh: '午后能听见水面传来的轻响。', en: 'In the afternoon, the water makes a quiet rhythm.', ja: '午後になると、水面から小さな音が聞こえます。' }, lang)}
      </Tabs.Panel>
    </Tabs>
  );
}

export function DialogDemo({ lang }: DemoProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button color="coral" onClick={() => setOpen(true)}>{t({ zh: '打开邀请', en: 'Open invitation', ja: '招待状を開く' }, lang)}</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <span className="dialog-symbol"><Icon name="heart" /></span>
        <h3>{t({ zh: '一起去野餐吗？', en: 'Join the picnic?', ja: '一緒にピクニックしませんか？' }, lang)}</h3>
        <p>{t({ zh: '我们会在大树下留一个柔软的位置。', en: 'We saved a soft spot beneath the big tree.', ja: '大きな木の下に、ふかふかの場所を空けてあります。' }, lang)}</p>
        <div className="actions">
          <Button onClick={() => setOpen(false)}>{t({ zh: '一起去', en: 'Join in', ja: '参加する' }, lang)}</Button>
          <Button ghost onClick={() => setOpen(false)}>{t({ zh: '这次不了', en: 'Not this time', ja: '今回はやめておく' }, lang)}</Button>
        </div>
      </Dialog>
    </>
  );
}

export function ToastDemo({ lang }: DemoProps) {
  return (
    <div className="demo-row">
      <Button onClick={() => toast.ok('check', t({ zh: '花园记录已保存', en: 'Garden notes saved', ja: '庭の記録を保存しました' }, lang))}>
        {t({ zh: '显示成功通知', en: 'Show success toast', ja: '成功通知を表示' }, lang)}
      </Button>
      <Button color="butter" onClick={() => toast.warn('star', t({ zh: '记得带上水壶', en: 'Remember the watering can', ja: 'じょうろを忘れずに' }, lang))}>
        {t({ zh: '显示提醒', en: 'Show reminder', ja: 'お知らせを表示' }, lang)}
      </Button>
    </div>
  );
}

export function IconDemo({ lang }: DemoProps) {
  return (
    <div className="icon-field">
      {ICON_NAMES.map((name) => (
        <div key={name} className="icon-sample">
          <Icon name={name} size={28} aria-label={name} />
          <span>{name}</span>
        </div>
      ))}
      <p className="sr-only">{t({ zh: '共二十五枚图标', en: 'Twenty-five icons in total', ja: '全二十五種類のアイコン' }, lang)}</p>
    </div>
  );
}

export function SignpostDemo({ lang }: DemoProps) {
  const stop = (event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault();
  return (
    <Signpost aria-label={t({ zh: '示例导航', en: 'Example navigation', ja: 'サンプルナビゲーション' }, lang)}>
      <NavLink href="#garden" active onClick={stop}>{t({ zh: '花园', en: 'Garden', ja: '庭' }, lang)}</NavLink>
      <NavLink href="#river" onClick={stop}>{t({ zh: '河边', en: 'River', ja: '川辺' }, lang)}</NavLink>
      <NavLink href="#camp" onClick={stop}>{t({ zh: '营地', en: 'Camp', ja: 'キャンプ' }, lang)}</NavLink>
    </Signpost>
  );
}

export function PlankDemo({ lang }: DemoProps) {
  return <Plank>{t({ zh: '慢慢走，风景不会跑', en: 'Wander slowly. The view will wait.', ja: 'ゆっくり歩こう。景色は待ってくれる。' }, lang)}</Plank>;
}

export function CloudSignDemo({ lang }: DemoProps) {
  return (
    <CloudSign title={t({ zh: '今日晴朗', en: 'Clear skies today', ja: '今日は晴れ' }, lang)}>
      {t({ zh: '适合在草坡上读一本书', en: 'A good day to read on the grassy hill', ja: '草の丘で本を読むのにぴったりです' }, lang)}
    </CloudSign>
  );
}

export function WobbleBubbleDemo({ lang }: DemoProps) {
  return (
    <div className="demo-row">
      <WobbleBubble>{t({ zh: '软乎乎', en: 'Soft and squishy', ja: 'ふわふわ' }, lang)}</WobbleBubble>
      <WobbleBubble seal>{t({ zh: '今日的事情，今天慢慢做。', en: 'Take today’s tasks at today’s pace.', ja: '今日のことは、今日のペースで。' }, lang)}</WobbleBubble>
    </div>
  );
}

export function PhotoDemo({ lang }: DemoProps) {
  return (
    <Photo caption={t({ zh: '午后的草坡', en: 'The meadow after lunch', ja: '午後の草原' }, lang)}>
      <div className="demo-landscape" aria-hidden="true">
        <span className="demo-sun" />
        <span className="demo-hill demo-hill-back" />
        <span className="demo-hill demo-hill-front" />
        <Icon name="flower" />
      </div>
    </Photo>
  );
}

export function ToTopDemo({ lang }: DemoProps) {
  return (
    <div className="to-top-sample">
      <p>{t({ zh: '这是实际的 ToTop 组件。按下后会回到页面顶部。', en: 'This is the real ToTop component. Press it to return to the top of the page.', ja: '実際の ToTop コンポーネントです。押すとページ上部へ戻ります。' }, lang)}</p>
      <ToTop threshold={-1} className="docs-to-top-preview" aria-label={t({ zh: '回到页面顶部', en: 'Back to page top', ja: 'ページ上部へ戻る' }, lang)} />
    </div>
  );
}
