# Pokoland UI

**[English](README.md)** | **[简体中文](README.zh-CN.md)** | 日本語

> ほっとするステッカー風の React コンポーネントライブラリ。依存ゼロの CSS と Vanilla JavaScript も利用できます。

![status](https://img.shields.io/badge/status-v0.3.0_flowering-FFD66B)
![license](https://img.shields.io/badge/license-MIT-8FD178)
![runtime dependencies](https://img.shields.io/badge/runtime_dependencies-zero-8FD178)

**[コンポーネントドキュメント](https://heminghaoa.github.io/pokoland-ui/site/?lang=ja)** · **[Vanilla デモ](https://heminghaoa.github.io/pokoland-ui/demo/?lang=ja)**

![Pokoland UI](docs/assets/hero-ja.png)

## Pokoland UI について

Pokoland UI は React 18+ 向けの、TypeScript 型定義を備えたコンポーネントライブラリです。

- 切り抜きステッカーのような太い白フチ
- ホバー、押下、フォーカス、無効、視差効果を減らす設定への明確な対応
- CSS カスタムプロパティで調整できる、晴れた草原のカラーパレット
- オリジナル SVG アイコン 25 種と、製品 UI 内の絵文字ゼロ
- ネイティブ DOM 属性の透過と完全な型定義
- 中国語・英語・日本語のコンポーネントドキュメント
- 任意の React peer を除き、ランタイム依存ゼロ

React を使わないプロジェクトでも、フレームワーク非依存の CSS、SVG sprite、Vanilla JavaScript の入口を個別に利用できます。

## インストール

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
        水に飛びこむ
      </Button>
    </>
  );
}
```

`Icon` を使う場合は、アプリのルート付近で `IconSprite` を一度レンダリングしてください。各コンポーネントは対応するネイティブ属性を引き継ぐため、ラベル、イベント、ref、ARIA 属性をそのまま指定できます。

## パッケージの入口

| インポート | 用途 |
| --- | --- |
| `pokoland-ui` | React コンポーネント、ヘルパー、TypeScript 型 |
| `pokoland-ui/styles.css` | テーマトークンとコンポーネントスタイル |
| `pokoland-ui/vanilla` | 任意の Toast、Tabs、Dialog、i18n、パーティクル処理 |
| `pokoland-ui/icons.svg` | 単独で使える Pokoland アイコン sprite |

ビジュアルトークンはすべて `:root` の CSS 変数として公開されています。再ビルドせずに色、角丸、影、モーションを調整できます。

## ドキュメント

[3 言語対応のコンポーネントガイド](https://heminghaoa.github.io/pokoland-ui/site/?lang=ja)では、公開 API 全体のライブ例、コピー可能な React コード、props 表、アクセシビリティ上の注意点を確認できます。どのページからでも中国語・英語・日本語を切り替えられます。

React を使わない場合は、[依存ゼロのデモ](https://heminghaoa.github.io/pokoland-ui/demo/?lang=ja)と [Vanilla コンポーネントの説明](docs/components.md)をご覧ください。

## 開発

開発とリリースの自動化には [Bun](https://bun.sh) を使用します。

| コマンド | 内容 |
| --- | --- |
| `bun run dev` | `localhost:4178` でドキュメントとデモを配信 |
| `bun run check` | UI の絵文字と 3 言語デモの網羅性を検査 |
| `bun test` | React、パッケージ、ドキュメントのテストを実行 |
| `bun run build` | npm、ドキュメント、デモ、Pages artifact を構築 |
| `npm pack --dry-run` | npm に含まれる正確なファイルを確認 |

コンポーネント、テスト、アクセシビリティ、翻訳、IP に関する要件は [CONTRIBUTING.md](CONTRIBUTING.md) を参照してください。

## 名前、インスピレーション、IP について

**Pokoland** という名前は、日本語の擬音語「ぽこぽこ」に由来し、やわらかいボタンを押したときの音を思わせます。雰囲気は、ほのぼのとした生活シミュレーションゲームから着想を得ています。デザイン、配色、キャラクター、アイコン、文言はすべてオリジナルです。Pokoland UI は非公式のファンスピリットによるプロジェクトで、任天堂・株式会社ポケモンとは無関係であり、承認を受けたものではありません。公式アセットも含みません。コントリビューションにも同じルールが適用されます。

## ライセンス

[MIT](LICENSE) © 2026 Pokoland UI Contributors
