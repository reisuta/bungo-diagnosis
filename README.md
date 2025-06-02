# 文豪性格診断 - Astroアプリケーション

簡単な質問に答えることで、あなたの性格に最も近い日本の文豪を診断するWebアプリケーションです。

## 🚀 プロジェクト概要

このアプリケーションは、3段階の質問を通じて16人の文豪の中からあなたに最も適した性格タイプを診断します。

### 診断可能な文豪
- 太宰治（破産型タイプ）
- 芥川龍之介（繊細タイプ）
- 夏目漱石（権威タイプ）
- 森鷗外（博学タイプ）
- 樋口一葉（天才タイプ）
- 志賀直哉（金持ちタイプ）
- 武者小路実篤（愚直タイプ）
- 谷崎潤一郎（変態タイプ）
- 永井荷風（性欲タイプ）
- 島田清次郎（刹那タイプ）
- 菊池寛（ビジネスタイプ）
- 梶井基次郎（センスタイプ）
- 尾崎紅葉（親分タイプ）
- 川上眉山（無冠の天才タイプ）
- 江戸川乱歩（放浪タイプ）
- 葛西善蔵（ほろ酔いタイプ）

## 🛠️ 技術スタック

- **フレームワーク**: [Astro](https://astro.build/) v5.8.1
- **スタイリング**: [Tailwind CSS](https://tailwindcss.com/) v4.1.8
- **言語**: TypeScript
- **アダプター**: Node.js（SSR対応）

## 📁 プロジェクト構造

```
bungo-diagnosis/
├── src/
│   ├── layouts/
│   │   └── Layout.astro          # 共通レイアウト
│   ├── pages/
│   │   ├── index.astro           # ホームページ
│   │   ├── test.astro            # 診断ページ1/3
│   │   ├── test2.astro           # 診断ページ2/3
│   │   ├── test3.astro           # 診断ページ3/3
│   │   ├── result.astro          # 診断結果ページ
│   │   ├── list.astro            # 文豪一覧ページ
│   │   └── authors/
│   │       └── [id].astro        # 文豪詳細ページ（動的ルーティング）
│   ├── data/
│   │   ├── authors.ts            # 文豪データ
│   │   ├── questions.ts          # 第1・2段階の質問データ
│   │   └── test3-questions.ts    # 第3段階の質問データ
│   ├── utils/
│   │   └── diagnosis.ts          # 診断ロジック
│   └── styles/
│       └── global.css            # グローバルスタイル
├── public/
│   └── favicon.svg               # ファビコン
├── astro.config.mjs              # Astro設定ファイル
└── package.json                  # 依存関係
```

## 🎯 Astroの主要概念（初心者向け）

### 1. `.astro`ファイルの構造
```astro
---
// フロントマター（JavaScript/TypeScript）
import Layout from '../layouts/Layout.astro';
const title = 'ページタイトル';
---

<!-- HTMLテンプレート -->
<Layout title={title}>
  <h1>こんにちは</h1>
</Layout>
```

### 2. ページルーティング
- `src/pages/`内のファイルが自動的にルートになります
- `index.astro` → `/`
- `test.astro` → `/test`
- `authors/[id].astro` → `/authors/dazai`（動的ルーティング）

### 3. コンポーネント
- `.astro`ファイルは再利用可能なコンポーネントです
- `Layout.astro`は共通のページレイアウトを提供

### 4. データファイル
- `src/data/`内のTypeScriptファイルでデータを管理
- 型安全性を保ちながらデータを扱えます

## 🚀 セットアップ方法

### 前提条件
- Node.js 18以上
- npm または yarn

### インストール手順

1. **依存関係のインストール**
   ```bash
   npm install
   ```

2. **開発サーバーの起動**
   ```bash
   npm run dev
   ```
   
   ブラウザで `http://localhost:4321/` にアクセス

3. **本番ビルド**
   ```bash
   npm run build
   ```

4. **プレビュー**
   ```bash
   npm run preview
   ```

## 📱 アプリケーションの使い方

1. **ホームページ**: アプリの概要と診断開始ボタン
2. **診断フロー**: 3段階の質問に順番に回答
3. **結果表示**: あなたに最適な文豪と性格タイプを表示
4. **詳細ページ**: 各文豪の詳しい情報を閲覧

## 🔄 診断ロジックの仕組み

### 第1段階（5つの質問）
- 合計点数が25点未満 → 「一般人ルート」
- 合計点数が25点以上 → 「文豪ルート」

### 第2段階
- **一般人ルート**: リーダーシップと実行力に関する質問
- **文豪ルート**: 芸術的感性と哲学的思考に関する質問

### 第3段階
- 前段階の結果に基づいて、さらに細分化された質問
- 最終的に16人の文豪から1人を決定

## 🎨 スタイリングについて

### Tailwind CSS
- ユーティリティファーストのCSSフレームワーク
- レスポンシブデザインに対応
- 例：`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg`

### カスタマイズ
- `src/styles/global.css`でグローバルスタイルを追加
- Tailwindのクラスをテンプレート内で直接使用

## 🌐 デプロイ方法

### Vercel（推奨）
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

### Cloudflare Pages
1. GitHubリポジトリに push
2. Cloudflare Pages でリポジトリを接続
3. ビルドコマンド: `npm run build`
4. 出力ディレクトリ: `dist`

## 🔧 開発のヒント

### データの追加・編集
- 文豪の追加: `src/data/authors.ts`
- 質問の編集: `src/data/questions.ts`、`src/data/test3-questions.ts`
- 診断ロジックの調整: `src/utils/diagnosis.ts`

### 新しいページの追加
1. `src/pages/`に`.astro`ファイルを作成
2. Layout コンポーネントを import
3. 必要に応じてナビゲーションリンクを追加

### TypeScript の恩恵
- データの型安全性
- 開発時のエラー検出
- IntelliSense による自動補完

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します！

---

**開発者向けメモ**: このプロジェクトは元々Djangoで作成されていたものをAstroに移行したものです。複雑な分岐ロジックと状態管理を静的サイト生成フレームワークで実現しています。