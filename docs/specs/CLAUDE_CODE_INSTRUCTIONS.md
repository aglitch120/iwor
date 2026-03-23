# Claude Code 実行手順書

## 前提

- Claude Code がインストール済み
- GitHub アクセストークンが設定済み
- ローカルリポジトリ: /Users/tasuku/Desktop/iwor

---

## Phase 0: インフラ整備（初回のみ、10分）

### 0-1. Claude.aiで生成したファイルをリポジトリに配置

ローカルで手動実行（Claude Codeではなく手作業）:

```bash
cd /Users/tasuku/Desktop/iwor

# ドキュメント
mkdir -p docs
# Claude.aiからダウンロードした以下のファイルをdocsに配置:
#   - CARD_GENERATION_PIPELINE.md
#   - STUDY_DECK_MASTER_PLAN.md

# エージェント定義
mkdir -p .claude/agents
# Claude.aiからダウンロードした以下のファイルを配置:
#   - card-generator-agent.md
#   - card-batch-generator-agent.md
#   - card-updater-agent.md

# カードデータ（完成済み4科目）
mkdir -p app/study/data
# Claude.aiからダウンロードした以下のファイルを配置:
#   - junkanki-cards-v2.ts → junkanki-cards.ts にリネーム
#   - kokyuki-cards.ts
#   - shokaki-cards.ts
#   - kantansui-cards.ts
```

### 0-2. Claude Codeでコミット

```bash
cd /Users/tasuku/Desktop/iwor
claude
```

Claude Codeが起動したら:

```
docs/CARD_GENERATION_PIPELINE.md、docs/STUDY_DECK_MASTER_PLAN.md、
.claude/agents/card-generator-agent.md、card-batch-generator-agent.md、card-updater-agent.md、
app/study/data/ に配置した4科目のカードファイルをコミットして。
コミットメッセージ: "feat(study): add card generation pipeline + 4 completed decks (242 cards)"
```

---

## Phase 1: 内科メジャー残り5科目

Claude Codeを起動した状態で、**1科目ずつ**以下のプロンプトを投げる。

### 1-1. 代謝・内分泌

```
docs/CARD_GENERATION_PIPELINE.md を読んで、代謝・内分泌のカードデッキを生成して。

過去問データ: https://medical-illustration.club/kakomon-chart/med/tag/tag/代謝・内分泌疾患
をweb_fetchで取得して過去問リストを作成。

手順:
1. 過去問を7パターンに分類
2. 禁忌肢を全て抽出
3. 6カテゴリのカードを生成（目標55枚前後）
4. 合格シミュレーション（85%以上を確認）
5. app/study/data/taisha-cards.ts に出力
6. コミット: "feat(study): add 代謝・内分泌 deck"

ID prefix: ts（例: ts-kinki-001）
既に完成している循環器デッキ（app/study/data/junkanki-cards.ts）を参考フォーマットにして。
```

### 1-2. 脳・神経

```
docs/CARD_GENERATION_PIPELINE.md に従って、脳・神経のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/脳・神経疾患

目標60枚前後。ID prefix: ns。
出力: app/study/data/shinkei-cards.ts
コミット: "feat(study): add 脳・神経 deck"
```

### 1-3. 腎臓

```
パイプラインに従って、腎臓のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/腎臓疾患

目標45枚前後。ID prefix: jz。
出力: app/study/data/jinzo-cards.ts
コミット: "feat(study): add 腎臓 deck"
```

### 1-4. 血液

```
パイプラインに従って、血液のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/血液疾患

目標40枚前後。ID prefix: ke。
出力: app/study/data/ketsueki-cards.ts
コミット: "feat(study): add 血液 deck"
```

### 1-5. 感染症

```
パイプラインに従って、感染症のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/感染症

目標50枚前後。ID prefix: ks。
出力: app/study/data/kansensho-cards.ts
コミット: "feat(study): add 感染症 deck"
```

### Phase 1 完了後

```
git push origin main
```

---

## Phase 2: 内科マイナー＋横断

### 2-1. 自己免疫

```
パイプラインに従って、自己免疫疾患のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/自己免疫疾患

目標25枚前後。ID prefix: mk。
出力: app/study/data/meneki-cards.ts
コミット: "feat(study): add 自己免疫 deck"
```

### 2-2. アレルギー

```
パイプラインに従って、アレルギー疾患のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/アレルギー疾患

目標15枚前後。ID prefix: al。
出力: app/study/data/allergy-cards.ts
コミット: "feat(study): add アレルギー deck"
```

### 2-3. 救急・集中治療

```
パイプラインに従って、救急・集中治療のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/救急・集中治療

目標25枚前後。ID prefix: ky。
出力: app/study/data/kyukyu-cards.ts
コミット: "feat(study): add 救急・集中治療 deck"
```

### Phase 2 完了後: push

---

## Phase 3: 外科系

### 3-1 〜 3-5

同じパターンで以下を順次実行:

| # | 科目 | slug | prefix | file | 枚数 |
|---|------|------|--------|------|------|
| 3-1 | 小児科 | 小児科 | sn | shounika-cards.ts | 45 |
| 3-2 | 産科 | 産科 | sa | sanka-cards.ts | 40 |
| 3-3 | 婦人科 | 婦人科 | fj | fujinka-cards.ts | 35 |
| 3-4 | 整形外科 | 整形外科 | sk | seikei-cards.ts | 30 |
| 3-5 | 泌尿器科 | 泌尿器科 | hn | hinyoki-cards.ts | 25 |

プロンプトテンプレート:

