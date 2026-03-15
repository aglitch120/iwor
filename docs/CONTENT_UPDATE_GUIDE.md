# コンテンツ更新手順書

> 最終更新日: 2026-03-15

## 1. ブログ記事の追加

### 手順

1. `content/blog/` に新しいMDXファイルを作成
2. ファイル名: `記事slug.mdx`（例: `josler-case-tips.mdx`）
3. フロントマターを記述:

```yaml
---
title: "記事タイトル"
description: "meta description（120字以内）"
date: "2026-03-15"
category: "josler-basics"
tags: ["J-OSLER", "症例登録"]
author: "iwor編集部"
---
```

4. 本文をMDXで記述
5. `lib/blog-config.ts` のカテゴリに存在するカテゴリslugを使用すること
6. コミット＆プッシュ → Cloudflare Pagesが自動ビルド

### カテゴリ一覧

`lib/blog-config.ts` の `categories` を参照。主要カテゴリ:
- josler-basics, case-registration, medical-history, disease-specific
- specialist-exam, exam-by-field, career, ai-tools, academic
- part-time, tax-saving, mental-life, life-events

### SEOチェックリスト

- [ ] titleにメインキーワード含む
- [ ] descriptionが120字以内
- [ ] H2/H3の階層構造が正しい
- [ ] 関連ツールへの内部リンクあり
- [ ] 関連記事への内部リンクあり

---

## 2. 臨床計算ツールの追加

### 手順

1. `lib/tools-config.ts` にツール定義を追加:

```ts
{
  slug: 'tool-slug',
  name: 'ツール名（日本語）',
  nameEn: 'Tool Name (English)',
  description: 'SEO用説明文',
  category: 'cardiology', // ToolCategoryから選択
  tier: 2,
  keywords: ['キーワード1', 'キーワード2'],
  relatedSlugs: ['related-tool-slug'],
}
```

2. `app/tools/calc/[slug]/page.tsx` を作成（既存ツールを参考にコピー&修正）
3. `implementedTools` Setに新slugを追加
4. 必須要素:
   - 計算ロジック（useMemo内）
   - ResultCardによる結果表示
   - 解説セクション（explanation prop）
   - 出典（references prop）
   - 関連ツール（relatedTools prop）
5. テスト: `tests/calc-logic.test.mjs` に計算ロジックのテストを追加
6. コミット＆プッシュ

### 使用可能な入力コンポーネント

`components/tools/InputFields.tsx`:
- `NumberInput` — 数値入力
- `SelectInput` — ドロップダウン
- `RadioGroup` — ラジオボタン（ボタン風）
- `CheckItem` — チェックボックス（スコア用、点数表示付き）

### レイアウト

`components/tools/CalculatorLayout.tsx` を使用。props:
- title, titleEn, description, category, categoryIcon
- result (ResultCardコンポーネント)
- explanation (解説JSX)
- relatedTools (関連ツールリンク)
- references (出典リスト)
- children (入力フォーム)

---

## 3. デプロイ

### 自動デプロイ（通常）

mainブランチにpush → Cloudflare Pages自動ビルド

### 手動デプロイ

```bash
cd /path/to/iwor
npx wrangler pages deploy .next --project-name=iwor
```

### ビルド確認

```bash
npm run build  # ローカルでビルドエラーがないか確認
```

---

## 4. 検索インデックス更新

新しい記事・ツールを追加したら:

```bash
node scripts/generate-search-index.mjs
```

`public/search-index.json` が更新される。コミットに含めること。

---

## 5. OGP画像メタデータ更新

```bash
node scripts/generate-ogp-meta.mjs
```

`lib/ogp-meta.json` が更新される。
