# 内科ナビ

内科専門医を目指す専攻医向けのWebアプリ＋SEOブログ

## 🚀 クイックスタート

```bash
# 開発サーバー起動（Workers）
npx wrangler dev

# デプロイ
git add . && git commit -m "変更内容" && git push
```

## 📁 プロジェクト構成

```
naikanavi/
├── demo_v14_app.html    # メインアプリ（単一HTML）
├── worker.js            # Cloudflare Workers API
├── wrangler.toml        # Wrangler設定
├── docs/                # ドキュメント
│   ├── BUSINESS_OVERVIEW.md   # ビジネス概要
│   ├── SEO_GUIDELINE.md       # SEOガイドライン
│   ├── IMPLEMENTATION_GUIDE.md # 実装ガイド
│   ├── DESIGN_SYSTEM.md       # デザインシステム
│   └── keywords/
│       └── naikanavi_keyword_list.xlsx  # キーワードリスト
└── README.md
```

## 📖 ドキュメント

| ファイル | 内容 |
|---------|------|
| [BUSINESS_OVERVIEW.md](docs/BUSINESS_OVERVIEW.md) | ビジネスモデル、ターゲット、機能概要 |
| [SEO_GUIDELINE.md](docs/SEO_GUIDELINE.md) | 記事作成ルール、運営フロー、KPI |
| [IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) | 技術実装、フォルダ構成、デプロイ |
| [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | カラー、タイポグラフィ、コンポーネント |

## 🔗 リンク

- **本番**: https://naikanavi.com
- **Cloudflare**: https://dash.cloudflare.com
- **GitHub**: https://github.com/aglitch120/naikanavi

## 🤖 Claude MCP連携

このリポジトリはClaude（claude.ai）のGitHub MCP連携に対応しています。
新しいチャットで以下のように指示すれば、全ドキュメントにアクセス可能：

```
aglitch120/naikanavi の docs/ を読んで、内科ナビの概要を把握して
```
