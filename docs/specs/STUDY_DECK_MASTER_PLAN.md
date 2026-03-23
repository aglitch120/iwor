# Study デッキ全科目生成＋自動アップデート計画

## 現状

### 完成済み (4科目 / 242枚)

| 科目 | ファイル | 枚数 | 正答率 |
|------|---------|------|--------|
| 循環器 | junkanki-cards-v2.ts | 63 | 87% |
| 呼吸器 | kokyuki-cards.ts | 62 | 87% |
| 消化器(消化管) | shokaki-cards.ts | 63 | 89% |
| 肝胆膵 | kantansui-cards.ts | 54 | 91% |

### 残り科目 (20科目)

過去問チャートの分野タグから抽出した全科目:

| # | 科目 | URL slug | 推定問題数 | 推定カード数 | 優先度 |
|---|------|----------|-----------|-------------|--------|
| 5 | 代謝・内分泌 | 代謝・内分泌疾患 | 80+ | 55 | ★★★ |
| 6 | 脳・神経 | 脳・神経疾患 | 80+ | 60 | ★★★ |
| 7 | 腎臓 | 腎臓疾患 | 60+ | 45 | ★★★ |
| 8 | 血液 | 血液疾患 | 50+ | 40 | ★★☆ |
| 9 | 感染症 | 感染症 | 70+ | 50 | ★★★ |
| 10 | 自己免疫 | 自己免疫疾患 | 30+ | 25 | ★★☆ |
| 11 | アレルギー | アレルギー疾患 | 20+ | 15 | ★☆☆ |
| 12 | 小児科 | 小児科 | 60+ | 45 | ★★★ |
| 13 | 産科 | 産科 | 50+ | 40 | ★★☆ |
| 14 | 婦人科 | 婦人科 | 40+ | 35 | ★★☆ |
| 15 | 整形外科 | 整形外科 | 40+ | 30 | ★★☆ |
| 16 | 泌尿器科 | 泌尿器科 | 30+ | 25 | ★☆☆ |
| 17 | 精神科 | 精神科 | 40+ | 30 | ★★☆ |
| 18 | 皮膚科 | 皮膚科 | 30+ | 20 | ★☆☆ |
| 19 | 眼科 | 眼科 | 25+ | 18 | ★☆☆ |
| 20 | 耳鼻咽喉科 | 耳鼻咽喉科 | 25+ | 18 | ★☆☆ |
| 21 | 救急・集中治療 | 救急・集中治療 | 30+ | 25 | ★★☆ |
| 22 | 外科・周術期 | 外科・周術期管理 | 20+ | 15 | ★☆☆ |
| 23 | 放射線科 | 放射線科 | 15+ | 12 | ★☆☆ |
| 24 | 麻酔科 | 麻酔科 | 10+ | 8 | ★☆☆ |

**横断系（独立デッキ）:**

| # | 科目 | 推定カード数 | 備考 |
|---|------|-------------|------|
| 25 | 必修問題 | 40 | 全科目から必修レベルを抽出 |
| 26 | 公衆衛生 | 35 | 暗記系が多い、カード向き |
| 27 | 医学総論（倫理/法律） | 20 | 医師法、インフォームドコンセント等 |

**推定総カード数: 約850-900枚**
1日20枚×45日で1周。FSRSなら復習負荷は20-30%軽減。

---

## Claude Codeでの全科目バッチ生成

### ファイル配置

