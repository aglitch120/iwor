# iwor.jp プロジェクト Custom Instructions

## プロジェクト概要

**iwor（イウォル）** — 医師の臨床とキャリアを支える恵みの地

- ブランド名: iwor（アイヌ語で「恵みの地」）
- ドメイン: iwor.jp（2026-03-15 取得、Xserverドメイン）
- 方針: 自走メイン、売却は保険。月収100万超→自走、頭打ち→売却
- 売却先候補: m3、メドレー、メドピア、ケアネット、EdTech企業
- 売却チャネル: ラッコM&A、TRANBI、バトンズ

## 今の最優先事項

1. iwor.jp にCloudflare接続（ネームサーバー変更）
2. naikanavi.com 173記事をiwor.jpに移植（301リダイレクト）
3. 臨床計算ツール67個の構築（SEO集客装置）
4. GSC登録→PV計測開始
5. 最初の1円を稼ぐ（J-OSLERテンプレBOOTH販売）

## サイト構造

```
iwor.jp/
├── /tools/        ← 臨床計算ツール群（67個、無料）
├── /compare/      ← 薬剤比較（25個、無料）
├── /blog/         ← SEOコンテンツ（173記事移植＋新規）
├── /josler/       ← J-OSLER対策（PRO有料機能）
│
│  ── 将来拡張枠（今は作らない）──
├── /matching/     ← マッチング対策
├── /residency/    ← 研修医向け
├── /specialist/   ← 他科専門医対策
├── /hospitals/    ← 病院DB
└── /guide/        ← 当直マニュアル
```

## ビジネスモデル

- **無料**: 臨床ツール、薬剤比較、ブログ全記事（SEO集客＋信頼構築）
- **有料**: iwor PRO 年額9,800円（パーソナライズ・制度特化管理・API利用）
- **決済Phase 1**: BOOTH年間パス（匿名維持）
- **決済Phase 2**: 合同会社＋Stripe（PRO会員100人超えたら）

## 旧サイトの扱い

- naikanavi.com → 全記事iwor.jpに移植後、301リダイレクト
- tellmedu.com → 閉鎖。将来iwor.jpの/matching/に再構築

## GitHubリポジトリ

https://github.com/aglitch120/iwor
※リポジトリ名は将来iworに変更予定

## 作業時のルール

1. 作業開始時は必ず aglitch120/iwor をcloneし、docs/ フォルダを確認する
2. 戦略・方針は docs/BUSINESS_OVERVIEW.md と docs/EXIT_STRATEGY.md に従う
3. デザインは docs/DESIGN_SYSTEM.md に従う
4. SEOは docs/SEO_GUIDELINE.md に従う
5. 技術実装は docs/IMPLEMENTATION_GUIDE.md に従う
6. タスク管理は docs/EXIT_TODO.md を参照し、完了タスクはステータス更新してpush
7. Github access token: （セッション開始時に別途参照）
8. 作業完了時は必ず git push する
9. ツール開発時は naikanavi_tools_final_list_v2.md を参照する

## セッション継続性

- 小タスクごとにコミット＆プッシュ
- git add -A 禁止 → git add <ファイル名> で個別指定
- node_modules/ は絶対にコミットしない
- EXIT_TODO.md をタスク完了ごとに更新
- 長い作業は途中で進捗報告、返答は簡潔に

## 臨床ツール開発方針

### 3層リスクアプローチ
- 第1層（計算ツール38個）: 数式ベース、リスクほぼゼロ
- 第2層（確立された換算4個）: 教科書に同じ表あり、出典明記
- 第3層（薬剤比較25個）: 換算値は載せない、添付文書公開情報のみ

### SEO戦略
- HOKUTOの盲点: アプリ内ツールがWeb検索に出ない空白地帯を獲る
- 1ツール＝1解説記事: 計算フォーム＋解説(500-1000字)＋出典＋内部リンク
- E-E-A-T: 医師プロフィール明示、全ツールに出典

## 技術スタック

- Next.js 14 + MDX + Tailwind CSS + Cloudflare Pages
- Cloudflare Workers + KV
- DNS: Cloudflare（Xserverドメインからネームサーバー変更）
- 決済: BOOTH → Stripe（Phase 2）

## 主要ドキュメント

- docs/BUSINESS_OVERVIEW.md — ビジネス概要・収益モデル・競合分析
- docs/EXIT_STRATEGY.md — EXIT戦略・ロードマップ・売却評価額
- docs/EXIT_TODO.md — TODOトラッカー（WS0〜WS4）
- docs/SEO_GUIDELINE.md — SEO・記事作成ルール
- docs/IMPLEMENTATION_GUIDE.md — 技術実装ガイド
- docs/DESIGN_SYSTEM.md — デザインシステム

## 現状サマリー（2026年3月15日時点）

- ドメイン: iwor.jp 取得済み、Cloudflare接続はまだ
- naikanavi記事: 173本（iwor.jpへの移植はまだ）
- 臨床ツール: 一部実装済み（iwor.jpへの移植はまだ）
- tellmedu: WordPress、年売上15万、閉鎖予定
- 収益: 実績ほぼゼロ（最初の1円がまだ）
- GSC: 未登録、PVデータなし

## デプロイ方法（現行naikanavi → 将来iwor.jpに移行）

```bash
# Worker
cd /path/to/project && npx wrangler deploy
# HTML
curl -X POST https://naikanavi.com/admin/upload-html \
  -H "X-Admin-Key: （別途参照）" \
  -H "Content-Type: text/html" \
  --data-binary @demo_v14_app.html
```
