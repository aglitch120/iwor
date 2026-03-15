# アーキテクチャ図

> 最終更新日: 2026-03-15

## システム構成

```
┌─────────────────────────────────────────────────┐
│                   ユーザー                        │
│            (ブラウザ / モバイル)                    │
└──────────────────────┬──────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────┐
│              Cloudflare CDN / DNS                │
│                  iwor.jp                         │
│  ┌─────────────┐  ┌──────────────────────────┐  │
│  │ DNS管理     │  │ CDN (キャッシュ/配信)     │  │
│  └─────────────┘  └──────────────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
┌──────────────────┐   ┌────────────────────────┐
│ Cloudflare Pages │   │ Cloudflare Workers     │
│  (Next.js SSG)   │   │  (API / KV) [Phase2]   │
│                  │   │                        │
│ ・ブログ記事     │   │ ・認証API              │
│ ・臨床ツール     │   │ ・PRO機能API           │
│ ・固定ページ     │   │ ・キャッシュ管理       │
└──────────────────┘   └───────────┬────────────┘
                                   │ [Phase 2]
                                   ▼
                       ┌────────────────────────┐
                       │      Supabase          │
                       │                        │
                       │ ・Auth (認証)          │
                       │ ・PostgreSQL (DB)      │
                       │ ・症例データ           │
                       │ ・ユーザープロファイル │
                       └────────────────────────┘
```

## データフロー

```
[無料ユーザー]
  → Cloudflare CDN → Pages (静的HTML/JS)
  → ブラウザ内で完結（計算はクライアントサイド）

[PROユーザー] (Phase 2)
  → Cloudflare CDN → Pages (UI)
  → Workers (API) → Supabase (データ永続化)
  → 認証: Supabase Auth (JWT)

[論文フィード] (Phase 2)
  → n8n (cron) → PubMed API → Claude API (要約生成)
  → Supabase (保存) → Workers → Pages (配信)
```

## 技術スタック詳細

| レイヤー | 技術 | 備考 |
|---------|------|------|
| フロントエンド | Next.js 14 + React 18 | SSG (Static Site Generation) |
| スタイリング | Tailwind CSS 3.4 | カスタムカラーシステム |
| コンテンツ | MDX (next-mdx-remote) | 173記事 + ツール解説 |
| ホスティング | Cloudflare Pages | 自動デプロイ (Git連携) |
| DNS | Cloudflare DNS | Xserverドメインから移管 |
| 計測 | GA4 + GSC | G-VTCJT6XFHG |
| API [Phase 2] | Cloudflare Workers | Edge Runtime |
| DB [Phase 2] | Supabase PostgreSQL | Auth一体型 |
| 自動化 [Phase 2] | n8n + Claude API | 論文フィード |
| 決済 [Phase 1] | BOOTH | 匿名販売 |
| 決済 [Phase 2] | Stripe | 法人化後 |

## ディレクトリ構造

```
iwor/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # ルートレイアウト (Header/Footer/GA4)
│   ├── page.tsx            # トップページ
│   ├── blog/               # ブログ一覧・カテゴリ・個別記事
│   ├── tools/              # 臨床ツール
│   │   ├── page.tsx        # ツールハブ
│   │   └── calc/           # 計算ツール (36個)
│   ├── about/              # サイト概要
│   ├── privacy/            # プライバシーポリシー
│   ├── terms/              # 利用規約
│   ├── tokushoho/          # 特商法表示
│   └── contact/            # お問い合わせ
├── components/             # 共通コンポーネント
│   ├── Header.tsx
│   ├── BottomNav.tsx
│   ├── blog/               # ブログ用コンポーネント
│   └── tools/              # ツール用コンポーネント
│       ├── CalculatorLayout.tsx
│       ├── ResultCard.tsx
│       └── InputFields.tsx
├── content/blog/           # MDX記事 (173本)
├── lib/                    # ユーティリティ
│   ├── blog-config.ts      # ブログ設定・カテゴリ定義
│   ├── tools-config.ts     # ツール定義・メタデータ
│   ├── seo.ts              # 構造化データ
│   └── mdx.ts              # MDXパーサー
├── docs/                   # ドキュメント
├── tests/                  # テスト
├── scripts/                # ビルドスクリプト
└── public/                 # 静的アセット
```