```
app/study/data/
├── index.ts                    # 全デッキのexport
├── junkanki-cards.ts           # ✅ 循環器
├── kokyuki-cards.ts            # ✅ 呼吸器
├── shokaki-cards.ts            # ✅ 消化器(消化管)
├── kantansui-cards.ts          # ✅ 肝胆膵
├── taisha-cards.ts             # 代謝・内分泌
├── shinkei-cards.ts            # 脳・神経
├── jinzo-cards.ts              # 腎臓
├── ketsueki-cards.ts           # 血液
├── kansensho-cards.ts          # 感染症
├── meneki-cards.ts             # 自己免疫
├── allergy-cards.ts            # アレルギー
├── shounika-cards.ts           # 小児科
├── sanka-cards.ts              # 産科
├── fujinka-cards.ts            # 婦人科
├── seikei-cards.ts             # 整形外科
├── hinyoki-cards.ts            # 泌尿器科
├── seishin-cards.ts            # 精神科
├── hifu-cards.ts               # 皮膚科
├── ganka-cards.ts              # 眼科
├── jibi-cards.ts               # 耳鼻咽喉科
├── kyukyu-cards.ts             # 救急・集中治療
├── geka-cards.ts               # 外科・周術期
├── hoshasen-cards.ts           # 放射線科
├── masui-cards.ts              # 麻酔科
├── hisshu-cards.ts             # 必修問題
├── koshueisei-cards.ts         # 公衆衛生
├── igakusoron-cards.ts         # 医学総論
└── _meta/
    ├── generation-log.json     # 生成ログ
    ├── coverage-matrix.json    # 過去問カバレッジ
    └── update-history.json     # アップデート履歴
```

### Claude Code エージェント設計

```
.claude/agents/
├── card-generator.md           # ✅ 既に作成済み（1科目生成用）
├── card-batch-generator.md     # NEW: 全科目バッチ生成
├── card-updater.md             # NEW: 新国試でのアップデート
└── card-quality-checker.md     # NEW: 品質チェック
```

---

## card-batch-generator エージェント

### 実行コマンド

```bash
# Claude Code ターミナルから
claude "全科目のカードデッキを生成して" --agent card-batch-generator
```

### 処理フロー

```
1. 過去問チャートから全科目の過去問データを取得
   ↓
2. 科目ごとにStep 1-4を実行（CARD_GENERATION_PIPELINE.mdに従う）
   ↓
3. 各科目のカードを .ts ファイルとして出力
   ↓
4. index.ts を更新（全デッキをexport）
   ↓
5. generation-log.json に記録
   ↓
6. コミット＆プッシュ
```

### 過去問データ取得スクリプト

```typescript
// scripts/fetch-kakomon.ts
// 過去問チャートから科目別の過去問リストを取得

const BASE_URL = "https://medical-illustration.club/kakomon-chart/med/tag/tag/";

const SUBJECTS = [
  { slug: "循環器疾患", file: "junkanki", name: "循環器" },
  { slug: "呼吸器疾患", file: "kokyuki", name: "呼吸器" },
  { slug: "消化器疾患(消化管)", file: "shokaki", name: "消化器(消化管)" },
  { slug: "消化器疾患(肝胆膵)", file: "kantansui", name: "肝胆膵" },
  { slug: "代謝・内分泌疾患", file: "taisha", name: "代謝・内分泌" },
  { slug: "脳・神経疾患", file: "shinkei", name: "脳・神経" },
  { slug: "腎臓疾患", file: "jinzo", name: "腎臓" },
  { slug: "血液疾患", file: "ketsueki", name: "血液" },
  { slug: "感染症", file: "kansensho", name: "感染症" },
  { slug: "自己免疫疾患", file: "meneki", name: "自己免疫" },
  { slug: "アレルギー疾患", file: "allergy", name: "アレルギー" },
  { slug: "小児科", file: "shounika", name: "小児科" },
  { slug: "産科", file: "sanka", name: "産科" },
  { slug: "婦人科", file: "fujinka", name: "婦人科" },
  { slug: "整形外科", file: "seikei", name: "整形外科" },
  { slug: "泌尿器科", file: "hinyoki", name: "泌尿器科" },
  { slug: "精神科", file: "seishin", name: "精神科" },
  { slug: "皮膚科", file: "hifu", name: "皮膚科" },
  { slug: "眼科", file: "ganka", name: "眼科" },
  { slug: "耳鼻咽喉科", file: "jibi", name: "耳鼻咽喉科" },
  { slug: "救急・集中治療", file: "kyukyu", name: "救急・集中治療" },
  { slug: "外科・周術期管理", file: "geka", name: "外科・周術期" },
  { slug: "放射線科", file: "hoshasen", name: "放射線科" },
  { slug: "麻酔科", file: "masui", name: "麻酔科" },
];

// 各科目のURLを生成
function getSubjectURL(slug: string): string {
  return BASE_URL + encodeURIComponent(slug);
}
```

