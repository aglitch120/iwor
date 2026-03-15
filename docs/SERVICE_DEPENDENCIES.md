# 依存サービス一覧

> 最終更新日: 2026-03-15

## 本番インフラ

| サービス | 用途 | アカウント | 料金 | 備考 |
|---------|------|-----------|------|------|
| **Cloudflare Pages** | ホスティング・CDN | Cloudflareアカウント | 無料（Freeプラン） | iwor.jpのデプロイ先 |
| **Cloudflare DNS** | DNS管理 | 同上 | 無料 | Xserverからネームサーバー変更済み |
| **Xserverドメイン** | ドメイン registrar | Xserverアカウント | 年額約1,300円 | iwor.jp, 自動更新要確認 |
| **GitHub** | ソースコード管理 | aglitch120 | 無料 | aglitch120/iwor |

## 分析・計測

| サービス | 用途 | ID | 料金 |
|---------|------|-----|------|
| **Google Analytics 4** | アクセス解析 | G-VTCJT6XFHG | 無料 |
| **Google Search Console** | SEO・インデックス管理 | ドメインプロパティ | 無料 |

## 将来導入予定（Phase 2以降）

| サービス | 用途 | 導入条件 | 想定料金 |
|---------|------|---------|---------|
| **Supabase** | Auth + PostgreSQL (PRO機能) | PRO機能リリース時 | 無料〜$25/月 |
| **Cloudflare Workers + KV** | API・キャッシュ | API機能追加時 | 無料枠内 |
| **n8n** | ワークフロー自動化（論文フィード） | 論文フィード実装時 | セルフホスト無料 or $20/月 |
| **Claude API** | 論文要約生成 | 論文フィード実装時 | 従量課金 |
| **BOOTH** | 決済（Phase 1） | PRO販売開始時 | 手数料5.6%+22円 |
| **Stripe** | 決済（Phase 2） | 合同会社設立後 | 手数料3.6% |

## 月額コスト（現時点）

| 項目 | 金額 |
|------|------|
| Cloudflare Pages | ¥0 |
| GitHub | ¥0 |
| GA4 / GSC | ¥0 |
| ドメイン（年割） | 約 ¥108/月 |
| **合計** | **約 ¥108/月** |

## 事業譲渡時の移転対象

1. **GitHub リポジトリ**: aglitch120/iwor → 譲渡先orgに転送
2. **Cloudflare アカウント**: iwor.jpゾーンを譲渡先に移管
3. **Xserver ドメイン**: ドメイン移管（auth code発行）
4. **GA4 / GSC**: プロパティのオーナー権限を譲渡
5. **Supabase**: プロジェクト移管（Phase 2以降）
6. **BOOTH / Stripe**: アカウント情報引継ぎ