```
パイプラインに従って、{科目名}のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/{slug}

目標{枚数}枚前後。ID prefix: {prefix}。
出力: app/study/data/{file}
コミット: "feat(study): add {科目名} deck"
```

---

## Phase 4: マイナー科目

| # | 科目 | slug | prefix | file | 枚数 |
|---|------|------|--------|------|------|
| 4-1 | 精神科 | 精神科 | ss | seishin-cards.ts | 30 |
| 4-2 | 皮膚科 | 皮膚科 | hf | hifu-cards.ts | 20 |
| 4-3 | 眼科 | 眼科 | gn | ganka-cards.ts | 18 |
| 4-4 | 耳鼻咽喉科 | 耳鼻咽喉科 | jb | jibi-cards.ts | 18 |
| 4-5 | 外科・周術期 | 外科・周術期管理 | gk | geka-cards.ts | 15 |
| 4-6 | 放射線科 | 放射線科 | hs | hoshasen-cards.ts | 12 |
| 4-7 | 麻酔科 | 麻酔科 | ms | masui-cards.ts | 8 |

---

## Phase 5: 横断系

### 5-1. 必修問題

```
パイプラインに従って、必修問題のカードデッキを生成して。

過去問: https://medical-illustration.club/kakomon-chart/med/tag/tag/必修問題

目標40枚前後。ID prefix: hs。
注意: 必修は全科目から出るため、既存デッキと重複しない「必修特有の知識」だけをカード化。
例: 医療面接のマナー、バイタルサインの正常値、基本的な身体診察手技、医療安全。
出力: app/study/data/hisshu-cards.ts
コミット: "feat(study): add 必修問題 deck"
```

### 5-2. 公衆衛生

```
パイプラインに従って、公衆衛生のカードデッキを生成して。

過去問ソース: web検索で「医師国家試験 公衆衛生 過去問 頻出」を検索して出題傾向を把握。

目標35枚前後。ID prefix: kw。
出力: app/study/data/koshueisei-cards.ts
コミット: "feat(study): add 公衆衛生 deck"
```

### 5-3. 医学総論（倫理・法律）

```
パイプラインに従って、医学総論（医療倫理・法律）のカードデッキを生成して。

テーマ: 医師法、インフォームドコンセント、守秘義務、脳死判定、臓器移植法、
       医療安全（インシデントレポート）、感染症法の分類、死亡診断書/死体検案書。

目標20枚前後。ID prefix: sr。
出力: app/study/data/igakusoron-cards.ts
コミット: "feat(study): add 医学総論 deck"
```

---

## Phase 6: 仕上げ

### 6-1. index.tsを生成

```
app/study/data/ の全カードファイルをimport/re-exportするindex.tsを生成して。
全デッキのメタデータ（科目名、枚数、バージョン）も一覧化するオブジェクトを含めて。
コミット: "feat(study): add deck index with all subjects"
```

### 6-2. 全体統計の確認

```
app/study/data/ の全.tsファイルを読んで、以下を集計して:
- 科目数
- 総カード枚数
- カテゴリ別の枚数（禁忌、症例→診断、次の一手、パターン認識、鑑別、薬剤）
- 難易度別の枚数
- 禁忌カードの総数
結果をdocs/DECK_STATS.md に出力。
コミット: "docs: add deck statistics"
```

### 6-3. push

```
git push origin main
```

---

## トラブルシューティング

### web_fetchが失敗する場合

過去問チャートのURLが取得できない場合:

```
過去問チャートのURLが取得できないので、
web_searchで「医師国家試験 {科目名} 過去問 頻出テーマ」を検索して、
出題傾向を把握してからカードを生成して。
```

### カード数が少なすぎる/多すぎる場合

```
{科目名}のカードが{N}枚だが、{目標}枚を目標にしている。
過去問の出題パターン分析を見直して、カバーされていないテーマがないか確認して。
不足していればカードを追加、過剰なら重複を統合して。
```

### 合格シミュレーションが85%未満の場合

```
{科目名}の合格シミュレーションが{X}%で85%未達。
カバーされていない出題テーマを特定して、不足カードを追加して。
特に禁忌肢の漏れがないか再確認。
```

---

## 年次アップデート（毎年4-5月）

新国試の問題＋正答が厚労省から公開されたら:

```
第{N}回医師国家試験の問題が公開された。
docs/CARD_GENERATION_PIPELINE.md の「年次アップデート」セクションに従って、
全科目のカードデッキを更新して。

手順:
1. 過去問チャート https://medical-illustration.club/kakomon-chart/med から新問題を取得
2. 各科目の既存カードで解けるか検証
3. 解けない問題に対してカードを追加
4. app/study/data/_meta/update-history.json に記録
5. コミット: "feat(study): update decks for 第{N}回国試"
6. push
```

---

## 所要時間の目安

| Phase | 科目数 | 1科目あたり | 合計 |
|-------|--------|-----------|------|
| 0 (インフラ) | - | - | 10分 |
| 1 (内科メジャー) | 5 | 10分 | 50分 |
| 2 (内科マイナー) | 3 | 8分 | 24分 |
| 3 (外科系) | 5 | 8分 | 40分 |
| 4 (マイナー) | 7 | 5分 | 35分 |
| 5 (横断系) | 3 | 10分 | 30分 |
| 6 (仕上げ) | - | - | 10分 |
| **合計** | **23** | - | **約3.5時間** |

Claude Codeは並列実行できないので、1科目ずつ順番に投げる。
各科目の完了を待ってから次を投げること。