### バッチ実行の注意点

1科目あたりの生成にはClaude Codeで約5-10分かかる（web_fetch＋GL確認＋カード生成＋検証）。

**推奨実行順序（優先度順）:**

```
Phase 1（内科メジャー、各5-10分）:
  ✅ 循環器 → ✅ 呼吸器 → ✅ 消化器(消化管) → ✅ 肝胆膵
  → 代謝・内分泌 → 脳・神経 → 腎臓 → 血液 → 感染症

Phase 2（内科マイナー＋横断）:
  → 自己免疫 → アレルギー → 救急・集中治療

Phase 3（外科系）:
  → 小児科 → 産科 → 婦人科 → 整形外科 → 泌尿器科

Phase 4（マイナー外科＋その他）:
  → 精神科 → 皮膚科 → 眼科 → 耳鼻咽喉科 → 放射線科 → 麻酔科

Phase 5（横断系）:
  → 必修問題 → 公衆衛生 → 医学総論
```

各Phaseの末尾でコミット＆プッシュ。

---

## 自動アップデートシステム (card-updater)

### トリガー

新しい国試（例: 第120回, 2026年2月実施）の問題＋正答が厚労省から公開されたタイミング。

### 処理フロー

```
[入力] 新しい国試の過去問データ（過去問チャートが更新されたら取得）
    ↓
Step A: 各科目の新問題を取得
    ↓
Step B: 既存カードで解けるか検証（シミュレーション）
    ↓
Step C: 解けない問題を特定→原因を分類
    ↓
Step D: 必要なカードを追加（差分生成）
    ↓
Step E: カバレッジ再計算→85%以上を確認
    ↓
Step F: コミット＆プッシュ
```

### Step B: 「解けるか検証」の自動化

```typescript
// scripts/verify-coverage.ts

interface VerificationResult {
  questionId: string;      // "120A15"
  subject: string;         // "循環器"
  canSolve: boolean;       // 既存カードで解けるか
  matchedCardIds: string[];// マッチしたカードID
  reason?: string;         // 解けない理由
  // 解けない場合の分類:
  gapType?: 
    | "new_disease"        // 新しい疾患（カードに存在しない）
    | "new_treatment"      // 治療法のアップデート
    | "new_guideline"      // ガイドライン変更
    | "new_pattern"        // 新しい出題パターン
    | "edge_case"          // 既存概念のエッジケース
    | "image_only"         // 画像問題で解決困難
}
```

### Step C-D: 差分カード生成プロンプト

```
以下は第{N}回医師国家試験の新問題のうち、
既存のカードデッキでは解けなかった問題です。

各問題について:
1. なぜ既存カードで解けなかったか（gapType）
2. 追加すべきカード（6カテゴリのどれか）
3. カードの内容

を生成してください。

既存カードで既にカバーされている概念と重複しないこと。
最小限のカード追加で、この問題が解けるようになること。

[解けなかった問題リスト]
```

### アップデート頻度と規模

```
年次アップデート（国試公開後、4-5月）:
  - 新しい国試の全問題を検証
  - 解けない問題に対してカード追加
  - 推定追加枚数: 10-30枚/年（新概念＋GL変更分）
  - 古くなったカード（GL変更で誤りになった）の修正/削除

ガイドライン更新時（随時）:
  - 主要GLの改訂をweb検索で検知
  - 数値や推奨が変わったカードを更新
  - 新薬承認に伴うカード追加
```

