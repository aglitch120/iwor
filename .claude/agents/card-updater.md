# Card Updater Agent

新しい国試が公開されたとき、既存カードデッキを差分アップデートするエージェント。

## 呼び出し方

```
@card-updater 第120回国試が公開された。デッキを更新して
@card-updater ガイドラインが更新された: 2026年版 心不全診療GL
```

## トリガー

1. **年次（4-5月）**: 厚労省が国試の問題＋正答を公開したとき
2. **随時**: 主要ガイドラインが改訂されたとき

## 処理フロー（年次アップデート）

### Step A: 新問題の取得

```bash
# 過去問チャートが更新されているか確認
# URL: https://medical-illustration.club/kakomon-chart/med/tag/tag/{回数}a
# 例: 120a, 120b, 120c, ...
```

過去問チャートがまだ更新されていなければ:
- 厚労省のPDFから直接取得: https://www.mhlw.go.jp/seisakunitsuite/bunya/kenkou_iryou/iryou/topics/
- web_searchで「第{N}回 医師国家試験 問題 正答」を検索

### Step B: 既存カードとの照合

各新問題について:

```
1. 問題のテーマ/疾患を特定
2. 該当科目のカードデッキを読み込む
3. 既存カードの知識だけで正答にたどり着けるか判定
4. 結果を分類:
   - COVERED: 既存カードで解ける
   - GAP_NEW_DISEASE: 新しい疾患でカードがない
   - GAP_NEW_TREATMENT: 治療法が変わった
   - GAP_NEW_GUIDELINE: 数値/基準が変わった
   - GAP_NEW_PATTERN: 新しい出題パターン
   - GAP_EDGE_CASE: 既存概念の細かい知識
   - IMAGE_ONLY: 画像問題でカード化困難
```

### Step C: カバレッジ計算

```
全{N}問中:
  COVERED: {X}問
  GAP_*: {Y}問（カード追加で解決可能）
  IMAGE_ONLY: {Z}問（カード化困難）

現在のカバレッジ: X / (N - Z) = {%}
目標: 85%以上
```

### Step D: 差分カード生成

GAP_* に分類された問題に対して、最小限のカードを追加する。

ルール:
- **既存カードの修正で対応できるなら修正優先**（カード数を増やさない）
- 新カードは CARD_GENERATION_PIPELINE.md の6カテゴリのいずれかに分類
- 禁忌肢が新たに判明したら最優先で追加
- 1問に対して1枚以下が目安（複数問で共有できる概念なら1枚で）

### Step E: ファイル更新

```bash
# 該当科目のカードファイルを更新
# 新カードを既存ファイルの末尾に追加（セクション: "// === 第{N}回 追加分 ==="）

# メタデータ更新
# deck_metadata.version をインクリメント
# deck_metadata.examCoverage の範囲を拡大

# update-history.json に記録
```

### Step F: コミット

```bash
git add app/study/data/*-cards.ts
git add app/study/data/_meta/update-history.json
git commit -m "feat(study): update decks for 第{N}回国試 (+{追加枚数} cards)"
git push
```

## 処理フロー（ガイドライン更新）

### Step 1: 変更内容の特定

```
web_searchで最新GLの変更点を確認
例: 「2026年改訂版 心不全GL 変更点」
```

### Step 2: 影響を受けるカードの特定

```bash
# カードファイル内をgrepして該当するカードを見つける
grep -n "心不全" app/study/data/junkanki-cards.ts
```

### Step 3: カードの修正

- 数値の変更（例: mPAP基準 25→20mmHg）→ 既存カードの数値を修正
- 新薬承認（例: マバカムテン）→ 既存カードに追記 or 新カード追加
- 推奨の変更（例: 治療アルゴリズムの変更）→ 該当カードの書き換え

### Step 4: コミット

```bash
git add app/study/data/{科目}-cards.ts
git commit -m "fix(study): update {科目} cards for {GL名} {年版}"
git push
```

## update-history.json テンプレート

```json
{
  "lastUpdated": "2026-05-01T00:00:00Z",
  "deckVersion": "2.1.0",
  "updates": [
    {
      "date": "2026-05-01",
      "type": "annual_exam",
      "trigger": "第120回医師国家試験 問題公開",
      "details": {
        "totalNewQuestions": 400,
        "coveredByExisting": 352,
        "gapQuestions": 30,
        "imageOnlyQuestions": 18,
        "cardsAdded": 22,
        "cardsModified": 5,
        "cardsRemoved": 1,
        "newCoverageRate": "89%"
      },
      "addedCards": [
        { "id": "jk-dx-017", "subject": "循環器", "reason": "新薬関連の出題" }
      ],
      "modifiedCards": [
        { "id": "jk-drug-006", "subject": "循環器", "reason": "マバカムテンの適応拡大" }
      ]
    },
    {
      "date": "2026-06-15",
      "type": "guideline_update",
      "trigger": "2026年版 不整脈治療GL",
      "details": {
        "cardsModified": 3,
        "affectedSubjects": ["循環器"]
      }
    }
  ]
}
```

## 品質保証

アップデート後に必ず実行:

```
□ 追加カードのID重複チェック
□ 追加カードのfrontが症例提示/臨床判断形式であること
□ 禁忌肢は独立カードになっていること
□ 全体の合格シミュレーション再実行（85%以上を維持）
□ ガイドラインの数値がwebで確認済み
```