### update-history.json の構造

```json
{
  "updates": [
    {
      "date": "2026-05-01",
      "trigger": "第120回国試 問題公開",
      "newQuestions": 400,
      "uncoveredQuestions": 18,
      "cardsAdded": 12,
      "cardsModified": 3,
      "cardsRemoved": 0,
      "coverageAfter": {
        "overall": "88%",
        "bySubject": { "循環器": "89%", "呼吸器": "87%", ... }
      }
    }
  ]
}
```

---

## Claude Codeへの組み込み手順

### 1. リポジトリにファイルを配置

```bash
# Claude Codeで実行
cd /path/to/iwor

# パイプラインドキュメント
cp CARD_GENERATION_PIPELINE.md docs/

# エージェント定義
cp card-generator-agent.md .claude/agents/card-generator.md
# + batch-generator, updater, quality-checker を追加

# 完成済みカード（4科目）
mkdir -p app/study/data
cp junkanki-cards-v2.ts app/study/data/junkanki-cards.ts
cp kokyuki-cards.ts app/study/data/
cp shokaki-cards.ts app/study/data/
cp kantansui-cards.ts app/study/data/

# スクリプト
mkdir -p scripts
# fetch-kakomon.ts, verify-coverage.ts を配置

# コミット
git add docs/CARD_GENERATION_PIPELINE.md
git add .claude/agents/card-*.md
git add app/study/data/*.ts
git add scripts/*.ts
git commit -m "feat(study): add card generation pipeline + 4 completed decks (242 cards)"
git push
```

### 2. 残り科目の生成

```bash
# Phase 1: 内科メジャー（1科目ずつ）
claude "代謝・内分泌のカードを作って。過去問チャート: https://medical-illustration.club/kakomon-chart/med/tag/tag/代謝・内分泌疾患" --agent card-generator

# 完了したらコミット
git add app/study/data/taisha-cards.ts
git commit -m "feat(study): add 代謝・内分泌 deck"

# 以降、科目ごとに繰り返し
```

### 3. 年次アップデート（毎年4-5月）

```bash
# 新国試の問題が公開されたら
claude "第120回国試の問題が公開された。カードデッキを更新して" --agent card-updater

# updaterが自動的に:
# 1. 過去問チャートから新問題を取得
# 2. 既存カードとの照合
# 3. 解けない問題へのカード追加
# 4. update-history.json に記録
# 5. コミット＆プッシュ
```

---

## CLAUDE.md への追記内容

```markdown
## Study カードデッキ

### 概要
- 全27科目のフラッシュカードデッキ（app/study/data/）
- パイプライン: docs/CARD_GENERATION_PIPELINE.md
- 過去問ソース: https://medical-illustration.club/kakomon-chart/med

### カード生成
- `@card-generator` で1科目ずつ生成
- `@card-batch-generator` で残り科目を一括生成
- 生成後は必ず合格シミュレーション（85%目標）で検証

### 年次アップデート
- `@card-updater` で新国試の問題を検証→差分カード追加
- ガイドライン変更時は該当カードを手動で更新

### 品質基準
- 禁忌肢: 全数独立カード化（漏れ禁止）
- front: 症例提示 or 臨床判断形式（「〜を述べよ」禁止）
- 著作権: 過去問の問題文を直接引用しない
- GL: 数値は最新版で確認済みであること
```

---

## 次のアクション（優先順）

1. **Claude Codeで4科目のカードをリポジトリに配置**（5分）
2. **エージェント定義を .claude/agents/ に配置**（5分）
3. **Phase 1残り: 代謝→脳神経→腎臓→血液→感染症を順次生成**（各10分×5 = 50分）
4. **Phase 2-5: 残り15科目を生成**（各10分×15 = 2.5時間）
5. **横断系3科目を生成**（30分）
6. **全体の合格シミュレーション実行**（20分）

合計所要時間（Claude Code作業）: **約4時間**
